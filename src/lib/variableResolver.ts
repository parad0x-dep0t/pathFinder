import { VariableContext } from '@/types';

export interface TokenPart {
  type: 'text' | 'variable';
  raw: string;
  varName?: string;
  fallback?: string;
  resolvedValue?: string;
  isResolved?: boolean;
}

export interface ResolvedCommandResult {
  resolvedString: string;
  tokens: TokenPart[];
  variablesUsed: string[];
  unresolvedCount: number;
}

export function resolveCommandTemplate(
  template: string,
  context: VariableContext
): ResolvedCommandResult {
  const { target, activeCredential, customVars = {} } = context;

  // Regex to match {{VAR_NAME}} or {{VAR_NAME|default_value}}
  const regex = /\{\{([A-Za-z0-9_]+)(?:\|([^}]*))?\}\}/g;
  
  const tokens: TokenPart[] = [];
  const variablesUsed: string[] = [];
  let unresolvedCount = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;
    const fullMatch = match[0];
    const varName = match[1].toUpperCase();
    const fallback = match[2] !== undefined ? match[2] : undefined;

    // Push preceding text if any
    if (matchStart > lastIndex) {
      tokens.push({
        type: 'text',
        raw: template.slice(lastIndex, matchStart),
      });
    }

    if (!variablesUsed.includes(varName)) {
      variablesUsed.push(varName);
    }

    // Resolve variable based on context
    let resolvedValue: string | undefined = undefined;

    if (customVars[varName] !== undefined && customVars[varName] !== '') {
      resolvedValue = customVars[varName];
    } else {
      switch (varName) {
        case 'TARGET':
        case 'IP':
        case 'HOST':
          resolvedValue = target.ipOrHostname || fallback || '10.10.10.10';
          break;

        case 'DOMAIN':
        case 'REALM':
          resolvedValue =
            activeCredential?.domain ||
            target.domain ||
            fallback ||
            'corp.local';
          break;

        case 'USERNAME':
        case 'USER':
          resolvedValue =
            activeCredential?.username ||
            (target.credentials.length > 0 ? target.credentials[0].username : undefined) ||
            fallback ||
            'admin';
          break;

        case 'PASSWORD':
        case 'PASS':
          resolvedValue =
            activeCredential?.password ||
            (target.credentials.length > 0 ? target.credentials[0].password : undefined) ||
            fallback ||
            '';
          break;

        case 'HASH':
        case 'NTLM':
          resolvedValue =
            activeCredential?.hash ||
            (target.credentials.length > 0 ? target.credentials[0].hash : undefined) ||
            fallback ||
            'aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0';
          break;

        case 'TARGET_URL':
        case 'URL': {
          const webPort =
            target.openPorts.find(
              (p) =>
                target.portServices?.[p] === 'http' ||
                target.portServices?.[p] === 'https' ||
                [80, 443, 8080, 8000, 8443, 8978].includes(p)
            ) ||
            target.openPorts[0] ||
            80;
          const proto =
            webPort === 443 || target.portServices?.[webPort] === 'https'
              ? 'https'
              : 'http';
          if (webPort === 80 && proto === 'http') {
            resolvedValue = `http://${target.ipOrHostname || '10.10.10.10'}`;
          } else if (webPort === 443 && proto === 'https') {
            resolvedValue = `https://${target.ipOrHostname || '10.10.10.10'}`;
          } else {
            resolvedValue = `${proto}://${target.ipOrHostname || '10.10.10.10'}:${webPort}`;
          }
          break;
        }

        case 'PORT': {
          const nonStdPort = target.openPorts.find((p) => p !== 80 && p !== 443 && p !== 22);
          resolvedValue =
            customVars['PORT'] ||
            (nonStdPort ? String(nonStdPort) : undefined) ||
            fallback ||
            (target.openPorts.length > 0 ? String(target.openPorts[0]) : '80');
          break;
        }

        default:
          resolvedValue = fallback;
          break;
      }
    }

    const isSensitive = ['PASSWORD', 'PASS', 'HASH', 'NTLM', 'SECRET'].includes(varName);
    if (context.isStreamerMode && isSensitive && resolvedValue) {
      resolvedValue = '••••••••';
    }

    const isResolved = resolvedValue !== undefined;
    if (!isResolved) {
      unresolvedCount++;
    }

    tokens.push({
      type: 'variable',
      raw: fullMatch,
      varName,
      fallback,
      resolvedValue: resolvedValue ?? fullMatch,
      isResolved,
    });

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < template.length) {
    tokens.push({
      type: 'text',
      raw: template.slice(lastIndex),
    });
  }

  const resolvedString = tokens
    .map((t) => (t.type === 'variable' ? t.resolvedValue : t.raw))
    .join('');

  return {
    resolvedString,
    tokens,
    variablesUsed,
    unresolvedCount,
  };
}
