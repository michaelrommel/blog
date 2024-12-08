---
thumbnailUrl: "/articles/assets/2022-01-23-wireguard-wsl/thumbnail.svg"
thumbnailTitle: "Schematic network diagram"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": '2024-08-07T16:12:00+01:00',
    "datePublished": '2022-01-23T00:08:00+01:00',
    "headline": "Setup of Wireguard with WSL2",
    "abstract": "This is a short article how to connect a WSL2 subsystem to a development network behind a VPN server"
}
tags: ["locked", "create", "code", "linux"]
published: true
---

# Setup of Wireguard with WSL2

## Contents

## Overview

::::div{.grid-left-right}

:::img{.img-right}
![DevNet](/articles/assets/2022-01-23-wireguard-wsl/network-overview.svg 'Infrastructure Lab Network')
:::

This is an example networking setup, where there is a home office user connected
to a remote network via a VPN. Inside this network is a separated development
network with a gateway host firewalling it off from the rest of the network.

The challenge is to securely bridge those networks, so that it is possible to
connect from inside the WSL2 container on the user's computer to individual
hosts inside the development network directly, i.e. by connecting to the
`192.168.10.0/24` addresses.

::::

## WSL2 Setup

By default the WSL2 installation has a random IP address and network
assigned every time the computer restarts or the WSL is
shutdown/terminated and restarts. This does not allow us to use a static
IP configuration, which is needed to setup the remote routing table and
allowed IPs of wireguard.

To overcome this limitation we need to add an additional IP address to the
WSL network adapter on the Windows side and the Linux side:

Windows (Powershell):

```powershell
New-NetIPAddress -InterfaceAlias "vEthernet (WSL)" -IPAddress 192.168.140.17
  -PrefixLength 28
New-NetRoute -DestinationPrefix "192.168.140.0/24" -InterfaceAlias "vEthernet (WSL)"
  -NextHop 192.168.140.18
New-NetRoute -DestinationPrefix "192.168.10.0/24" -InterfaceAlias "vEthernet (WSL)"
  -NextHop 192.168.140.18
```

Linux:

```shell
/sbin/ip addr add 192.168.140.18/30 dev eth0
```

After that we can ping the Linux WSL2 IP from Windows (but not vice
versa!) and see the added routes:

```
Ethernet adapter vEthernet (WSL):

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Hyper-V Virtual Ethernet Adapter #2
   Physical Address. . . . . . . . . : 00-15-5D-35-A0-BC
   DHCP Enabled. . . . . . . . . . . : No
   Autoconfiguration Enabled . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 172.27.0.1(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   IPv4 Address. . . . . . . . . . . : 192.168.140.17(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.252
   Default Gateway . . . . . . . . . :
   DHCPv4 Class ID . . . . . . . . . : ra106
   NetBIOS over Tcpip. . . . . . . . : Enabled

PS C:\WINDOWS\system32> ping 192.168.140.18

Pinging 192.168.140.18 with 32 bytes of data:
Reply from 192.168.140.18: bytes=32 time=1ms TTL=64
Reply from 192.168.140.18: bytes=32 time=2ms TTL=64
Reply from 192.168.140.18: bytes=32 time=1ms TTL=64

Ping statistics for 192.168.140.18:
    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 2ms, Average = 1ms
Control-C

PS C:\WINDOWS\system32> route print
===========================================================================
Interface List
 37...00 15 5d 7b 2e f4 ......Hyper-V Virtual Ethernet Adapter
 48...00 15 5d 35 a0 bc ......Hyper-V Virtual Ethernet Adapter #2
 24...14 cb 19 ca 90 ff ......Intel(R) Ethernet Connection (10) I219-LM
 14...00 ff 80 b5 0c fb ......Zscaler Network Adapter 1.0.2.0
  1...........................Software Loopback Interface 1
===========================================================================

IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0   192.168.13.135   192.168.13.185     25
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
        127.0.0.1  255.255.255.255         On-link         127.0.0.1    331
  127.255.255.255  255.255.255.255         On-link         127.0.0.1    331
       172.27.0.0    255.255.240.0         On-link        172.27.0.1    271
       172.27.0.1  255.255.255.255         On-link        172.27.0.1    271
    172.27.15.255  255.255.255.255         On-link        172.27.0.1    271
     192.168.10.0    255.255.255.0   192.168.140.18       172.27.0.1    271
     192.168.13.0    255.255.255.0         On-link    192.168.13.185    281
   192.168.13.185  255.255.255.255         On-link    192.168.13.185    281
   192.168.13.255  255.255.255.255         On-link    192.168.13.185    281
    192.168.140.0    255.255.255.0   192.168.140.18       172.27.0.1    271
   192.168.140.16  255.255.255.252         On-link        172.27.0.1    271
   192.168.140.17  255.255.255.255         On-link        172.27.0.1    271
   192.168.140.19  255.255.255.255         On-link        172.27.0.1    271
    192.168.240.0    255.255.240.0         On-link     192.168.240.1    271
    192.168.240.1  255.255.255.255         On-link     192.168.240.1    271
  192.168.255.255  255.255.255.255         On-link     192.168.240.1    271
        224.0.0.0        240.0.0.0         On-link         127.0.0.1    331
        224.0.0.0        240.0.0.0         On-link    192.168.13.185    281
        224.0.0.0        240.0.0.0         On-link        172.27.0.1    271
        224.0.0.0        240.0.0.0         On-link     192.168.240.1    271
  255.255.255.255  255.255.255.255         On-link         127.0.0.1    331
  255.255.255.255  255.255.255.255         On-link    192.168.13.185    281
  255.255.255.255  255.255.255.255         On-link        172.27.0.1    271
  255.255.255.255  255.255.255.255         On-link     192.168.240.1    271
===========================================================================
Persistent Routes:
  Network Address          Netmask  Gateway Address  Metric
    192.168.140.0    255.255.255.0   192.168.140.18  Default
     192.168.10.0    255.255.255.0   192.168.140.18  Default
===========================================================================
...

```

The trick here is to use a CIDR/28 network and subclass it to /30. So we
can use the first block of 4 addresses (in the example the 16/17/18/19)
and use the 17 + 18 for the Win to WSL2 connection (shown in blue in the
image below) and the next one from the next subnet as interface address
for the wireguard tunnel (in the example the 21 from the 20/21/22/23
block). This eases the setup of the routing on the jumphost.

Next we need to enable routing on the WSL2 by editing `/etc/sysctl.conf`:

```bash
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
```

Now the setup of wireguard in `/etc/wireguard`:

```shell
wslpc# wg genkey | tee priv.key | wg pubkey >pub.key

wslpc# cat wg0.conf
[Interface]
Address = 192.168.140.21/30
ListenPort = 48040
PrivateKey = <string from priv.key above>

[Peer]
PublicKey = <string from pub.key from jumphost>
AllowedIPs = 192.168.140.1/32,192.168.10.0/24
Endpoint = 10.81.53.168:39333
```

Here we also allow return packets from the development network in
`AllowedIPs`. The wg-quick directive also sets up the routes to the devnet
accordingly.

Now the Interface can be brought up with:

```shell
wg-quick up wg0
```

I consolidated these steps into one `.ps1` Powershell Script, that I added
to my startup folder (`WIN+R` then `shell:startup`). I did not check the
`Run as administrator` advanced option, as it would not come up
automatically during startup. So the script itself asks for elevation:

```powershell
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]
  ::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
  $arguments = "& '" +$myinvocation.mycommand.definition + "'"
  Start-Process powershell -Verb runAs -ArgumentList $arguments
  Break
}

# start WSL and configure the interface
wsl -d Debian -u root /sbin/ip addr add 192.168.140.18/30 dev eth0
wsl -d Debian -u root /usr/bin/wg-quick up wg0
wsl -d Debian -u root /sbin/sysctl -p /etc/sysctl.conf

# add the ips also to windows and set up routing
New-NetIPAddress -InterfaceAlias "vEthernet (WSL)" -IPAddress 192.168.140.17
  -PrefixLength 28
New-NetRoute -DestinationPrefix "192.168.140.0/24" -InterfaceAlias "vEthernet (WSL)"
  -NextHop 192.168.140.18
New-NetRoute -DestinationPrefix "192.168.10.0/24" -InterfaceAlias "vEthernet (WSL)"
  -NextHop 192.168.140.18
```

## Development Network Setup

### jumphost

On the vpn host first the incoming wireguard UDP packets have to be
allowed in `/etc/ufw/before.rules` in the `INPUT` section, as this needs
to get to the locally listening wireguard process:

```
# allow wireguard
-A ufw-before-input -p udp --dport 39333 -j ACCEPT
```

Then individually the allowed connections to the servers themselves need
to be allowed, coming from the `wg0` interface to the devnet servers. Also
the usual source NATting has to be enabled for the server, which is in
most cases already configured:

```
# destination server annotation
-A POSTROUTING -p tcp -d 192.168.10.175  -j SNAT --to-source 192.168.10.212
-A ufw-before-forward -i wg0   -p tcp -d 192.168.10.175 --dport 5000 -j ACCEPT
```

Now that the firewall is configured, the wireguard configuration is
created:

wg0.conf:
```toml
[Interface]
Address = 192.168.140.1/24
ListenPort = 39333
PrivateKey = <... from /etc/wireguard/priv.key ...>

[Peer]
PublicKey = <... from users system ...>
AllowedIPs = 192.168.140.16/28
```

Now here we need to duplicate the `[Peer]` entry for each additional user.
We need to ensure non-overlapping networks, for Tobias this would then be:
`192.168.140.32/28`, then `192.168.150.48/28` and so on.

On this machine the service can be properly enabled via systemd:

```shellsession
root@erlh1cla# systemctl enable wg-quick@wg0
root@erlh1cla# systemctl start wg-quick@wg0
```

### Target Development machines

In order to make the routing work on the default target Linux systems, we
need to make two changes:

In `/etc/network/interfaces` the primary interface needs to be marked as
auto:

```
auto ens192
```

And in `/etc/network/if-up.d/` a file called `wireguard` needs to be
created with this content:

```bash
#!/bin/bash

if [[ "${IFACE:0:3}" == "ens" ]]; then
  ip route add 192.168.140.16/28 via 192.168.10.212
fi
```

and make it executable: `chmod 755 /etc/network/if-up.d/wireguard`.

Then the network can be restarted: `systemctl restart networking`

That's it. Have fun!
