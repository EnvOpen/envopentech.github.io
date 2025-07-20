# ENV OPEN SECURITY STANDARD v 1.0
Draft: 19/07/2025
Authors: Argo Nickerson [argo@envopen.org](mailto:argo@envopen.org)

## About/General Information
The Env Open Security Standard is a comprehensive specification designed to ensure secure, interoperable smart home systems using the Smart Home Device Communications Protocol (SHDC). This standard defines requirements for device integration, security protocols, and operational behaviours to create a unified, secure smart home ecosystem with a central hub architecture.

## Specification of Operation and Interface
To comply with the standard, products must adhere to the following specifications:

### Standard Operations
Regardless of the device type, a device that is officially compliant with Smart Home Device Communications Protocol (SHDC) specifications must comply fully with ALL of the below specifications.

---

## 1. Device Classification and Requirements

### 1.1 Device Categories

All SHDC-compliant devices fall into one of the following categories:

#### Primary Hub
- **Function**: Central control and coordination node
- **Requirements**: 
  - Continuous power supply
  - Network connectivity (Ethernet/WiFi)
  - Hardware security module (HSM) or TPM recommended
  - NTP time synchronization capability

#### Sensors
- **Function**: Environmental monitoring and event detection
- **Types**: Motion, door/window, temperature, humidity, smoke, glass break, vibration
- **Requirements**:
  - Battery or low-power operation
  - SHDC protocol compliance
  - Ed25519 cryptographic capability
  - Unique device identifier
  - Tamper detection

#### Actuators  
- **Function**: Physical control devices
- **Types**: Smart locks, lights, HVAC controllers, sirens, cameras
- **Requirements**:
  - SHDC protocol compliance
  - Secure command execution
  - Status reporting capability
  - Fail-safe mechanisms
  - Compliant with applicable safety standards

#### User Interface Devices
- **Function**: User interaction and control
- **Types**: Keypads, mobile apps, wall panels, voice assistants, web panels, etc
- **Requirements**:
  - Authentication mechanisms
  - Encrypted communication with hub
  - User access control support
  - Any web communications over HTTPS with optional secondary encryption of data

#### Custom/User Devices
- **Function**: User-developed or third-party devices implementing SHDC protocol
- **Types**: DIY sensors, custom actuators, experimental devices, hobby projects
- **Requirements**:
  - Full SHDC v1.0 protocol implementation
  - Self-generated Ed25519 keypair with proper entropy
  - Compliance with core security requirements
  - Manual authorization capability
  - Basic device identification information

---

## 2. Network Architecture Requirements

### 2.1 Network Topology
- **Primary**: Star topology with hub as central node
- **Backup**: Limited mesh capabilities for critical devices
- **Isolation**: Smart home network isolated from general internet traffic

### 2.2 Communication Protocols
- **Primary Protocol**: SHDC v1.0 (UDP-based, AES-256-GCM encrypted)
- **Transport Layer**: UDP preferred, TCP fallback for reliability-critical operations
- **Broadcast Support**: Multicast IP (239.255.0.1) for hub-to-device commands
- **Maximum Packet Size**: 512 bytes for embedded device compatibility

### 2.3 Addressing and Discovery
- **Hub Discovery**: Automatic broadcast-based discovery protocol
- **Device Registration**: Secure join handshake with cryptographic verification
- **Address Assignment**: Hub assigns unique 32-bit device identifiers
- **IP Support**: IPv4 required, IPv6 optional but recommended.

---

## 3. Security Requirements

### 3.1 Cryptographic Standards
- **Asymmetric Encryption**: Ed25519 for device identity and signing
- **Symmetric Encryption**: AES-256-GCM for session encryption
- **Key Management**: Automatic key rotation and secure provisioning
- **Random Number Generation**: Hardware-based entropy sources preferred

### 3.2 Authentication and Authorization
- **Device Authentication**: Ed25519 public key cryptography
- **User Authentication**: Multi-factor authentication required for admin access
- **Session Management**: Time-limited sessions with automatic expiration
- **Access Control**: Role-based permissions (Admin, User, Guest, Device)

### 3.3 Security Protocols
- **Message Integrity**: All messages cryptographically signed
- **Replay Protection**: Timestamp and nonce-based anti-replay mechanisms
- **Key Rotation**: 
  - Session keys: Every 24 hours
  - Broadcast keys: Every 15 minutes
  - Device keys: Annually, on compromise detection, and optionally on user action (preffered)
- **Secure Boot**: Devices must verify firmware integrity on startup

### 3.4 Unauthorized Device Protection
- **Device Authorization Framework**: Multi-layer protection against rogue devices
- **Certificate-Based Validation**: Manufacturer certificate verification during join process
- **Administrative Approval**: Manual approval required for new device registration
- **Device Whitelisting**: Maintain approved device registry with revocation capability
- **Network Isolation**: Quarantine unknown devices during verification process

---

## 3.5. Unauthorized Device Protection Framework

### 3.5.1 Certificate-Based Device Authentication

**Manufacturer Certificate Requirements (Certified Devices):**
- Each commercial device must include a certificate signed by an EOSS-approved Certificate Authority (CA)
- Certificate must contain:
  - Device model and serial number
  - Manufacturer identity
  - EOSS compliance certification number
  - Device public key
  - Certificate validity period (maximum 5 years)

**Custom Device Authentication (User Devices):**
- Custom devices may use self-signed certificates or no certificates
- Must provide device identification information including:
  - Device type/purpose description
  - User-defined device name
  - Hardware/software version information
  - Device public key
  - Optional: Developer/builder identity

**Certificate Validation Process:**
1. Hub maintains trusted CA certificate store for certified devices
2. Device presents certificate chain (if available) during join request
3. For certified devices: Hub validates certificate authenticity and revocation status
4. For custom devices: Hub accepts self-identification and flags for manual review
5. Hub checks manufacturer against approved vendor list (certified devices only)
6. Invalid certificates result in quarantine for manual review

### 3.5.2 Device Authorization Workflow

**Phase 1: Discovery and Classification**
- Unknown devices detected via broadcast discovery
- Automatic placement in quarantine VLAN (limited network access)
- Device classification performed:
  - **Certified devices**: Certificate validation performed immediately
  - **Custom devices**: Protocol compliance validation performed
- Failed protocol compliance results in permanent blocking

**Phase 2: Administrative Review**
- Administrator notified of pending device via secure channel
- Device information presented: 
  - **Certified devices**: model, serial, manufacturer, certification status
  - **Custom devices**: user description, device type, protocol compliance status
- Administrator reviews device legitimacy and installation authorization
- **Manual authorization required for all custom devices**
- Physical verification recommended for high-security environments

**Phase 3: Approval and Integration**
- Approved devices proceed with secure join handshake
- Device added to permanent whitelist with unique identifier
- **Custom devices marked with "user-authorized" flag**
- Full network access granted within assigned device role
- Rejection results in permanent blacklisting

### 3.5.3 Device Whitelisting and Blacklisting

**Whitelist Management:**
- Central registry of approved devices with cryptographic identifiers
- Regular whitelist synchronization across hub instances
- Whitelist backup and restore capabilities
- Audit logging of all whitelist modifications

**Blacklist Enforcement:**
- Immediate blocking of known malicious or compromised devices
- Automatic blacklist updates from EOSS security feeds
- Manual blacklisting capability for local threats
- Blacklist entries include device signatures and behavioral patterns

### 3.5.4 Ongoing Security Monitoring

**Behavioral Analysis:**
- Continuous monitoring of device communication patterns
- Detection of anomalous behavior (unusual traffic, timing, destinations)
- Automated alerts for suspicious activity
- Capability to quarantine devices exhibiting malicious behavior

**Regular Re-authentication:**
- Periodic re-validation of device certificates (weekly)
- Certificate revocation list (CRL) checking
- Automatic device removal upon certificate expiration
- Grace period for certificate renewal (48 hours maximum)

### 3.5.5 Physical Security Integration

**Tamper Detection Requirements:**
- All devices must implement tamper detection mechanisms
- Tamper events trigger immediate security alert
- Compromised devices automatically quarantined
- Physical access logging for device installation areas

**Secure Installation Procedures:**
- Installation must occur during maintenance windows
- Physical presence verification during device addition
- Installation location validation against approved zones
- Post-installation security verification testing

### 3.5.6 Custom Device Integration Requirements

**Protocol Compliance Validation:**
- Custom devices must demonstrate full SHDC v1.0 protocol implementation
- Required message types: `HUB_DISCOVERY_REQ`, `JOIN_REQUEST`, `EVENT_REPORT`
- Proper cryptographic implementation verification
- Message format compliance testing during quarantine period

**Manual Authorization Process:**
- **Mandatory manual approval** for all custom devices regardless of protocol compliance
- Administrator interface must display:
  - Device self-identification information
  - Protocol compliance test results
  - Security assessment summary
  - Recommended trust level
- **User responsibility acknowledgment** required for custom device authorization

**Custom Device Restrictions:**
- Custom devices may have limited privileges by default
- Enhanced monitoring for behavioral anomalies
- Periodic re-authorization requirements (annually recommended)
- Clear identification in system logs and user interfaces

**Developer Support Features:**
- Diagnostic mode for protocol debugging
- Enhanced logging for custom device troubleshooting
- Test environment support for development
- Documentation and examples for SHDC implementation

---

## 4. Operational Requirements

### 4.1 Device Lifecycle Management

#### Initial Setup
1. **Factory Provisioning**: Pre-installed unique Ed25519 keypair with manufacturer certificate chain
2. **Network Discovery**: Automatic hub discovery via broadcast
3. **Certificate Validation**: Hub verifies manufacturer certificate against trusted CA list
4. **Quarantine Mode**: Device placed in isolated network segment pending approval
5. **Administrative Approval**: Human administrator must explicitly approve device addition
6. **Secure Join**: Cryptographic handshake for network admission (post-approval)
7. **Configuration**: Hub assigns device ID and security parameters
8. **Verification**: End-to-end communication test
9. **Whitelist Addition**: Device added to authorized device registry

#### Normal Operation
- **Heartbeat**: Regular status reports (configurable interval, default 5 minutes)
- **Event Reporting**: Immediate notification of triggered events
- **Command Execution**: Secure processing of hub commands
- **Self-Monitoring**: Device health and tamper detection

#### Maintenance and Updates
- **Firmware Updates**: Cryptographically signed and verified updates
- **Configuration Changes**: Secure parameter modification through hub
- **Troubleshooting**: Diagnostic modes with enhanced logging
- **Decommissioning**: Secure key deletion and network removal

### 4.2 System Integration Requirements

#### Interoperability
- **Standard APIs**: RESTful APIs for third-party integration
- **Data Formats**: JSON for configuration, binary for real-time communication
- **Event Logging**: Structured logging with timestamps and signatures
- **Backup and Restore**: Complete system state backup capability

#### Performance Standards
- **Response Time**: 
  - Critical alerts: < 500ms
  - Standard commands: < 2 seconds
  - Configuration changes: < 10 seconds
- **Reliability**: 99.9% uptime for hub, 99% for battery devices
- **Capacity**: Minimum 100 devices per hub, recommended 500+ support

---

## 5. Compliance and Certification

### 5.1 Mandatory Features
- [ ] SHDC v1.0 protocol implementation
- [ ] Ed25519 cryptographic support
- [ ] AES-256-GCM encryption
- [ ] Secure key management
- [ ] Tamper detection
- [ ] Automatic hub discovery
- [ ] Replay protection
- [ ] Firmware verification
- [ ] Manufacturer certificate validation (certified devices)
- [ ] Custom device manual authorization capability
- [ ] Device quarantine capability
- [ ] Administrative approval workflow
- [ ] Device whitelist/blacklist management
- [ ] Behavioral anomaly detection
- [ ] Certificate revocation checking
- [ ] Protocol compliance validation for custom devices

### 5.2 Testing Requirements
- **Security Testing**: Penetration testing and vulnerability assessment
- **Interoperability Testing**: Multi-vendor device compatibility
- **Performance Testing**: Load testing with maximum device count
- **Reliability Testing**: Extended operation under various conditions
- **Compliance Verification**: Third-party security audit

### 5.3 Certification Process
1. **Self-Assessment**: Manufacturer compliance checklist
2. **Laboratory Testing**: Authorized testing facility evaluation
3. **Security Audit**: Independent security review
4. **Interoperability Testing**: Multi-vendor compatibility verification
5. **Certification Award**: Official EOSS compliance certificate

---

## 6. Implementation Guidelines

### 6.1 Recommended Libraries
- **Cryptography**: libsodium, NaCl, or wolfSSL
- **Networking**: Standard UDP sockets with multicast support
- **JSON Processing**: Standard library parsers
- **Time Synchronization**: NTP client implementation

### 6.2 Development Best Practices
- **Secure Coding**: Follow OWASP guidelines for embedded systems
- **Error Handling**: Graceful degradation and recovery mechanisms
- **Logging**: Comprehensive audit trails with privacy protection
- **Testing**: Unit tests, integration tests, and security tests

### 6.3 Deployment Considerations
- **Network Segmentation**: Isolated VLAN for smart home devices
- **Firewall Configuration**: Minimal external access, internal traffic monitoring
- **Physical Security**: Tamper-evident enclosures for critical devices
- **Backup Strategy**: Regular automated backups with encryption

---

## 7. Appendices

### 7.1 Message Type Reference
See SHDC v1.0 specification for detailed message formats and protocols.

### 7.2 Security Threat Model
- **Physical Access**: Device tampering and key extraction
- **Network Attacks**: Man-in-the-middle, replay, and DoS attacks
- **Cryptographic Attacks**: Key compromise and algorithm weaknesses
- **Firmware Attacks**: Malicious updates and code injection
- **Unauthorized Devices**: Rogue devices attempting network infiltration
- **Certificate Attacks**: Forged or stolen manufacturer certificates
- **Social Engineering**: Unauthorized device installation through deception
- **Supply Chain Attacks**: Compromised devices introduced during manufacturing

### 7.3 Compliance Checklist
[Detailed checklist for manufacturers to verify compliance with all requirements]

### 7.4 Custom Device Development Guide

**Minimum Implementation Requirements:**
- Full SHDC v1.0 protocol support
- Ed25519 key generation with proper entropy
- AES-256-GCM symmetric encryption
- Proper message formatting and signing
- Network discovery and join handshake implementation

**Recommended Development Practices:**
- Use established cryptographic libraries (libsodium, NaCl, wolfSSL)
- Implement comprehensive error handling
- Include device identification and version information
- Support diagnostic and debugging modes
- Follow secure coding practices

**Testing and Validation:**
- Protocol compliance self-testing
- Cryptographic implementation verification
- Network isolation testing during development
- Security review of custom implementations
- Documentation of device capabilities and limitations

**User Responsibilities:**
- Understanding security implications of custom devices
- Regular security updates and maintenance
- Monitoring device behavior post-authorization
- Compliance with local regulations and safety standards

---

## Contact Information
For questions about this standard or certification process:
- Email: contact@envopen.org
- Website: https://envopen.org/standards

---

*This document is subject to revision. Current version available at: https://envopen.org/standards/eosl-v1.0*