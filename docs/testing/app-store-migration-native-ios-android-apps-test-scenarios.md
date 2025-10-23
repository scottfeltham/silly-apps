---
title: App Store Migration - Native iOS & Android Apps
type: Test Scenarios
created: 2025-10-22T13:50:48.700Z
updated: 2025-10-22T13:50:48.700Z
version: 2.0.0
status: Active
author: FORGE MCP Server
cycleId: app-store-migration-native-ios-android-apps

---

# Test Plan: App Store Migration - Native iOS & Android Apps

## Test Strategy

This test plan covers the migration of Fidget Fun from PWA to native iOS and Android apps using Capacitor. Testing is organized into 5 phases aligned with the development cycle, covering functional parity, native integration, and platform-specific behaviors.

### Testing Pyramid
- **Unit Tests**: Core haptic utilities, navigation logic
- **Integration Tests**: Screen transitions, canvas operations, physics engine
- **E2E Tests**: Complete user flows across all 5 screens
- **Platform Tests**: iOS-specific and Android-specific behaviors
- **Performance Tests**: Load time, memory usage, battery impact

### Test Environments
- **iOS**: iPhone 14 Pro (iOS 17+), iPhone SE (iOS 14+), iPad Pro 12.9"
- **Android**: Pixel 6 (Android 13), Samsung Galaxy S21 (Android 12), OnePlus tablet
- **Simulators/Emulators**: For rapid iteration and automated testing

---

## Phase 1: Project Setup & Configuration Tests

### TC-001: Capacitor Installation
**Priority**: Critical
**Objective**: Verify Capacitor is correctly installed and configured

**Pre-conditions**:
- Node.js 16+ installed
- npm/yarn available

**Test Steps**:
1. Run `npm install @capacitor/core @capacitor/cli`
2. Run `npx cap init` with app details (name: Fidget Fun, id: com.fidgetfun.app)
3. Verify `capacitor.config.json` created
4. Run `npx cap add ios`
5. Run `npx cap add android`

**Expected Results**:
- All packages install without errors
- `capacitor.config.json` exists with correct app ID
- `ios/` directory created with Xcode project
- `android/` directory created with Android Studio project
- No dependency conflicts reported

**Actual Results**: _[To be filled during execution]_

---

### TC-002: iOS Project Opens in Xcode
**Priority**: Critical
**Objective**: Verify generated iOS project is valid

**Test Steps**:
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select any iOS simulator as target
3. Click Build (⌘B)
4. Click Run (⌘R)

**Expected Results**:
- Xcode opens without errors or warnings
- Project builds successfully (0 errors)
- App launches in simulator
- Web content loads inside WKWebView

**Actual Results**: _[To be filled during execution]_

---

### TC-003: Android Project Opens in Android Studio
**Priority**: Critical
**Objective**: Verify generated Android project is valid

**Test Steps**:
1. Open `android/` directory in Android Studio
2. Wait for Gradle sync to complete
3. Select any emulator as target
4. Click Run (▶)

**Expected Results**:
- Android Studio opens project without errors
- Gradle sync completes successfully
- App builds and generates APK
- App launches in emulator
- Web content loads inside WebView

**Actual Results**: _[To be filled during execution]_

---

## Phase 2: Web App Adaptation Tests

### TC-004: Path Configuration Update
**Priority**: Critical
**Objective**: Verify BASE_PATH changed from '/silly-apps/' to '/'

**Test Steps**:
1. Check `sw.js` line 2 for BASE_PATH value
2. Check `manifest.json` start_url and scope
3. Check service worker registration path in index.html
4. Run app locally via Capacitor

**Expected Results**:
- `sw.js` BASE_PATH = '/' (or removed)
- `manifest.json` start_url = '/'
- All assets load without 404 errors
- No hardcoded '/silly-apps/' references remain

**Actual Results**: _[To be filled during execution]_

---

### TC-005: Service Worker Conditional Loading
**Priority**: High
**Objective**: Service worker should only load in web context, not native

**Test Steps**:
1. Add detection for Capacitor environment in sw.js registration
2. Run app in native iOS simulator
3. Check dev tools/console for service worker messages
4. Run app in native Android emulator
5. Run app in web browser

**Expected Results**:
- iOS/Android: Service worker does NOT register (or registers but uses native storage)
- Web browser: Service worker registers normally
- No console errors in any environment

**Actual Results**: _[To be filled during execution]_

---

### TC-006: Asset Bundle Verification
**Priority**: High
**Objective**: All assets (icons, fonts, Lucide CDN) load correctly

**Test Steps**:
1. Launch app on iOS
2. Navigate to all 5 screens
3. Verify all Lucide icons render
4. Check network tab for failed requests
5. Repeat on Android

**Expected Results**:
- All 30+ Lucide icons render on Buttons screen
- Tab icons visible and styled correctly
- No 404 errors in network log
- Lucide CDN accessible (or bundled locally)

**Actual Results**: _[To be filled during execution]_

---

## Phase 3: Feature Parity Tests (All 5 Screens)

### TC-007: Buttons Screen - Core Functionality
**Priority**: Critical
**Objective**: All button interactions work identically to PWA

**Test Steps**:
1. Open Buttons screen
2. Verify 12 buttons render with random properties
3. Tap 5 different buttons
4. Verify counter increments from 0 → 5
5. Observe animations (bounce, spin, wiggle, etc.)
6. Tap "Reset" button
7. Verify counter returns to 0
8. Tap "Randomize" button
9. Verify buttons regenerate with new properties

**Expected Results**:
- 12 buttons display with varied shapes, sizes, colors, icons
- Each tap increments counter
- Animations play on button tap
- Particle effects emit from tap location
- Audio feedback plays (varies pitch per button)
- Reset clears counter but keeps buttons
- Randomize regenerates all buttons

**Actual Results**: _[To be filled during execution]_

---

### TC-008: Buttons Screen - Particle Effects
**Priority**: High
**Objective**: Particle animations render smoothly

**Test Steps**:
1. Tap a button in the center of screen
2. Observe 8 particles emit in circular pattern
3. Verify particles fade out smoothly
4. Tap 3 buttons in quick succession
5. Verify particles don't overlap incorrectly

**Expected Results**:
- 8 particles emit per tap
- Particles move in 360° circle pattern
- Opacity fades from 1 → 0
- Particles removed from DOM after animation
- No performance lag with multiple taps

**Actual Results**: _[To be filled during execution]_

---

### TC-009: Spinner Screen - Physics Simulation
**Priority**: Critical
**Objective**: Spinner rotates with realistic physics

**Test Steps**:
1. Navigate to Spinner screen
2. Drag spinner clockwise quickly
3. Release finger/mouse
4. Observe spinner continues rotating with friction
5. Verify speed decreases gradually to 0
6. Drag spinner counter-clockwise
7. Repeat friction test

**Expected Results**:
- Spinner rotates in drag direction
- Velocity calculated correctly
- Friction (0.98) slows rotation realistically
- Speed display updates in real-time
- Rotation continues after release (momentum)
- Spinner stops smoothly (not abruptly)

**Actual Results**: _[To be filled during execution]_

---

### TC-010: Spinner Screen - 5 Spinner Types
**Priority**: High
**Objective**: All spinner designs load and spin correctly

**Test Steps**:
1. Select "Classic" spinner → Verify 3 arms + center
2. Spin and verify friction = 0.98
3. Select "Galaxy" spinner → Verify orbits + planets + stars
4. Spin and verify friction = 0.99 (smoother)
5. Select "Ninja" spinner → Verify 4 blades
6. Spin and verify friction = 0.96 (faster stop)
7. Select "Flower" spinner → Verify 8 petals
8. Select "Spectrum" spinner → Verify rainbow rings

**Expected Results**:
- Each spinner type renders distinct visual design
- Friction values differ per spinner type
- Spinner info text updates ("The original!", "Smooth like space!", etc.)
- All spinners rotate smoothly
- Design elements stay intact during rotation

**Actual Results**: _[To be filled during execution]_

---

### TC-011: Sliders Screen - RGB Color Mixer
**Priority**: Critical
**Objective**: Sliders update color preview in real-time

**Test Steps**:
1. Navigate to Sliders screen
2. Move Red slider to 100 → Verify value shows "100"
3. Move Green slider to 0 → Verify value shows "0"
4. Move Blue slider to 50 → Verify value shows "50"
5. Verify color preview shows rgb(255, 0, 127)
6. Set all sliders to 0 → Verify black preview
7. Set all sliders to 100 → Verify white preview

**Expected Results**:
- Slider values display as 0-100
- Color preview updates immediately on slider move
- RGB calculation: value * 2.55 converts to 0-255
- Preview div shows correct background color
- No lag between slider move and color update

**Actual Results**: _[To be filled during execution]_

---

### TC-012: Pop It Screen - Bubble Grid
**Priority**: Critical
**Objective**: 48 bubbles toggle on tap with counter

**Test Steps**:
1. Navigate to Pop It screen
2. Verify 6×8 grid (48 bubbles) displayed
3. Tap 5 different bubbles
4. Verify each bubble toggles "popped" state
5. Verify counter shows "Popped: 5"
6. Tap same bubble again to un-pop
7. Verify counter decrements to 4
8. Tap "Reset All" button
9. Verify all bubbles un-pop and counter = 0

**Expected Results**:
- 48 bubbles render in grid layout
- Tapping bubble adds "popped" CSS class
- Counter increments for each pop
- Tapping popped bubble removes class
- Counter decrements for each un-pop
- Reset clears all popped states

**Actual Results**: _[To be filled during execution]_

---

### TC-013: Drawing Screen - Canvas Drawing
**Priority**: Critical
**Objective**: Drawing works with touch and mouse

**Test Steps**:
1. Navigate to Drawing screen
2. Verify canvas resizes to container (check dimensions)
3. Draw a circle with finger/mouse
4. Verify line appears in black (default color)
5. Select red color from palette
6. Draw a line
7. Verify line appears in red
8. Tap "Clear" button
9. Verify canvas clears completely

**Expected Results**:
- Canvas resizes when screen becomes active
- Touch/mouse input draws lines
- Initial touch/click draws a dot (lineWidth: 5)
- Dragging draws continuous line
- Color selection changes stroke color
- Line cap is "round" (smooth ends)
- Clear button removes all drawings

**Actual Results**: _[To be filled during execution]_

---

### TC-014: Drawing Screen - Touch Scroll Prevention
**Priority**: High
**Objective**: Drawing on canvas doesn't scroll page

**Test Steps**:
1. Navigate to Drawing screen on mobile device
2. Touch canvas and drag vertically (drawing motion)
3. Verify page does NOT scroll behind canvas
4. Draw multiple strokes
5. Verify no unwanted scrolling occurs

**Expected Results**:
- Touch events use `{ passive: false }`
- `e.preventDefault()` called in touch handlers
- Page remains stationary during drawing
- Only drawing occurs, no scrolling

**Actual Results**: _[To be filled during execution]_

---

### TC-015: Tab Navigation
**Priority**: Critical
**Objective**: Switching tabs shows correct screen

**Test Steps**:
1. Start on Buttons screen (default)
2. Tap Spinner tab → Verify spinner screen visible, buttons hidden
3. Tap Sliders tab → Verify sliders screen visible
4. Tap Pop It tab → Verify pop it screen visible
5. Tap Draw tab → Verify drawing screen visible
6. Tap Buttons tab → Verify buttons screen visible again

**Expected Results**:
- Only one screen has "active" class at a time
- Only one tab has "active" class at a time
- Tab CSS styling reflects active state
- Screen transitions are instantaneous
- Canvas resizes when drawing screen activated (line 92-95 in app.js)

**Actual Results**: _[To be filled during execution]_

---

## Phase 4: Native Integration Tests

### TC-016: Capacitor Haptics API Integration
**Priority**: Critical
**Objective**: Replace Vibration API with Capacitor Haptics

**Test Steps**:
1. Install @capacitor/haptics plugin
2. Update haptics utility in app.js (lines 1-73)
3. Replace `navigator.vibrate()` with Capacitor Haptics methods
4. Test on iOS device: Tap button → Feel haptic
5. Test on Android device: Tap button → Feel haptic
6. Test all haptic patterns: light, medium, heavy, success, error, pop, spin

**Expected Results**:
- iOS: Haptics work using Taptic Engine
- Android: Haptics work using vibration motor
- Different patterns produce distinct feedback
- `haptics.isSupported()` returns true on mobile devices
- No errors on web where haptics unavailable

**Platform-Specific**:
- iOS: Uses `Haptics.impact()` with style (light/medium/heavy)
- Android: Uses `Haptics.vibrate()` with duration patterns

**Actual Results**: _[To be filled during execution]_

---

### TC-017: iOS Safe Area Insets
**Priority**: High
**Objective**: UI not clipped by notch or Dynamic Island

**Test Steps**:
1. Run app on iPhone 14 Pro (has Dynamic Island)
2. Verify screen title not hidden by island
3. Verify tab bar not hidden by home indicator
4. Check `viewport-fit=cover` meta tag present
5. Verify CSS uses `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`

**Expected Results**:
- Title text visible below Dynamic Island
- Tab bar positioned above home indicator
- No UI elements clipped by device notch/island
- Proper padding applied using safe-area-inset

**Actual Results**: _[To be filled during execution]_

---

### TC-018: Android System Bars & Notches
**Priority**: High
**Objective**: UI adapts to Android system UI

**Test Steps**:
1. Run app on Android device with notch/hole-punch camera
2. Verify UI not hidden behind status bar
3. Verify navigation gestures don't conflict with tab bar
4. Test edge-to-edge display mode

**Expected Results**:
- Status bar color matches app theme (#667eea)
- Content not hidden behind notch
- Tab bar visible above Android navigation
- No clipping on any Android device

**Actual Results**: _[To be filled during execution]_

---

### TC-019: Capacitor Status Bar Plugin
**Priority**: Medium
**Objective**: Status bar color matches app theme

**Test Steps**:
1. Install @capacitor/status-bar plugin
2. Set status bar color to #667eea (theme color)
3. Set status bar content to light/dark based on theme
4. Test on iOS and Android
5. Verify status bar changes color when app launches

**Expected Results**:
- iOS: Status bar background matches theme
- Android: Status bar color applied
- Text color contrasts with background (readable)

**Actual Results**: _[To be filled during execution]_

---

### TC-020: Splash Screen Configuration
**Priority**: Medium
**Objective**: Branded splash screen shows on launch

**Test Steps**:
1. Install @capacitor/splash-screen plugin
2. Configure splash screen with Fidget Fun branding
3. Set background color to #667eea
4. Add app icon/logo to splash
5. Kill app and relaunch
6. Observe splash screen during load

**Expected Results**:
- Splash screen displays immediately on app launch
- Background color = #667eea (theme color)
- App logo/icon visible
- Splash dismisses when app ready
- Duration: 1-2 seconds

**Actual Results**: _[To be filled during execution]_

---

### TC-021: Offline Functionality (Native)
**Priority**: High
**Objective**: App works without internet connection

**Test Steps**:
1. Launch app with internet connected
2. Navigate to all 5 screens
3. Enable airplane mode
4. Kill and relaunch app
5. Navigate to all 5 screens
6. Test all interactions

**Expected Results**:
- App launches offline (assets bundled)
- All 5 screens function identically
- No network errors in console
- Lucide icons render (bundled or cached)
- No degraded functionality

**Actual Results**: _[To be filled during execution]_

---

### TC-022: App Lifecycle Events
**Priority**: Medium
**Objective**: App handles pause/resume correctly

**Test Steps**:
1. Launch app and start spinner spinning
2. Press home button (app backgrounds)
3. Reopen app
4. Verify spinner continues spinning (state preserved)
5. Navigate to Drawing screen, draw lines
6. Background app
7. Reopen app
8. Verify drawing preserved

**Expected Results**:
- App state persists when backgrounded
- Animations pause and resume correctly
- Canvas drawings preserved
- No crashes on resume

**Actual Results**: _[To be filled during execution]_

---

## Phase 5: Platform-Specific Tests

### TC-023: iOS App Icons (All Sizes)
**Priority**: Critical
**Objective**: App icons display correctly on iOS home screen

**Test Steps**:
1. Generate iOS icon set (1024×1024 source)
2. Add to Assets.xcassets/AppIcon.appiconset
3. Build and install on iOS device
4. Check home screen icon
5. Check Settings > Apps icon
6. Check Spotlight search icon

**Expected Results**:
- Icon displays on home screen (60×60 @3x = 180×180)
- No placeholder/default icon shown
- Icon matches brand identity
- All required sizes generated

**Actual Results**: _[To be filled during execution]_

---

### TC-024: Android Adaptive Icons
**Priority**: Critical
**Objective**: App icons display correctly on Android

**Test Steps**:
1. Generate adaptive icon set (foreground + background layers)
2. Add to res/mipmap folders
3. Build and install on Android device
4. Check home screen icon
5. Test on different launchers (Pixel, Samsung, OnePlus)

**Expected Results**:
- Icon displays correctly on all launchers
- Adaptive icon shapes apply correctly (circle, squircle, square)
- Foreground and background layers separate
- Icon looks good on all Android versions (8+)

**Actual Results**: _[To be filled during execution]_

---

### TC-025: iOS Xcode Archive Build
**Priority**: Critical
**Objective**: iOS build passes validation for App Store

**Test Steps**:
1. Open Xcode project
2. Select "Any iOS Device" as target
3. Product > Archive
4. Wait for archive to complete
5. Organizer > Distribute App > Validate
6. Check for errors/warnings

**Expected Results**:
- Archive completes without errors
- Validation passes with no critical issues
- App meets App Store guidelines
- Provisioning profiles configured correctly

**Actual Results**: _[To be filled during execution]_

---

### TC-026: Android Signed AAB Build
**Priority**: Critical
**Objective**: Android build generates signed bundle for Play Store

**Test Steps**:
1. Generate keystore for signing
2. Configure signing in build.gradle
3. Build > Generate Signed Bundle/APK
4. Select "Android App Bundle"
5. Verify AAB file created

**Expected Results**:
- AAB file generated in app/release/
- File size under 10MB target
- Bundle signed correctly
- Ready for Google Play upload

**Actual Results**: _[To be filled during execution]_

---

## Phase 6: Performance & Quality Tests

### TC-027: App Launch Performance
**Priority**: High
**Objective**: App launches under 2 seconds

**Test Steps**:
1. Kill app completely
2. Start timer
3. Tap app icon
4. Stop timer when first screen fully rendered
5. Repeat 5 times and average
6. Test on mid-range device (iPhone SE, Pixel 4a)

**Expected Results**:
- Average launch time < 2 seconds
- First screen (Buttons) renders immediately
- Icons load without delay
- No blank/white screens during load

**Actual Results**: _[To be filled during execution]_

---

### TC-028: Canvas Drawing Performance
**Priority**: High
**Objective**: Drawing feels smooth with no lag

**Test Steps**:
1. Navigate to Drawing screen
2. Draw rapid scribbles across entire canvas
3. Observe frame rate and responsiveness
4. Draw without lifting finger for 10 seconds
5. Check for stuttering or dropped frames

**Expected Results**:
- Lines follow finger/mouse smoothly
- No visible lag between input and rendering
- 60 FPS maintained during drawing
- No performance degradation over time

**Actual Results**: _[To be filled during execution]_

---

### TC-029: Spinner Physics Performance
**Priority**: High
**Objective**: Spinner rotation is smooth at high velocities

**Test Steps**:
1. Navigate to Spinner screen
2. Spin at maximum velocity (fast swipe)
3. Observe rotation animation
4. Verify no frame drops or stuttering
5. Test on lower-end device

**Expected Results**:
- Rotation appears smooth (60 FPS)
- No janky animation
- Speed display updates accurately
- Physics calculations don't block UI

**Actual Results**: _[To be filled during execution]_

---

### TC-030: Memory Usage
**Priority**: Medium
**Objective**: App uses reasonable amount of memory

**Test Steps**:
1. Launch app and navigate through all screens
2. Use Xcode/Android Studio profiler to monitor memory
3. Draw extensively on Drawing screen
4. Tap buttons 50+ times
5. Check memory usage over 5 minutes

**Expected Results**:
- iOS: Memory usage < 100MB
- Android: Memory usage < 150MB
- No memory leaks detected
- Memory stable (doesn't continuously increase)

**Actual Results**: _[To be filled during execution]_

---

### TC-031: Battery Impact
**Priority**: Medium
**Objective**: App doesn't drain battery excessively

**Test Steps**:
1. Charge device to 100%
2. Use app continuously for 30 minutes
3. Navigate through all screens
4. Keep spinner spinning periodically
5. Check battery percentage after 30 min

**Expected Results**:
- Battery drain < 15% in 30 minutes
- No excessive CPU usage when idle
- Animations don't cause overheating
- App classified as "low battery impact" in settings

**Actual Results**: _[To be filled during execution]_

---

## Phase 7: App Store Submission Tests

### TC-032: iOS TestFlight Submission
**Priority**: Critical
**Objective**: App successfully uploaded to TestFlight

**Test Steps**:
1. Archive app in Xcode
2. Upload to App Store Connect
3. Wait for processing
4. Add to TestFlight internal testing
5. Install via TestFlight on test device

**Expected Results**:
- Upload completes without errors
- App processes successfully in App Store Connect
- Appears in TestFlight within 15 minutes
- Internal testers can install and run app

**Actual Results**: _[To be filled during execution]_

---

### TC-033: Google Play Internal Testing
**Priority**: Critical
**Objective**: App successfully uploaded to Play Console

**Test Steps**:
1. Sign in to Google Play Console
2. Create new app listing
3. Upload signed AAB to internal testing track
4. Add internal testers
5. Publish to internal testing
6. Install via Play Store link on test device

**Expected Results**:
- AAB upload succeeds
- No API level or permission errors
- App available to internal testers within 30 minutes
- Installs and runs correctly from Play Store

**Actual Results**: _[To be filled during execution]_

---

### TC-034: iOS App Store Metadata
**Priority**: High
**Objective**: All required metadata and assets prepared

**Checklist**:
- [ ] App icon 1024×1024 PNG uploaded
- [ ] Screenshots for iPhone 6.7" (2796×1290)
- [ ] Screenshots for iPhone 6.5" (2688×1242)
- [ ] Screenshots for iPhone 5.5" (2208×1242)
- [ ] Screenshots for iPad Pro 12.9" (2048×2732)
- [ ] App description written (4000 char max)
- [ ] Keywords selected (100 char max)
- [ ] Privacy policy URL provided
- [ ] Support URL provided
- [ ] App category selected (Games > Board)
- [ ] Age rating completed (4+)

**Actual Results**: _[To be filled during execution]_

---

### TC-035: Google Play Store Metadata
**Priority**: High
**Objective**: All required metadata and assets prepared

**Checklist**:
- [ ] App icon 512×512 PNG uploaded
- [ ] Feature graphic 1024×500 PNG uploaded
- [ ] Screenshots (2-8) for phone uploaded
- [ ] Screenshots (2-8) for tablet uploaded
- [ ] Short description (80 chars) written
- [ ] Full description (4000 chars) written
- [ ] Privacy policy URL provided
- [ ] App category selected
- [ ] Content rating questionnaire completed
- [ ] Target audience selected

**Actual Results**: _[To be filled during execution]_

---

## Test Execution Schedule

### Sprint 1 (Week 1-2): Setup & Configuration
- TC-001 through TC-006
- **Deliverable**: Working Capacitor projects on iOS and Android

### Sprint 2 (Week 3-4): Feature Parity
- TC-007 through TC-015
- **Deliverable**: All 5 screens functional in native apps

### Sprint 3 (Week 5-6): Native Integration
- TC-016 through TC-022
- **Deliverable**: Haptics, safe areas, status bar configured

### Sprint 4 (Week 7): Platform-Specific
- TC-023 through TC-026
- **Deliverable**: Icons configured, builds validated

### Sprint 5 (Week 8): Performance & QA
- TC-027 through TC-031
- **Deliverable**: Performance optimized, no critical bugs

### Sprint 6 (Week 9): Submission
- TC-032 through TC-035
- **Deliverable**: Apps in TestFlight and Play Internal Testing

---

## Regression Test Suite

After any code changes, run these critical tests:

1. **Smoke Test** (10 minutes):
   - Launch app
   - Navigate to all 5 tabs
   - Tap 3 buttons on Buttons screen
   - Spin spinner once
   - Draw one line on Drawing screen

2. **Core Flows** (30 minutes):
   - TC-007 (Buttons functionality)
   - TC-009 (Spinner physics)
   - TC-013 (Canvas drawing)
   - TC-015 (Tab navigation)
   - TC-016 (Haptics)

3. **Platform Tests** (20 minutes):
   - TC-017 (iOS safe areas)
   - TC-018 (Android system bars)
   - TC-023 (iOS icons)
   - TC-024 (Android icons)

---

## Bug Severity Classification

- **P0 - Critical**: App crashes, data loss, cannot submit to store
- **P1 - High**: Core feature broken, major UI issues
- **P2 - Medium**: Minor feature issues, cosmetic problems
- **P3 - Low**: Nice-to-haves, future enhancements

---

## Test Coverage Goals

- **Unit Tests**: 80% code coverage (haptics, utilities)
- **Integration Tests**: 100% screen coverage (all 5 screens)
- **E2E Tests**: 100% user flow coverage (all interactions)
- **Platform Tests**: 100% iOS/Android specific features

---

## Exit Criteria for Each Phase

### Focus Phase:
- All test scenarios documented ✅
- Test environments identified ✅

### Orchestrate Phase:
- Test automation framework selected
- Test data prepared

### Refine Phase:
- TC-001 through TC-015 executed and passing

### Generate Phase:
- TC-016 through TC-026 executed and passing
- 0 P0 bugs, < 3 P1 bugs

### Evaluate Phase:
- TC-027 through TC-035 executed and passing
- Apps submitted to stores
- User acceptance testing complete

---

*Generated from FORGE cycle: app-store-migration-native-ios-android-apps*
*Version 2.0.0 - Comprehensive test scenarios defined*
