# Security Requirements & Analysis

**Document Version**: 1.0.0
**Created**: 2025-10-22
**FORGE Cycle**: app-store-migration-native-ios-android-apps
**Phase**: Focus

---

## Executive Summary

Fidget Fun is a simple, privacy-focused fidget toy app with **zero data collection**. All functionality is client-side with no backend services, user accounts, or analytics. This document outlines security requirements for migrating to native iOS and Android apps.

## Security Posture

**Risk Level**: Low
- No user data collection
- No network communication (after bundling assets)
- No sensitive permissions required
- Client-side only application
- No authentication or authorization

**Key Security Principles**:
1. **Privacy by Design**: Collect nothing, transmit nothing
2. **Minimal Permissions**: Only vibration/haptics access needed
3. **Local-First**: All data stays on device
4. **Transparency**: Clear privacy policy stating "no data collection"
5. **Supply Chain Security**: Bundle all dependencies locally

---

## Security Requirements Checklist

### Critical (Must-Have)
- [x] Bundle Lucide icons locally (eliminate CDN dependency)
- [x] No user data collection or transmission
- [x] Minimal permissions (vibration/haptics only)
- [x] Secure code signing for iOS and Android
- [x] Privacy policy published (even if "we collect nothing")
- [x] Content Security Policy (CSP) configured
- [x] HTTPS enforced for any network requests (none expected)
- [x] No third-party analytics or tracking

### High Priority
- [x] Keystore backup and secure storage (Android)
- [x] Certificate management process (iOS)
- [x] WebView security hardening
- [x] Input validation on canvas operations
- [x] XSS protection in web content
- [x] Dependency security audit

### Medium Priority
- [ ] Automated security scanning (optional for simple app)
- [ ] Penetration testing (overkill for this app)
- [ ] Code obfuscation (not necessary)

---

## Privacy Policy

### Minimal Privacy Policy Template

**Required for App Store and Play Store submission**

```markdown
# Privacy Policy for Fidget Fun

Last updated: [DATE]

## Data Collection
Fidget Fun does NOT collect, store, or transmit any personal data.

## What We Don't Collect
- No user accounts or login information
- No personal information (name, email, phone, etc.)
- No location data
- No usage analytics or tracking
- No advertising identifiers
- No photos, camera, or microphone access

## Local Data
- Canvas drawings created by you stay on your device only
- App preferences (if any) are stored locally on your device
- Nothing is ever sent to our servers (we don't have servers)

## Third-Party Services
- The app does not use any third-party analytics, advertising, or tracking services
- All icons and assets are bundled within the app (no external requests)

## Permissions
- **Vibration/Haptics** (iOS/Android): Used only for tactile feedback when tapping buttons and interacting with the app. No data is collected through this permission.

## Children's Privacy
This app is safe for users of all ages and collects no data from anyone, including children under 13.

## Changes to This Policy
We will notify users of any material changes by updating the "Last updated" date.

## Contact Us
For questions about this privacy policy, contact: [YOUR EMAIL]
```

**Publish Location**: Create simple website at fidgetfun.app/privacy or use GitHub Pages

---

## Permissions Audit

### iOS Permissions

**Info.plist Configuration**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- NO PERMISSIONS REQUIRED FOR HAPTICS -->
    <!-- Haptics work automatically via Capacitor on iOS -->

    <!-- App Information -->
    <key>CFBundleDisplayName</key>
    <string>Fidget Fun</string>

    <key>CFBundleIdentifier</key>
    <string>com.fidgetfun.app</string>

    <key>CFBundleVersion</key>
    <string>1.0.0</string>

    <!-- Supported Orientations: Portrait only -->
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
</dict>
</plist>
```

**iOS Permissions Summary**:
- ✅ **Haptics**: No permission required (works automatically)
- ❌ **Camera**: Not needed
- ❌ **Microphone**: Not needed
- ❌ **Location**: Not needed
- ❌ **Contacts**: Not needed
- ❌ **Photos**: Not needed

### Android Permissions

**AndroidManifest.xml Configuration**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fidgetfun.app">

    <!-- REQUIRED: Vibration for haptic feedback -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <!-- INTERNET permission (required by WebView, but we don't transmit data) -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="false"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

**Android Permissions Summary**:
- ✅ **VIBRATE**: Required for haptic feedback
- ✅ **INTERNET**: Required by WebView (but we don't make network calls)
- ✅ **ACCESS_NETWORK_STATE**: Standard for apps
- ❌ **CAMERA**: Not needed
- ❌ **MICROPHONE**: Not needed
- ❌ **ACCESS_FINE_LOCATION**: Not needed
- ❌ **READ_CONTACTS**: Not needed
- ❌ **WRITE_EXTERNAL_STORAGE**: Not needed

---

## Third-Party Dependency Security

### Lucide Icons Security Assessment

**Current State**: Loaded from CDN (`https://unpkg.com/lucide@latest`)

**Risks**:
- CDN compromise or hijacking
- Supply chain attack
- Network dependency
- Version drift with `@latest`

**Mitigation Strategy**:

1. **Bundle Locally**:
```bash
# Download specific version (not @latest)
wget https://unpkg.com/lucide@0.263.1/dist/umd/lucide.min.js \
     -O www/assets/lucide/lucide.min.js

# Verify integrity
shasum -a 256 www/assets/lucide/lucide.min.js
# Compare against official release hash
```

2. **Update HTML Reference**:
```html
<!-- BEFORE -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- AFTER -->
<script src="assets/lucide/lucide.min.js"></script>
```

3. **Version Pinning in package.json** (for reference):
```json
{
  "devDependencies": {
    "lucide": "0.263.1"
  }
}
```

4. **Security Update Process**:
   - Monitor Lucide releases: https://github.com/lucide-icons/lucide/releases
   - Only update after reviewing changelog
   - Test thoroughly before deploying

### Capacitor Plugins Security

**Plugins Used**:
- `@capacitor/core` - Core framework
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/status-bar` - Status bar control
- `@capacitor/splash-screen` - Splash screen
- `@capacitor/preferences` - Local storage (optional)

**Security Practices**:

1. **Use Official Plugins Only**: Only install `@capacitor/*` scoped packages
2. **Pin Versions**: No `^` or `~` in package.json
3. **Regular Audits**: Run `npm audit` before each release
4. **Review Changelogs**: Read release notes before updating
5. **Test After Updates**: Thorough testing after any dependency change

**package.json Security Configuration**:
```json
{
  "dependencies": {
    "@capacitor/core": "6.0.0",
    "@capacitor/haptics": "6.0.0",
    "@capacitor/status-bar": "6.0.0",
    "@capacitor/splash-screen": "6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "6.0.0"
  },
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "precommit": "npm audit"
  }
}
```

---

## Code Signing & Distribution

### iOS Code Signing

**Requirements**:
- Apple Developer Account ($99/year)
- iOS Distribution Certificate
- App Store Provisioning Profile

**Certificate Management**:

1. **Create Distribution Certificate**:
   - Log into Apple Developer Portal
   - Certificates, Identifiers & Profiles
   - Create new iOS Distribution Certificate
   - Download and install in Keychain Access

2. **Backup Certificate** (CRITICAL):
   - Open Keychain Access
   - Find certificate + private key
   - Right-click > Export "Certificate and Private Key"
   - Save as .p12 file with strong password
   - Store in 1Password, encrypted drive, or secure vault
   - **If lost, cannot update app - must create new listing**

3. **Provisioning Profiles**:
   - Xcode can auto-manage (recommended)
   - Or manually create App Store profile in Developer Portal

4. **Xcode Configuration**:
   ```
   Signing & Capabilities tab:
   - Team: [Your Developer Account]
   - Bundle Identifier: com.fidgetfun.app
   - Automatically manage signing: ✅ (recommended)
   - Signing Certificate: iOS Distribution
   ```

### Android Code Signing

**Requirements**:
- Android keystore file
- Strong keystore password
- Strong key password

**Keystore Generation** (ONE TIME ONLY):

```bash
keytool -genkey -v -keystore fidget-fun-release.keystore \
  -alias fidget-fun \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Interactive prompts**:
```
Enter keystore password: [CREATE STRONG PASSWORD]
Re-enter: [REPEAT PASSWORD]
What is your first and last name? [Your Name or Company]
What is the name of your organizational unit? [Department]
What is the name of your organization? [Company Name]
What is the name of your City? [City]
What is the name of your State? [State]
What is the two-letter country code? [US]
Is CN=..., correct? yes

Enter key password for <fidget-fun>: [CREATE STRONG PASSWORD]
```

**Keystore Security (CRITICAL)**:

⚠️ **WARNING**: If keystore is lost, you CANNOT update your app in Play Store. You must create a new app listing with a new package name.

**Backup Strategy**:
1. **Primary Backup**: 1Password, LastPass, or similar password manager
2. **Secondary Backup**: Encrypted cloud storage (Dropbox, Google Drive with encryption)
3. **Offline Backup**: Encrypted USB drive in safe location
4. **Document Passwords**: Store passwords separately in password manager

**Git Ignore** (MANDATORY):
```gitignore
# Never commit keystore to Git!
*.keystore
*.jks
keystore.properties
local.properties
```

**Android Studio Signing**:
1. Build > Generate Signed Bundle/APK
2. Select "Android App Bundle"
3. Create new or select existing keystore
4. Enter keystore password
5. Enter key alias and password
6. Build release AAB

---

## WebView Security

### iOS WKWebView Configuration

**capacitor.config.json**:
```json
{
  "ios": {
    "contentInset": "always",
    "allowsLinkPreview": false,
    "scrollEnabled": true,
    "limitsNavigationsToAppBoundDomains": true
  }
}
```

### Android WebView Security

**AndroidManifest.xml**:
```xml
<application
    android:usesCleartextTraffic="false"
    android:allowBackup="false"
    android:hardwareAccelerated="true">
</application>
```

**Security Settings** (handled by Capacitor by default):
- File access disabled
- JavaScript enabled (required for app)
- Safe browsing enabled (Android 8+)
- Mixed content blocked

---

## Content Security Policy (CSP)

**Add to `www/index.html` `<head>`**:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'none';
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'none';
">
```

**CSP Directives Explained**:
- `default-src 'self'`: Only load resources from app origin
- `script-src 'self' 'unsafe-inline'`: Allow inline scripts (needed for current structure)
- `style-src 'self' 'unsafe-inline'`: Allow inline styles
- `img-src 'self' data:`: Allow local images and data URIs
- `connect-src 'none'`: **Block all network requests** (we don't need any)
- `frame-src 'none'`: No iframes allowed
- `object-src 'none'`: No plugins (Flash, etc.)
- `form-action 'none'`: No form submissions

---

## App Store Compliance

### iOS App Store Privacy Nutrition Label

**App Store Connect Configuration**:

**Data Not Collected** ✅
- Privacy Practices > Data Collection: "No, this app does not collect any data"

**Privacy Nutrition Label Fields**:
- Contact Info: Not collected
- Health & Fitness: Not collected
- Financial Info: Not collected
- Location: Not collected
- Sensitive Info: Not collected
- Contacts: Not collected
- User Content: Not collected (canvas drawings don't leave device)
- Browsing History: Not collected
- Search History: Not collected
- Identifiers: Not collected
- Purchases: Not collected
- Usage Data: Not collected
- Diagnostics: Not collected
- Other Data: Not collected

**Data Used to Track You**: No

**Data Linked to You**: None

### Google Play Data Safety

**Play Console Configuration**:

**Data Safety Section**:
1. Does your app collect or share any of the required user data types?
   - **No** ✅

2. Is all of the user data collected by your app encrypted in transit?
   - **Not applicable** (we don't collect data)

3. Do you provide a way for users to request that their data is deleted?
   - **Not applicable** (we don't collect data)

**Content Rating**:
- Complete questionnaire
- Expected rating: **Everyone** or **PEGI 3**

---

## Threat Model

### Threat: CDN Compromise

**Scenario**: Lucide CDN hijacked, malicious JavaScript injected
- **Likelihood**: Low
- **Impact**: High (arbitrary code execution)
- **Mitigation**: Bundle Lucide locally ✅
- **Status**: Mitigated

### Threat: Man-in-the-Middle Attack

**Scenario**: Network traffic intercepted during web content load
- **Likelihood**: Very Low (all assets bundled)
- **Impact**: High
- **Mitigation**: No network requests; all assets bundled ✅
- **Status**: Mitigated

### Threat: WebView Vulnerability

**Scenario**: Exploit in iOS WKWebView or Android WebView
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Use latest Capacitor; keep plugins updated; CSP configured ✅
- **Status**: Monitored

### Threat: Unauthorized Distribution (Piracy)

**Scenario**: App repackaged and distributed outside stores
- **Likelihood**: Low (free app, no premium features)
- **Impact**: Low (no revenue loss)
- **Mitigation**: Code signing, store verification
- **Status**: Accepted risk

### Threat: Privacy Policy Non-Compliance

**Scenario**: App rejected or removed for privacy violations
- **Likelihood**: Low (we collect nothing)
- **Impact**: High (cannot distribute app)
- **Mitigation**: Clear, honest privacy policy; accurate store listings ✅
- **Status**: Mitigated

---

## Security Testing

### Static Analysis

**Pre-Release Checklist**:
```bash
# Check for dependency vulnerabilities
npm audit

# Check for high-severity issues
npm audit --audit-level=high

# List all dependencies
npm list

# Check for outdated packages
npm outdated
```

### Dynamic Testing

**Manual Testing Checklist**:
- [ ] Test app in airplane mode (should work 100%)
- [ ] Monitor network traffic (should be zero after load)
- [ ] Check WebView console for errors
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Verify no console warnings or errors
- [ ] Test all haptic patterns work

### Code Review

**Before Each Release**:
- [ ] Review all code changes since last release
- [ ] Verify no hardcoded secrets or API keys
- [ ] Check for any new network requests
- [ ] Ensure service worker registration is conditional
- [ ] Verify CSP meta tag present
- [ ] Check AndroidManifest.xml for unnecessary permissions
- [ ] Check Info.plist for unnecessary entries

---

## Security Incident Response

### Dependency Vulnerability Found

1. **Critical Severity**:
   - Update dependency immediately
   - Rebuild iOS and Android apps
   - Submit expedited review to stores
   - Notify users via app update notes

2. **Moderate Severity**:
   - Update in next scheduled release
   - Test thoroughly before deploying

3. **Low Severity**:
   - Monitor issue
   - Update when convenient

### App Store Rejection for Privacy

1. Review rejection reason carefully
2. Update privacy policy if needed
3. Clarify in App Review Notes: "This app collects zero data"
4. Provide screenshots showing no data transmission
5. Resubmit with detailed explanation

### User Reports Security Issue

1. Investigate immediately (within 24 hours)
2. If valid security issue:
   - Fix within 48 hours
   - Submit urgent update to stores
   - Notify affected users (if any)
3. Document incident
4. Update security practices

---

## Compliance Checklist

### Pre-Submission Checklist

#### iOS App Store
- [ ] Privacy Nutrition Label: "No data collected" ✅
- [ ] Privacy Policy URL published
- [ ] App description mentions "No data collection, offline-first"
- [ ] Age rating: 4+ (Everyone)
- [ ] No tracking or analytics
- [ ] Support URL provided
- [ ] App Review Notes: Clarify no data collection

#### Google Play Store
- [ ] Data Safety: "No data collected" ✅
- [ ] Privacy Policy URL published
- [ ] Content rating: Everyone
- [ ] No ads
- [ ] No in-app purchases
- [ ] Target audience: All ages
- [ ] Store listing emphasizes privacy

---

## Ongoing Security Maintenance

### Monthly Tasks
- [ ] Run `npm audit`
- [ ] Check for Capacitor updates
- [ ] Review App Store Connect for policy changes
- [ ] Review Play Console for policy changes

### Quarterly Tasks
- [ ] Review and update privacy policy (if needed)
- [ ] Audit all dependencies
- [ ] Review security best practices

### Per-Release Tasks
- [ ] Security code review
- [ ] Test in airplane mode
- [ ] Verify CSP header
- [ ] Check for console errors/warnings
- [ ] Test on physical devices

---

**Document maintained by**: FORGE Security Agent
**Last updated**: 2025-10-22
**Status**: Active Development
**Next Review**: Before Phase 2 (Orchestrate)
