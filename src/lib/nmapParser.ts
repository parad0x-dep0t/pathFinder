import { TargetOS } from '@/types';

export interface ParsedPort {
  port: number;
  protocol: string;
  service: string;
  inferredService: string;
  version?: string;
}

export interface ParsedNmapResult {
  ipOrHostname: string;
  name: string;
  domain?: string;
  os: TargetOS;
  openPorts: number[];
  portServices: Record<number, string>;
  portsDetail: ParsedPort[];
  rawSummary: string;
}

/**
 * Inspects Nmap script output, banner fingerprints, and raw headers
 * to infer the actual service running on non-standard/unknown ports (e.g. port 8978 running HTTP).
 */
export function inferServiceFromBanners(portNum: number, rawService: string, fullText: string): string {
  const normService = (rawService || '').toLowerCase();
  
  // Standard port defaults if already recognizable
  if (normService && normService !== 'unknown' && normService !== 'unrecognized' && normService !== '?') {
    if (normService.includes('http') || normService.includes('ssl/http') || normService.includes('https')) return 'http';
    if (normService.includes('ssh')) return 'ssh';
    if (normService.includes('ftp')) return 'ftp';
    if (normService.includes('smb') || normService.includes('microsoft-ds') || normService.includes('netbios')) return 'smb';
    if (normService.includes('ldap')) return 'ldap';
    if (normService.includes('kerberos')) return 'kerberos';
    if (normService.includes('ms-sql') || normService.includes('mssql')) return 'mssql';
    if (normService.includes('winrm') || normService.includes('wsman')) return 'winrm';
    if (normService.includes('redis')) return 'redis';
    if (normService.includes('domain') || normService.includes('dns')) return 'dns';
    if (normService.includes('ntp') || normService.includes('time') || normService.includes('w32time')) return 'ntp';
    return normService;
  }

  // Look for the specific port block in the Nmap output
  const portSectionRegex = new RegExp(`${portNum}\\/(?:tcp|udp)[\\s\\S]*?(?=(?:\\d+\\/(?:tcp|udp))|$)`, 'i');
  const sectionMatch = fullText.match(portSectionRegex);
  const sectionText = (sectionMatch ? sectionMatch[0] : fullText).toLowerCase();

  // 1. HTTP / Web Service detection in fingerprint strings
  if (
    sectionText.includes('http/1.') ||
    sectionText.includes('http/2') ||
    sectionText.includes('getrequest:') ||
    sectionText.includes('httpoptions:') ||
    sectionText.includes('rtsprequest:') ||
    sectionText.includes('<!doctype html') ||
    sectionText.includes('<html') ||
    sectionText.includes('content-type: text/html') ||
    sectionText.includes('apache') ||
    sectionText.includes('nginx') ||
    sectionText.includes('iis') ||
    sectionText.includes('jetty') ||
    sectionText.includes('badmessage') ||
    sectionText.includes('505 unknown version') ||
    sectionText.includes('400 bad request') ||
    sectionText.includes('200 ok') ||
    sectionText.includes('title>')
  ) {
    return 'http';
  }

  // 2. SSH detection
  if (sectionText.includes('ssh-2.0-') || sectionText.includes('openssh') || sectionText.includes('dropbear') || sectionText.includes('ssh-hostkey')) {
    return 'ssh';
  }

  // 3. FTP detection
  if (sectionText.includes('220 ') && (sectionText.includes('ftp') || sectionText.includes('vsftpd') || sectionText.includes('proftpd') || sectionText.includes('pure-ftpd'))) {
    return 'ftp';
  }

  // 4. Redis detection
  if (sectionText.includes('redis_version') || sectionText.includes('-err wrong pass') || sectionText.includes('+pong') || sectionText.includes('-noauth')) {
    return 'redis';
  }

  // 5. SMB / RPC
  if (sectionText.includes('smb') || sectionText.includes('microsoft-ds') || sectionText.includes('samba') || sectionText.includes('smb-os-discovery')) {
    return 'smb';
  }

  // 6. MSSQL
  if (sectionText.includes('ms-sql') || sectionText.includes('microsoft sql server') || sectionText.includes('tds') || sectionText.includes('ms-sql-info')) {
    return 'mssql';
  }

  return 'unknown';
}

/**
 * Parses Nmap stdout text, grepable output, or XML to extract IP, Hostname, OS, Domain, and Open Ports with banner inference.
 */
export function parseNmapOutput(content: string): ParsedNmapResult {
  const trimmed = content.trim();
  const portsDetail: ParsedPort[] = [];
  const openPortsSet = new Set<number>();
  const portServices: Record<number, string> = {};
  let ipOrHostname = '';
  let name = '';
  let domain = '';
  let os: TargetOS = 'linux';

  // 1. Extract Target IP / Hostname from standard header
  const scanReportMatch = trimmed.match(
    /Nmap scan report for (?:([a-zA-Z0-9.-]+)\s+\(([0-9.]+)\)|([0-9.]+|[a-zA-Z0-9.-]+))/i
  );

  if (scanReportMatch) {
    if (scanReportMatch[1] && scanReportMatch[2]) {
      name = scanReportMatch[1];
      ipOrHostname = scanReportMatch[2];
      if (scanReportMatch[1].includes('.')) {
        domain = scanReportMatch[1];
      }
    } else if (scanReportMatch[3]) {
      const val = scanReportMatch[3];
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val)) {
        ipOrHostname = val;
        name = `Target (${val})`;
      } else {
        name = val;
        ipOrHostname = val;
        if (val.includes('.')) domain = val;
      }
    }
  }

  // Grepable Host match: "Host: 10.10.11.103 (faculty.htb)"
  if (!ipOrHostname) {
    const grepHostMatch = trimmed.match(/Host:\s+([0-9.]+)(?:\s+\(([^)]+)\))?/i);
    if (grepHostMatch) {
      ipOrHostname = grepHostMatch[1];
      name = grepHostMatch[2] || `Target (${ipOrHostname})`;
      if (grepHostMatch[2] && grepHostMatch[2].includes('.')) {
        domain = grepHostMatch[2];
      }
    }
  }

  // 2. Extract Operating System hints
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('os: windows') ||
    lower.includes('service info: os: windows') ||
    lower.includes('microsoft-ds') ||
    lower.includes('msrpc') ||
    lower.includes('windows 10') ||
    lower.includes('windows server') ||
    lower.includes('active directory')
  ) {
    os = 'windows';
  } else if (
    lower.includes('os: linux') ||
    lower.includes('service info: os: linux') ||
    lower.includes('ubuntu') ||
    lower.includes('debian') ||
    lower.includes('centos') ||
    lower.includes('apache')
  ) {
    os = 'linux';
  }

  // Domain hints in Nmap scripts
  const domainMatch = trimmed.match(/(?:Domain|domain_name|Forest):\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (domainMatch && domainMatch[1]) {
    domain = domainMatch[1];
  }

  // 3. Extract Open Ports from standard Nmap output
  const portRegex = /^(\d+)\/(tcp|udp)\s+open\s+([a-zA-Z0-9_\-\?]+)(?:\s+(.*))?$/gim;
  let match: RegExpExecArray | null;

  while ((match = portRegex.exec(trimmed)) !== null) {
    const portNum = parseInt(match[1], 10);
    const protocol = match[2].toLowerCase();
    const service = match[3];
    const version = match[4]?.trim();

    if (!isNaN(portNum) && portNum > 0 && portNum <= 65535) {
      openPortsSet.add(portNum);
      const inferred = inferServiceFromBanners(portNum, service, trimmed);
      portServices[portNum] = inferred;
      portsDetail.push({
        port: portNum,
        protocol,
        service,
        inferredService: inferred,
        version: version || undefined,
      });
    }
  }

  // Grepable format fallback
  if (openPortsSet.size === 0) {
    const grepPortsRegex = /(\d+)\/open\/(tcp|udp)\/\/([^\/]*)\/\/([^\/]*)\//gi;
    let gMatch: RegExpExecArray | null;
    while ((gMatch = grepPortsRegex.exec(trimmed)) !== null) {
      const portNum = parseInt(gMatch[1], 10);
      const protocol = gMatch[2].toLowerCase();
      const service = gMatch[3] || 'unknown';
      const version = gMatch[4]?.trim();

      if (!isNaN(portNum)) {
        openPortsSet.add(portNum);
        const inferred = inferServiceFromBanners(portNum, service, trimmed);
        portServices[portNum] = inferred;
        portsDetail.push({
          port: portNum,
          protocol,
          service,
          inferredService: inferred,
          version: version || undefined,
        });
      }
    }
  }

  // XML format fallback
  if (openPortsSet.size === 0 && trimmed.includes('<nmaprun')) {
    const xmlPortRegex = /<port protocol="(tcp|udp)" portid="(\d+)">\s*<state state="open"[^>]*\/>(?:[\s\S]*?<service name="([^"]*)")?/gi;
    let xMatch: RegExpExecArray | null;
    while ((xMatch = xmlPortRegex.exec(trimmed)) !== null) {
      const protocol = xMatch[1];
      const portNum = parseInt(xMatch[2], 10);
      const service = xMatch[3] || 'unknown';

      if (!isNaN(portNum)) {
        openPortsSet.add(portNum);
        const inferred = inferServiceFromBanners(portNum, service, trimmed);
        portServices[portNum] = inferred;
        portsDetail.push({
          port: portNum,
          protocol,
          service,
          inferredService: inferred,
        });
      }
    }
  }

  const sortedPorts = Array.from(openPortsSet).sort((a, b) => a - b);

  return {
    ipOrHostname: ipOrHostname || '10.10.10.10',
    name: name || (ipOrHostname ? `Target (${ipOrHostname})` : 'Target Machine'),
    domain: domain || undefined,
    os,
    openPorts: sortedPorts,
    portServices,
    portsDetail,
    rawSummary: `Discovered ${sortedPorts.length} open port(s) on ${ipOrHostname || 'target'} (${os.toUpperCase()}).`,
  };
}
