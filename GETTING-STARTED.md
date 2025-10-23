# Fidget Fun - Native App Setup Guide

Your Fidget Fun PWA is now configured for native iOS and Android deployment! Follow these steps to build and publish to app stores.

---

## ✅ Setup Complete

The following has been configured:
- ✅ `package.json` created with Capacitor dependencies
- ✅ `www/` directory created with web app files
- ✅ Paths updated (removed `/silly-apps/` prefix)
- ✅ Service Worker made conditional (skips in native apps)
- ✅ `capacitor.config.json` configured
- ✅ `.gitignore` updated for mobile development

---

## 📋 Prerequisites

Before proceeding, ensure you have:

### For iOS Development
- **macOS** (required for iOS development)
- **Xcode 15+** - Download from Mac App Store
- **Command Line Tools**: `xcode-select --install`
- **CocoaPods**: `sudo gem install cocoapods`
- **Apple Developer Account** ($99/year) - https://developer.apple.com

### For Android Development
- **Java JDK 17** - Download from https://adoptium.net/
- **Android Studio** - Download from https://developer.android.com/studio
- **Android SDK** (installed via Android Studio)
- **Google Play Developer Account** ($25 one-time) - https://play.google.com/console

### For Both
- **Node.js 18+** and **npm** - Download from https://nodejs.org/
- **Git** (already installed if you're reading this)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Install all Capacitor dependencies
npm install

# This installs:
# - @capacitor/core, @capacitor/cli
# - @capacitor/ios, @capacitor/android
# - @capacitor/haptics, @capacitor/status-bar, @capacitor/splash-screen
```

### Step 2: Add iOS Platform

```bash
# Generate iOS project (Xcode workspace)
npx cap add ios

# Open in Xcode
npx cap open ios
```

**In Xcode**:
1. Select a simulator (e.g., "iPhone 15 Pro")
2. Press ⌘R to build and run
3. App should launch in simulator!

### Step 3: Add Android Platform

```bash
# Generate Android project
npx cap add android

# Open in Android Studio
npx cap open android
```

**In Android Studio**:
1. Wait for Gradle sync to complete
2. Select an emulator (e.g., "Pixel 6")
3. Press Run (▶) button
4. App should launch in emulator!

---

## 🔄 Development Workflow

### Make Changes to Web App

Edit files in `www/` directory:
- `www/index.html`
- `www/app.js`
- `www/styles.css`

### Sync Changes to Native Projects

```bash
# Sync to both platforms
npm run sync

# Or sync individually
npm run sync:ios
npm run sync:android
```

### Run on Devices

```bash
# iOS
npm run open:ios
# Then press ⌘R in Xcode

# Android
npm run open:android
# Then press Run in Android Studio
```

### Live Reload (Optional)

For faster development with live reload:

```bash
# iOS with live reload
npx cap run ios --livereload --external

# Android with live reload
npx cap run android --livereload --external
```

---

## 📱 Testing on Physical Devices

### iOS - Connect iPhone/iPad

1. Connect device via USB
2. In Xcode: Select your device from the dropdown
3. If prompted: Trust computer on device
4. Press ⌘R to build and run

**First time**:
- Xcode will create a provisioning profile
- On device: Settings > General > VPN & Device Management
- Trust the developer certificate

### Android - Connect Phone/Tablet

1. Enable Developer Options on device:
   - Settings > About Phone > Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging
3. Connect device via USB
4. Allow USB debugging prompt on device
5. In Android Studio: Select your device
6. Press Run

---

## 🎨 App Icons & Splash Screens

### iOS Icons

Generate icons using `generate-icons.html` or any icon generator:

**Required sizes**:
- 1024×1024 (App Store)
- 180×180 (@3x iPhone)
- 167×167 (@2x iPad Pro)
- 152×152 (@2x iPad)
- 120×120 (@2x iPhone)
- 76×76 (@1x iPad)

**Add to Xcode**:
1. `npx cap open ios`
2. Navigate to `App/App/Assets.xcassets/AppIcon.appiconset`
3. Drag and drop icons into appropriate slots

### Android Icons

**Generate adaptive icons**:
- Foreground: 108×108dp (432×432px @4x)
- Background: 108×108dp (432×432px @4x)

**Add to Android Studio**:
1. `npx cap open android`
2. Right-click `app/res` > New > Image Asset
3. Follow wizard to generate all sizes

### Splash Screens

Capacitor generates splash screens automatically from your icons. To customize:

**iOS**:
- Edit `ios/App/App/Assets.xcassets/Splash.imageset/`

**Android**:
- Edit `android/app/src/main/res/drawable/splash.png`

---

## 🔐 Code Signing

### iOS Code Signing

Xcode can auto-manage signing:

1. Open Xcode project: `npx cap open ios`
2. Select project in navigator
3. Select "App" target
4. Go to "Signing & Capabilities" tab
5. Check "Automatically manage signing"
6. Select your Team (Apple Developer Account)
7. Xcode handles the rest!

**Manual signing** (advanced):
- See `docs/architecture/security-requirements.md`

### Android Signing

Generate keystore (ONE TIME ONLY):

```bash
keytool -genkey -v -keystore fidget-fun-release.keystore \
  -alias fidget-fun \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**IMPORTANT**: Backup this keystore file! If lost, you cannot update your app.

Store keystore in secure location (NOT in git).

---

## 🚢 Building for Release

### iOS Release Build

```bash
# Sync latest changes
npm run sync:ios

# Open Xcode
npx cap open ios
```

**In Xcode**:
1. Select "Any iOS Device" as target
2. Product > Archive
3. Wait for archive to complete
4. Organizer window opens
5. Click "Distribute App"
6. Choose "App Store Connect"
7. Follow wizard to upload

**First time**:
- Create app listing in App Store Connect
- Fill out metadata, screenshots, description
- Submit for review

### Android Release Build

```bash
# Sync latest changes
npm run sync:android

# Open Android Studio
npx cap open android
```

**In Android Studio**:
1. Build > Generate Signed Bundle / APK
2. Select "Android App Bundle"
3. Select/create keystore
4. Enter passwords
5. Select "release" build variant
6. Wait for AAB generation

**Upload to Play Console**:
1. Go to https://play.google.com/console
2. Create app listing (first time)
3. Go to Release > Production
4. Create new release
5. Upload AAB file
6. Fill out release notes
7. Submit for review

---

## 📊 FORGE Project Management

Your migration is tracked in FORGE:

```bash
# Check cycle status
forge_cycle_status app-store-migration-native-ios-android-apps

# Get next recommended actions
forge_guide_next app-store-migration-native-ios-android-apps

# Advance to next phase when ready
forge_phase_advance app-store-migration-native-ios-android-apps
```

---

## 🐛 Troubleshooting

### iOS: "No provisioning profiles found"

**Solution**:
- Enable "Automatically manage signing" in Xcode
- Ensure you're signed in with Apple ID in Xcode preferences

### Android: "SDK location not found"

**Solution**:
```bash
# Create local.properties
echo "sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk" > android/local.properties
```

### "Command not found: npx"

**Solution**:
- Install Node.js from https://nodejs.org/
- Verify: `node --version` and `npm --version`

### Changes not showing in app

**Solution**:
```bash
# Clean and sync
rm -rf ios/App/App www/
cp -r [original-files] www/
npx cap sync
```

### iOS: "Code signing error"

**Solution**:
- Xcode > Preferences > Accounts > Download Manual Profiles
- Or use Automatic signing

---

## 📚 Documentation

All documentation is in `docs/`:

- **Architecture**: `docs/architecture/system-architecture.md`
- **Security**: `docs/architecture/security-requirements.md`
- **Testing**: `docs/testing/app-store-migration-native-ios-android-apps-test-scenarios.md`
- **Fastlane**: `docs/architecture/fastlane-deployment.md` (automated publishing)

---

## 🎯 Deployment Checklist

### Before Submitting to Stores

- [ ] App tested on physical iOS device
- [ ] App tested on physical Android device
- [ ] All 5 screens work correctly
- [ ] Haptics work on both platforms
- [ ] No console errors
- [ ] App works offline
- [ ] Icons look good on home screen
- [ ] Splash screen displays correctly
- [ ] Privacy policy published
- [ ] App Store screenshots created
- [ ] App descriptions written

### iOS App Store

- [ ] Apple Developer Account active ($99/year)
- [ ] App listing created in App Store Connect
- [ ] Bundle ID configured: `com.fidgetfun.app`
- [ ] Privacy Nutrition Label: "No data collected"
- [ ] Screenshots for all device sizes
- [ ] 1024×1024 icon uploaded
- [ ] Age rating: 4+
- [ ] Category: Games or Entertainment
- [ ] Build uploaded via Xcode

### Google Play Store

- [ ] Google Play Developer Account active ($25)
- [ ] App listing created in Play Console
- [ ] Package name: `com.fidgetfun.app`
- [ ] Data Safety: "No data collected"
- [ ] Screenshots uploaded
- [ ] 512×512 icon uploaded
- [ ] Feature graphic (1024×500)
- [ ] Content rating completed
- [ ] AAB uploaded

---

## 🎉 Next Steps

1. **Install dependencies**: `npm install`
2. **Add iOS platform**: `npx cap add ios`
3. **Add Android platform**: `npx cap add android`
4. **Test in simulators/emulators**
5. **Test on physical devices**
6. **Generate app icons**
7. **Build release versions**
8. **Submit to app stores!**

---

## 💡 Tips

- **Start with one platform**: iOS or Android, then add the other
- **Test early and often**: Don't wait until release to test on devices
- **Use fastlane**: Automate builds and uploads (see fastlane docs)
- **Keep keystore safe**: Android keystore cannot be recovered if lost
- **Version incrementing**: Xcode and Android Studio handle this automatically

---

## 🆘 Need Help?

- **Capacitor docs**: https://capacitorjs.com/docs
- **iOS guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Android guidelines**: https://play.google.com/console/about/guides/
- **FORGE commands**: Use the MCP tools in Claude Desktop

---

**Ready to build your first native app?**

Run: `npm install`

Then: `npx cap add ios` (on macOS) or `npx cap add android`

Good luck! 🚀
