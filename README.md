# Fidget Fun - Interactive Fidget Toys 🎮

A Progressive Web App (PWA) with interactive fidget toys and games built with vanilla JavaScript. Perfect for stress relief, focus, or just having fun! **Works offline and can be installed on any device!**

## Features

### 🔘 Buttons
- 12 randomly generated buttons with unique shapes, sizes, and colors
- 30+ fun icons from Lucide
- 8 different animations (bounce, spin, wiggle, pulse, shake, jello, glow, rainbow)
- Particle effects on tap
- Randomize button to generate new layouts
- Tap counter

### 🌀 Spinner
- Physics-based fidget spinner
- Drag to spin with realistic momentum and friction
- Speed indicator
- Smooth animations

### 🎨 Sliders
- RGB color mixer with 3 sliders
- Live color preview
- Visual feedback

### 🫧 Pop It
- 6x8 grid of poppable bubbles
- Pop counter
- Toggle bubbles on/off
- Reset all button

### ✏️ Drawing Pad
- Free drawing canvas
- 7 color options
- Clear button
- Touch and mouse support

## PWA Features ⚡

- **📱 Installable** - Add to home screen on mobile and desktop
- **🔌 Works Offline** - Full functionality without internet connection
- **⚡ Fast Loading** - Cached assets for instant startup
- **🎨 Native Feel** - Runs in standalone mode like a native app
- **💾 Auto-Updates** - Service worker updates cache automatically

## Demo

Visit the live demo: [Your GitHub Pages URL]

## Installation

### On Mobile (iOS/Android)
1. Visit the website in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen like a native app!

### On Desktop (Chrome/Edge)
1. Visit the website
2. Click the install icon (➕) in the address bar
3. Click "Install"
4. The app opens in its own window!

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/silly-apps.git
cd silly-apps
```

2. Generate app icons:
```bash
# Open generate-icons.html in your browser
open generate-icons.html
# Click the download buttons to save icon-192.png and icon-512.png
```

3. Start a local server (required for PWA features):
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

4. Navigate to `http://localhost:8000`

## Deployment to GitHub Pages

1. Create a new repository on GitHub named `silly-apps`

2. Generate the app icons first:
```bash
# Open generate-icons.html in browser and download both icons
open generate-icons.html
```

3. Initialize git and push:
```bash
cd ~/Projects/silly-apps
git init
git add .
git commit -m "Initial commit: Fidget Fun PWA"
git branch -M main
git remote add origin https://github.com/yourusername/silly-apps.git
git push -u origin main
```

4. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your PWA will be published at `https://yourusername.github.io/silly-apps/`

5. Update the service worker:
   - Edit `sw.js` and change the base URL if your repo name is different
   - If using a custom domain, update `start_url` in `manifest.json`

## Project Structure

```
silly-apps/
├── index.html              # Main HTML file
├── styles.css              # All styling and animations
├── app.js                  # JavaScript functionality
├── sw.js                   # Service Worker for offline support
├── manifest.json           # PWA manifest
├── icon-192.png           # App icon 192x192
├── icon-512.png           # App icon 512x512
├── generate-icons.html    # Icon generator utility
├── README.md              # This file
└── .gitignore             # Git ignore file
```

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript
- [Lucide Icons](https://lucide.dev/)
- Canvas API for drawing
- Service Worker API for offline support
- Web App Manifest for PWA features

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest) - Full PWA support
- Firefox (latest) - Full PWA support
- Safari (latest) - Install to home screen on iOS
- Mobile browsers (iOS Safari, Chrome Mobile) - Full support

## PWA Technical Details

### Service Worker
- Caches all app assets on first visit
- Serves content from cache (offline-first strategy)
- Falls back to network if cache miss
- Auto-updates when new version is deployed

### Manifest
- Configures app name, icons, and theme
- Sets display mode to "standalone" for native app feel
- Optimized for portrait orientation
- Includes multiple icon sizes for all devices

## Offline Support

The app is fully functional offline:
- All UI components work without internet
- Drawings persist in memory during session
- Sounds and animations work offline
- Only requires internet for initial load and updates

## Testing PWA Features

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" - should show active worker
4. Check "Manifest" - should show app details
5. Use "Offline" checkbox to test offline functionality

### Lighthouse
1. Open DevTools
2. Go to "Lighthouse" tab
3. Run PWA audit
4. Should score 100% in PWA category

## Updating the App

When you make changes:
1. Update `CACHE_NAME` version in `sw.js` (e.g., `'fidget-fun-v2'`)
2. Commit and push changes
3. Users will automatically get updates on next visit

## License

MIT License - feel free to use this project however you'd like!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Credits

Created with ❤️ for fun and relaxation

Icons by [Lucide](https://lucide.dev/)
