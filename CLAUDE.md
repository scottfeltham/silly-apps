# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Fidget Fun" is a Progressive Web App (PWA) featuring interactive fidget toys and games. Built with vanilla JavaScript, HTML, and CSS - no build process or dependencies required.

## Development Commands

### Local Development
```bash
# Start local server (required for PWA features to work)
python -m http.server 8000
# OR
npx serve
# OR
php -S localhost:8000

# Then visit http://localhost:8000
```

### Icon Generation
```bash
# Open in browser to generate/download icons
open generate-icons.html
# Download both icon-192.png and icon-512.png before deploying
```

### Testing PWA Features
```bash
# Use Chrome DevTools:
# 1. F12 → Application tab → Service Workers (check registration)
# 2. Application tab → Manifest (verify PWA config)
# 3. Network tab → Offline checkbox (test offline functionality)
# 4. Lighthouse tab → Run PWA audit (should score 100%)
```

### Deployment
```bash
# Standard git workflow - GitHub Pages auto-deploys from main branch
git add .
git commit -m "Description"
git push
# Wait 1-3 minutes for GitHub Pages to deploy
```

## Architecture

### Core Files Structure
- `index.html` - Single-page app with all screens/tabs
- `app.js` - All interactive functionality and state management
- `styles.css` - All styling, animations, and responsive layout
- `sw.js` - Service worker for offline caching and PWA features
- `manifest.json` - PWA configuration (icons, theme, display mode)

### Key Technical Patterns

**1. Multi-Screen Tab Navigation**
- All screens exist in one HTML file, shown/hidden via CSS `.active` class
- Tab switching handled in app.js:76-96
- No routing library needed - simple DOM manipulation

**2. Haptic Feedback System**
- Centralized haptics utility (app.js:1-73) using Vibration API
- Different patterns: light, medium, heavy, success, error, pop, spin
- Check `haptics.isSupported()` before use
- Apply to interactive elements for tactile feedback

**3. Service Worker Caching Strategy**
- Cache-first approach: serve from cache, fallback to network
- Version-based cache invalidation via `CACHE_NAME` in sw.js:1
- **CRITICAL**: Increment `CACHE_NAME` (e.g., 'fidget-fun-v7') whenever making changes to cached files
- Auto-cleanup of old caches on activation (sw.js:74-92)

**4. PWA Update Mechanism**
- Automatic update checks every 60 seconds while app is running
- User-friendly update notification banner (index.html script section)
- Non-intrusive: users choose when to apply updates
- See PWA-UPDATES.md for detailed update flow

### PWA Path Configuration

The app uses base path `/silly-apps/` for GitHub Pages deployment. If deploying elsewhere:

**Files to update:**
- `sw.js:2` - `const BASE_PATH`
- `manifest.json:5-6` - `start_url` and `scope`
- `manifest.json:13,19` - icon paths
- `index.html` (service worker registration) - registration path

**Deployment scenarios:**
- GitHub Pages repo URL: `BASE_PATH = '/repo-name'`
- Custom domain: `BASE_PATH = ''`
- See PWA-CONFIG.md for complete configuration guide

### Interactive Components

**Buttons Screen** (app.js:98+)
- Randomly generated grid of 12 animated buttons
- Uses Lucide icons (30+ available in iconPool)
- 8 animation types applied via CSS classes
- Particle effects on tap using canvas

**Spinner Screen**
- Physics-based rotation with drag interaction
- 5 spinner types: classic, galaxy, ninja, flower, gear
- Touch/mouse event handling with velocity calculation
- Continuous animation loop with friction/deceleration

**Sliders Screen**
- RGB color mixer with three range inputs
- Live preview updates background color
- Values displayed as hex code

**Pop It Screen**
- 6x8 grid of toggle-able bubble elements
- State tracked per bubble (popped/unpopped)
- Counter tracks total pops

**Drawing Pad**
- HTML5 Canvas-based drawing
- Touch and mouse event support
- Canvas must resize when screen becomes active (app.js:92-95)
- **IMPORTANT**: Touch events use `{ passive: false }` and `preventDefault()` to prevent scrolling interference
- Initial touch/click draws a dot, then lineTo() draws continuous lines

### iOS/Mobile Specific Considerations

**Menu Bar**
- Uses `viewport-fit=cover` for notch/island support (index.html:5)
- `safe-area-inset` CSS variables for padding
- Bottom tab bar positioned with `padding-bottom: env(safe-area-inset-bottom)`

**Haptics**
- Vibration API works on most mobile browsers
- iOS requires user interaction to trigger
- Always check `haptics.isSupported()` first

**Standalone Mode**
- `display: standalone` in manifest.json for app-like experience
- No browser chrome when installed to home screen

## Common Modifications

### Adding a New Interactive Screen
1. Add screen HTML in index.html inside `.app-container`
2. Add corresponding tab button in bottom nav
3. Add screen styles in styles.css
4. Add initialization/interaction logic in app.js
5. Increment `CACHE_NAME` in sw.js

### Adding New Animations
1. Define CSS keyframes in styles.css
2. Add animation class (e.g., `.anim-wave`)
3. Add to `animations` array in app.js for random selection
4. No need to modify HTML

### Changing Icons
- Icon pool defined in app.js (lucide icon names)
- Add/remove icon names from `iconPool` array
- Icons render via Lucide's `lucide.createIcons()` call

### Modifying PWA Appearance
- Theme color: `manifest.json:9` and meta tag in `index.html:11`
- App name: `manifest.json:2-3`
- Background color: `manifest.json:8`
- Icons: Replace icon-192.png and icon-512.png

## Testing Checklist

When making changes:
1. Test in local server (not file:// protocol)
2. Verify offline functionality works
3. Check mobile responsiveness (all screen sizes)
4. Test touch interactions on mobile device
5. Increment cache version and verify update notification appears
6. Check Chrome DevTools → Application → Service Workers shows "activated and running"

## Important Notes

- This is vanilla JS - no npm, no build process, no transpilation
- All external dependencies loaded via CDN (Lucide icons only)
- Service worker requires HTTPS (GitHub Pages provides this automatically)
- Canvas operations must happen after element is visible in DOM
- Always test PWA features on actual mobile device, not just devtools simulator
