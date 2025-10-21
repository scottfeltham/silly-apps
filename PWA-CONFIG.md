# PWA Configuration Guide

This guide explains how to configure the PWA paths for different deployment scenarios.

## GitHub Pages (with repo name in URL)

**URL format:** `https://username.github.io/silly-apps/`

**Current Configuration:** ✅ Already set up correctly

The files are configured with `/silly-apps/` as the base path:
- `sw.js` - Line 2: `const BASE_PATH = '/silly-apps'`
- `manifest.json` - Lines 5-6: `start_url` and `scope`
- `index.html` - Line 136: Service worker registration

**No changes needed if your repo is named `silly-apps`**

## Custom Domain or Different Repo Name

If you're using a custom domain OR your repo has a different name, update these files:

### Option 1: Custom Domain (e.g., fidgetfun.com)

**sw.js** - Change line 2:
```javascript
const BASE_PATH = ''; // Root domain
```

**manifest.json** - Change lines 5-6:
```json
"start_url": "/",
"scope": "/",
```

And update icon paths (lines 12 & 17):
```json
"src": "/icon-192.png",
"src": "/icon-512.png",
```

**index.html** - Change line 136:
```javascript
navigator.serviceWorker.register('/sw.js')
```

### Option 2: Different Repo Name (e.g., my-fidget-app)

Replace `silly-apps` with your repo name in:

**sw.js** - Line 2:
```javascript
const BASE_PATH = '/my-fidget-app';
```

**manifest.json** - Lines 5-6:
```json
"start_url": "/my-fidget-app/",
"scope": "/my-fidget-app/",
```

And icon paths (lines 12 & 17):
```json
"src": "/my-fidget-app/icon-192.png",
"src": "/my-fidget-app/icon-512.png",
```

**index.html** - Line 136:
```javascript
navigator.serviceWorker.register('/my-fidget-app/sw.js')
```

## GitHub Pages User Site (username.github.io)

**URL format:** `https://username.github.io/`

If you're deploying to your main user site (repo named `username.github.io`):

**sw.js** - Line 2:
```javascript
const BASE_PATH = '';
```

**manifest.json** - Lines 5-6:
```json
"start_url": "/",
"scope": "/",
```

Icon paths (lines 12 & 17):
```json
"src": "/icon-192.png",
"src": "/icon-512.png",
```

**index.html** - Line 136:
```javascript
navigator.serviceWorker.register('/sw.js')
```

## Testing After Changes

1. **Clear browser cache** (Important!)
   - Chrome: DevTools → Application → Clear storage
   - Safari: Develop → Empty Caches

2. **Unregister old service worker**
   - Chrome: DevTools → Application → Service Workers → Unregister

3. **Hard reload** the page (Cmd+Shift+R or Ctrl+Shift+R)

4. **Verify service worker registration**
   - Chrome: DevTools → Application → Service Workers
   - Should show "activated and running"

5. **Test offline**
   - Chrome: DevTools → Network → Offline checkbox
   - Refresh page - should still work!

## Troubleshooting

### "Failed to register service worker"
- Check that paths match your deployment URL
- Ensure HTTPS is enabled (GitHub Pages does this automatically)
- Clear cache and try again

### App opens to GitHub profile instead of app
- BASE_PATH is wrong in `sw.js`
- start_url is wrong in `manifest.json`
- Follow the configuration above for your deployment type

### Icons not showing
- Icon paths in `manifest.json` don't match BASE_PATH
- Icons not generated yet (run `generate-icons.html`)
- Clear cache and reinstall app

### Changes not appearing
- Increment version in `sw.js`: `'fidget-fun-v2'`
- Clear browser cache
- Unregister old service worker
- Hard reload page

## Quick Reference

| Deployment Type | BASE_PATH | start_url | SW Registration |
|----------------|-----------|-----------|-----------------|
| Repo URL | `/repo-name` | `/repo-name/` | `/repo-name/sw.js` |
| Custom Domain | `''` | `/` | `/sw.js` |
| User Site | `''` | `/` | `/sw.js` |

## Need Help?

If you're still having issues:
1. Check browser console for errors (F12)
2. Verify all paths are consistent
3. Make sure icons exist: `icon-192.png` and `icon-512.png`
4. Test on HTTPS (required for service workers)
