# Fastlane Deployment Guide

**Document Version**: 1.0.0
**Created**: 2025-10-22
**FORGE Cycle**: app-store-migration-native-ios-android-apps
**Phase**: Focus

---

## Overview

Fastlane automates the build, signing, and deployment process for both iOS and Android, significantly reducing manual work and human error when publishing to app stores.

## Benefits

- **Automated Screenshots**: Generate store screenshots across all device sizes
- **Consistent Builds**: Same process every time, no manual steps
- **Faster Releases**: One command deploys to TestFlight or Play Console
- **Metadata Management**: Version control for store listings
- **Code Signing**: Automated certificate and provisioning profile management
- **Beta Testing**: Easy TestFlight and Play Internal Testing distribution

---

## Installation

### Prerequisites

```bash
# Install Xcode Command Line Tools (macOS)
xcode-select --install

# Install Ruby (if not already installed)
brew install ruby

# Add Ruby to PATH
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Install Fastlane

```bash
# Install fastlane globally
sudo gem install fastlane -NV

# Or use Bundler (recommended for version consistency)
cd /path/to/silly-apps
echo "source 'https://rubygems.org'" > Gemfile
echo "gem 'fastlane'" >> Gemfile
bundle install
```

### Initialize Fastlane

```bash
# Initialize for iOS
cd ios/App
fastlane init

# Initialize for Android
cd ../../android
fastlane init
```

---

## Project Structure

```
silly-apps/
├── Gemfile                    # Ruby dependencies
├── Gemfile.lock
├── fastlane/                  # Shared fastlane config (optional)
│   └── README.md
│
├── ios/App/
│   └── fastlane/
│       ├── Fastfile          # iOS lanes (workflows)
│       ├── Appfile           # iOS app identifier
│       ├── Matchfile         # Code signing config
│       └── metadata/         # App Store metadata
│           └── en-US/
│               ├── name.txt
│               ├── subtitle.txt
│               ├── description.txt
│               ├── keywords.txt
│               └── privacy_url.txt
│
└── android/
    └── fastlane/
        ├── Fastfile          # Android lanes (workflows)
        ├── Appfile           # Android package name
        └── metadata/android/ # Play Store metadata
            └── en-US/
                ├── title.txt
                ├── short_description.txt
                ├── full_description.txt
                └── changelogs/
```

---

## iOS Fastlane Configuration

### ios/App/fastlane/Appfile

```ruby
app_identifier("com.fidgetfun.app")
apple_id("your-apple-id@example.com")
itc_team_id("YOUR_TEAM_ID") # App Store Connect team ID
team_id("YOUR_DEV_TEAM_ID") # Developer Portal team ID

# For more information about the Appfile, see:
# https://docs.fastlane.tools/advanced/#appfile
```

### ios/App/fastlane/Fastfile

```ruby
default_platform(:ios)

platform :ios do

  #
  # LANE: Build for Testing
  #
  desc "Build the iOS app for testing"
  lane :build do
    sync_code_signing(type: "development", readonly: true)
    build_app(
      scheme: "App",
      workspace: "App.xcworkspace",
      export_method: "development",
      output_directory: "./build",
      clean: true
    )
  end

  #
  # LANE: Run Tests
  #
  desc "Run tests"
  lane :test do
    run_tests(
      scheme: "App",
      workspace: "App.xcworkspace",
      devices: ["iPhone 14 Pro", "iPad Pro (12.9-inch)"]
    )
  end

  #
  # LANE: Beta Release to TestFlight
  #
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(
      xcodeproj: "App.xcodeproj"
    )

    # Sync code signing
    sync_code_signing(type: "appstore", readonly: true)

    # Build the app
    build_app(
      scheme: "App",
      workspace: "App.xcworkspace",
      export_method: "app-store",
      output_directory: "./build",
      clean: true
    )

    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      changelog: "Bug fixes and performance improvements"
    )

    # Notify team
    slack(
      message: "New iOS beta build uploaded to TestFlight! 🚀",
      channel: "#releases", # Optional
      success: true
    ) if ENV["SLACK_URL"]
  end

  #
  # LANE: Production Release to App Store
  #
  desc "Push a new production build to App Store"
  lane :release do
    # Ensure we're on a clean git state
    ensure_git_status_clean

    # Increment version number (optional)
    # increment_version_number(
    #   bump_type: "patch" # or "minor" or "major"
    # )

    # Increment build number
    increment_build_number(
      xcodeproj: "App.xcodeproj"
    )

    # Sync code signing
    sync_code_signing(type: "appstore", readonly: true)

    # Build the app
    build_app(
      scheme: "App",
      workspace: "App.xcworkspace",
      export_method: "app-store",
      output_directory: "./build",
      clean: true
    )

    # Upload to App Store
    upload_to_app_store(
      submit_for_review: false, # Set to true for automatic submission
      force: true,
      metadata_path: "./fastlane/metadata",
      screenshots_path: "./fastlane/screenshots",
      skip_metadata: false,
      skip_screenshots: false
    )

    # Commit version bump
    commit_version_bump(
      message: "Version bump to #{lane_context[SharedValues::VERSION_NUMBER]}",
      xcodeproj: "App.xcodeproj"
    )

    # Tag release
    add_git_tag(
      tag: "ios-v#{lane_context[SharedValues::VERSION_NUMBER]}"
    )

    # Push to remote
    push_to_git_remote

    # Notify team
    slack(
      message: "New iOS production build uploaded to App Store! 🎉",
      channel: "#releases",
      success: true
    ) if ENV["SLACK_URL"]
  end

  #
  # LANE: Generate Screenshots
  #
  desc "Generate screenshots for all device sizes"
  lane :screenshots do
    capture_screenshots(
      scheme: "App",
      output_directory: "./fastlane/screenshots"
    )
  end

  #
  # LANE: Update Metadata
  #
  desc "Upload metadata to App Store Connect"
  lane :update_metadata do
    upload_to_app_store(
      skip_binary_upload: true,
      skip_screenshots: false,
      metadata_path: "./fastlane/metadata"
    )
  end

  #
  # ERROR HANDLING
  #
  error do |lane, exception|
    slack(
      message: "iOS lane #{lane} failed: #{exception}",
      success: false
    ) if ENV["SLACK_URL"]
  end
end
```

### ios/App/fastlane/Matchfile (Optional - for team code signing)

```ruby
git_url("https://github.com/your-org/certificates")
storage_mode("git")
type("appstore")
app_identifier(["com.fidgetfun.app"])
```

---

## Android Fastlane Configuration

### android/fastlane/Appfile

```ruby
json_key_file("path/to/service-account-key.json") # Path to Google Cloud service account JSON
package_name("com.fidgetfun.app")
```

### android/fastlane/Fastfile

```ruby
default_platform(:android)

platform :android do

  #
  # LANE: Build APK for Testing
  #
  desc "Build a debug APK"
  lane :build_debug do
    gradle(task: "clean assembleDebug")
  end

  #
  # LANE: Build Release APK
  #
  desc "Build a release APK"
  lane :build_release do
    gradle(
      task: "clean assembleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )
  end

  #
  # LANE: Build AAB (App Bundle)
  #
  desc "Build a release App Bundle (AAB)"
  lane :build_bundle do
    gradle(
      task: "clean bundleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )
  end

  #
  # LANE: Run Tests
  #
  desc "Run all tests"
  lane :test do
    gradle(task: "test")
  end

  #
  # LANE: Deploy to Internal Testing
  #
  desc "Deploy to Google Play Internal Testing"
  lane :internal do
    # Increment version code
    increment_version_code(
      gradle_file_path: "app/build.gradle"
    )

    # Build AAB
    gradle(
      task: "clean bundleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )

    # Upload to Play Console
    upload_to_play_store(
      track: "internal",
      release_status: "draft", # or "completed" for immediate release
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )

    # Notify team
    slack(
      message: "New Android build uploaded to Internal Testing! 🚀",
      channel: "#releases",
      success: true
    ) if ENV["SLACK_URL"]
  end

  #
  # LANE: Deploy to Beta (Closed Testing)
  #
  desc "Deploy to Google Play Beta track"
  lane :beta do
    increment_version_code(
      gradle_file_path: "app/build.gradle"
    )

    gradle(
      task: "clean bundleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )

    upload_to_play_store(
      track: "beta",
      release_status: "completed",
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      skip_upload_metadata: false,
      skip_upload_images: false,
      skip_upload_screenshots: false
    )

    slack(
      message: "New Android beta build uploaded to Play Store! 🎉",
      channel: "#releases",
      success: true
    ) if ENV["SLACK_URL"]
  end

  #
  # LANE: Deploy to Production
  #
  desc "Deploy to Google Play Production"
  lane :production do
    # Ensure git is clean
    ensure_git_status_clean

    # Increment version code
    increment_version_code(
      gradle_file_path: "app/build.gradle"
    )

    # Build AAB
    gradle(
      task: "clean bundleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )

    # Upload to production
    upload_to_play_store(
      track: "production",
      release_status: "draft", # Review before publishing
      aab: lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      skip_upload_metadata: false,
      skip_upload_images: false,
      skip_upload_screenshots: false,
      metadata_path: "./fastlane/metadata/android"
    )

    # Commit version bump
    git_commit(
      path: ["app/build.gradle"],
      message: "Bump Android version code"
    )

    # Tag release
    add_git_tag(
      tag: "android-v#{lane_context[SharedValues::VERSION_NAME]}"
    )

    # Push to remote
    push_to_git_remote

    # Notify team
    slack(
      message: "New Android production build uploaded to Play Store! 🎉",
      channel: "#releases",
      success: true
    ) if ENV["SLACK_URL"]
  end

  #
  # LANE: Generate Screenshots
  #
  desc "Generate screenshots for Play Store"
  lane :screenshots do
    # Using screengrab (fastlane's screenshot tool for Android)
    screengrab(
      output_directory: "./fastlane/metadata/android/en-US/images"
    )
  end

  #
  # LANE: Update Metadata Only
  #
  desc "Update Play Store metadata without uploading binary"
  lane :update_metadata do
    upload_to_play_store(
      skip_upload_aab: true,
      skip_upload_apk: true,
      skip_upload_metadata: false,
      skip_upload_images: false,
      skip_upload_screenshots: false,
      metadata_path: "./fastlane/metadata/android"
    )
  end

  #
  # ERROR HANDLING
  #
  error do |lane, exception|
    slack(
      message: "Android lane #{lane} failed: #{exception}",
      success: false
    ) if ENV["SLACK_URL"]
  end
end
```

---

## Environment Variables Setup

### .env File (DO NOT COMMIT TO GIT)

Create `ios/App/fastlane/.env`:

```bash
# iOS Environment Variables
FASTLANE_USER="your-apple-id@example.com"
FASTLANE_PASSWORD="your-app-specific-password"
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="your-app-specific-password"

# Optional: Slack notifications
SLACK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
```

Create `android/fastlane/.env`:

```bash
# Android Environment Variables
KEYSTORE_PATH="/path/to/fidget-fun-release.keystore"
KEYSTORE_PASSWORD="your-keystore-password"
KEY_ALIAS="fidget-fun"
KEY_PASSWORD="your-key-password"

# Google Play Service Account JSON
SUPPLY_JSON_KEY_PATH="/path/to/service-account-key.json"

# Optional: Slack notifications
SLACK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
```

### .gitignore

```gitignore
# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output
fastlane/.env
*.cer
*.certSigningRequest
*.mobileprovision
*.p12
*.keystore
*.jks
service-account-key.json

# Ruby
Gemfile.lock
vendor/
```

---

## Store Metadata Management

### iOS Metadata Structure

```
ios/App/fastlane/metadata/en-US/
├── name.txt                    # App name (30 chars max)
├── subtitle.txt                # Subtitle (30 chars max)
├── description.txt             # Full description (4000 chars max)
├── keywords.txt                # Keywords, comma-separated (100 chars max)
├── marketing_url.txt           # Marketing website URL
├── privacy_url.txt             # Privacy policy URL (REQUIRED)
├── support_url.txt             # Support URL (REQUIRED)
├── promotional_text.txt        # Promotional text (170 chars max)
└── release_notes.txt           # What's new in this version
```

**Example `name.txt`**:
```
Fidget Fun
```

**Example `subtitle.txt`**:
```
Interactive Fidget Toys
```

**Example `description.txt`**:
```
Fidget Fun is a collection of interactive fidget toys designed to help you relax, focus, and have fun!

Features:
• Interactive Buttons - Tap colorful buttons with satisfying animations and sounds
• Physics Spinner - Swipe to spin with realistic momentum and friction
• Color Sliders - Mix RGB colors and create beautiful gradients
• Pop It - Pop bubbles with satisfying tactile feedback
• Drawing Pad - Draw and doodle with vibrant colors

Privacy First:
• No data collection
• No ads
• No tracking
• Works completely offline
• Your drawings never leave your device

Perfect for:
• Stress relief
• Focus and concentration
• Fidgeting
• Mindless fun
• Quick breaks

Download now and start fidgeting!
```

**Example `keywords.txt`**:
```
fidget,stress relief,relaxation,spinner,pop it,drawing,offline,privacy,toys,games,casual
```

### Android Metadata Structure

```
android/fastlane/metadata/android/en-US/
├── title.txt                   # App name (50 chars max)
├── short_description.txt       # Short description (80 chars max)
├── full_description.txt        # Full description (4000 chars max)
├── video.txt                   # YouTube video URL (optional)
└── changelogs/
    ├── 1.txt                   # Version 1 changelog
    ├── 2.txt                   # Version 2 changelog
    └── default.txt             # Default changelog
```

**Example `title.txt`**:
```
Fidget Fun - Interactive Fidget Toys
```

**Example `short_description.txt`**:
```
Relax with interactive fidget toys! Offline, no ads, no data collection.
```

**Example `full_description.txt`**:
```
Fidget Fun is your pocket-sized collection of satisfying fidget toys!

🎨 FEATURES:
• Tap & Toggle Buttons - Colorful interactive buttons with animations
• Physics Spinner - Realistic spinning with momentum
• Color Sliders - Mix RGB colors in real-time
• Pop It - Satisfying bubble popping
• Drawing Pad - Draw with vibrant colors

🔒 PRIVACY FIRST:
✓ No data collection
✓ No ads
✓ No tracking
✓ Works offline
✓ Your privacy is guaranteed

Perfect for stress relief, focus, or just having fun!
Download now and start fidgeting!
```

---

## Common Fastlane Commands

### iOS Commands

```bash
cd ios/App

# Build for testing
fastlane build

# Run tests
fastlane test

# Deploy to TestFlight
fastlane beta

# Deploy to App Store (draft)
fastlane release

# Generate screenshots
fastlane screenshots

# Update metadata only
fastlane update_metadata
```

### Android Commands

```bash
cd android

# Build debug APK
fastlane build_debug

# Build release APK
fastlane build_release

# Build release AAB
fastlane build_bundle

# Run tests
fastlane test

# Deploy to Internal Testing
fastlane internal

# Deploy to Beta track
fastlane beta

# Deploy to Production (draft)
fastlane production

# Generate screenshots
fastlane screenshots

# Update metadata only
fastlane update_metadata
```

---

## Google Play Service Account Setup

### Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (or select existing)
3. Enable Google Play Developer API
4. Create Service Account:
   - IAM & Admin > Service Accounts
   - Create Service Account
   - Name: `fastlane-deployer`
   - Grant role: **Service Account User**
5. Create JSON key:
   - Click on service account
   - Keys > Add Key > JSON
   - Download `service-account-key.json`
   - Store securely (DO NOT COMMIT TO GIT)

### Grant Play Console Access

1. Go to [Play Console](https://play.google.com/console)
2. Users and permissions
3. Invite new users
4. Add service account email (`fastlane-deployer@...gserviceaccount.com`)
5. Grant permissions:
   - Releases: Create and edit releases
   - App content: Edit app content
   - Financial data: View (optional)

---

## Automation with CI/CD

### GitHub Actions Example

Create `.github/workflows/ios-release.yml`:

```yaml
name: iOS Release

on:
  push:
    tags:
      - 'ios-v*'

jobs:
  release:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          cd ios/App
          bundle install

      - name: Sync Capacitor
        run: npx cap sync ios

      - name: Deploy to TestFlight
        env:
          FASTLANE_USER: ${{ secrets.FASTLANE_USER }}
          FASTLANE_PASSWORD: ${{ secrets.FASTLANE_PASSWORD }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
        run: |
          cd ios/App
          fastlane beta
```

Create `.github/workflows/android-release.yml`:

```yaml
name: Android Release

on:
  push:
    tags:
      - 'android-v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Install dependencies
        run: bundle install

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Deploy to Play Console
        env:
          KEYSTORE_PATH: ${{ secrets.KEYSTORE_PATH }}
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
          SUPPLY_JSON_KEY_DATA: ${{ secrets.GOOGLE_PLAY_JSON_KEY }}
        run: |
          cd android
          fastlane internal
```

---

## Best Practices

### 1. Version Management
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Auto-increment build/version codes with fastlane
- Tag releases in git

### 2. Security
- Never commit `.env`, keystores, or certificates
- Use CI/CD secrets for sensitive data
- Rotate service account keys annually

### 3. Testing
- Always test beta builds before production
- Use TestFlight and Internal Testing for QA
- Monitor crash reports

### 4. Metadata
- Keep metadata in version control
- Update screenshots with each major release
- A/B test store descriptions

### 5. Automation
- Automate repetitive tasks (screenshots, metadata updates)
- Use CI/CD for consistent builds
- Set up Slack/Discord notifications

---

## Troubleshooting

### iOS Code Signing Issues

```bash
# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset fastlane match
fastlane match nuke distribution
fastlane match appstore

# Manual signing in Xcode
Open Xcode > Signing & Capabilities > Manually manage signing
```

### Android Build Failures

```bash
# Clean Gradle cache
cd android
./gradlew clean

# Invalidate caches
rm -rf ~/.gradle/caches

# Check keystore
keytool -list -v -keystore /path/to/keystore
```

### Fastlane Stuck

```bash
# Clear fastlane cache
rm -rf ~/.fastlane

# Update fastlane
bundle update fastlane

# Verbose output
fastlane beta --verbose
```

---

## Cost Considerations

**Fastlane**: Free and open-source ✅

**Additional Costs**:
- Apple Developer Program: $99/year (required)
- Google Play Console: $25 one-time (required)
- CI/CD (GitHub Actions): Free for public repos, $4-40/month for private
- Optional: Fastlane Match storage (GitHub private repo or S3)

---

**Document maintained by**: FORGE Architect Agent
**Last updated**: 2025-10-22
**Status**: Active Development
**Next Steps**: Implement fastlane during Phase 5 (Build & Submission)
