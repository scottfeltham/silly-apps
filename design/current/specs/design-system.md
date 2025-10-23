# Fidget Fun Design System

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: Current Production Design

---

## Colors

### Primary Palette
```css
--primary: #667eea;        /* Purple-blue (theme color) */
--accent: #FF6B6B;         /* Coral red */
--success: #34C759;        /* Green */
--warning: #FF9500;        /* Orange */
--error: #FF3B30;          /* Red */
```

### Button Colors (Random Pool)
Defined in `app.js:107`

```javascript
const colors = [
  '#007AFF',  // Blue
  '#FF3B30',  // Red
  '#34C759',  // Green
  '#FF9500',  // Orange
  '#AF52DE',  // Purple
  '#FF2D55',  // Pink
  '#5AC8FA',  // Cyan
  '#FFCC00'   // Yellow
];
```

### Screen-Specific Backgrounds
- **Buttons Screen**: Variable (based on button colors)
- **Spinner Screen**: Dark gradient
- **Sliders Screen**: Dynamic (changes with RGB values)
- **Pop It Screen**: Teal/blue gradient
- **Drawing Screen**: Light gray

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

### Text Styles
- **Screen Title**: 32px, bold, white
- **Counter Display**: 48px, bold, white
- **Button Label**: 14px, bold, white
- **Body Text**: 16px, regular, white
- **Small Text**: 12px, regular, rgba(255,255,255,0.8)

---

## Spacing

### Base Unit: 8px

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### Common Applications
- Screen padding: 24px
- Component margin: 16px
- Button padding: 12px 24px
- Grid gap: 16px

---

## Layout

### Containers
- **App Container**: Full viewport height
- **Content Area**: Safe area insets applied
- **Tab Bar**: Fixed bottom, 80px height

### Grid Systems
- **Buttons Grid**: 3 columns on mobile, flexible
- **Pop It Grid**: 6×8 grid (48 bubbles)
- **Color Picker**: Horizontal scroll, 7 colors

---

## Components

### Buttons

#### Fidget Buttons (Buttons Screen)
```css
.fidget-button {
  /* Shapes: circle, square, rounded */
  /* Sizes: small (60px), medium (80px), large (100px), wide (120×60), tall (60×120) */
  /* Colors: From color pool */
  /* Animations: 8 types (bounce, spin, wiggle, pulse, shake, jello, glow, rainbow) */
}
```

#### Standard Buttons
```css
.reset-btn, .pop-reset, .clear-btn {
  padding: 12px 24px;
  border-radius: 24px;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
}
```

### Sliders
```css
input[type="range"] {
  height: 8px;
  border-radius: 4px;
  /* Custom thumb styling */
}
```

### Pop Bubbles
```css
.pop-bubble {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff, #ccc);
  /* Popped state inverts gradient */
}
```

### Canvas (Drawing Pad)
```javascript
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
/* 7 color options available */
```

---

## Borders & Radius

```css
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 50%;      /* For circular elements */
```

---

## Shadows

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
--shadow-md: 0 4px 16px rgba(0,0,0,0.15);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
--shadow-glow: 0 0 20px rgba(102,126,234,0.5);
```

**Usage**:
- Buttons: shadow-md
- Modals/Cards: shadow-lg
- Hover effects: shadow-glow

---

## Animations

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 600ms;
--duration-very-slow: 1000ms;
```

### Easing
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Animation Types
Defined in `app.js:142-151`

1. **animate-bounce**: Bouncing effect
2. **animate-spin**: 360° rotation
3. **animate-wiggle**: Side-to-side shake
4. **animate-pulse**: Scale up/down
5. **animate-shake**: Horizontal shake
6. **animate-jello**: Wobbly distortion
7. **animate-glow**: Pulsing glow effect
8. **animate-rainbow**: Color cycle

---

## Interactions

### Touch Targets
- **Minimum**: 44×44px (iOS), 48×48dp (Android)
- **Recommended**: 56×56px
- **Implemented**: All buttons meet minimum requirements

### Haptic Feedback
Defined in `app.js:1-73`

| Action | Pattern | Duration |
|--------|---------|----------|
| Light tap | Single | 10ms |
| Medium tap | Single | 20ms |
| Heavy tap | Single | 30ms |
| Success | Pattern | [10, 50, 10]ms |
| Error | Pattern | [30, 50, 30, 50, 30]ms |
| Pop bubble | Single | 8ms |
| Spinner spin | Variable | Based on velocity |

### Audio Feedback
- **Technology**: Web Audio API (OscillatorNode)
- **Type**: Sine wave
- **Frequency**: 600-1200 Hz (varies by action)
- **Duration**: 100ms
- **Volume**: 30% (0.3 gain)

---

## Icons

### Source
**Lucide Icons** (https://lucide.dev)
- Loaded from CDN (current)
- **Migration Plan**: Bundle locally for native apps

### Icon Pool (Buttons Screen)
30 icons in rotation:
Zap, Sparkles, Star, Heart, Rocket, Flame, Trophy, Crown, Diamond, Candy,
Target, Pizza, Music, Gamepad2, Gift, PartyPopper, Smile, Sun, Moon, Cloud,
Snowflake, Lightbulb, Glasses, Watch, Puzzle, Bug, Cherry, Apple, Cookie, IceCream

### Tab Icons (Text-based)
- Buttons: ●
- Spinner: ↻
- Sliders: ≡
- Pop It: ⊞
- Draw: ✎

---

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- White text on colored backgrounds: >4.5:1 ratio

### Touch Targets
All interactive elements: ≥44×44px

### Motion
- Animations: Can be disabled via system "Reduce Motion" setting
- Duration: All animations <1 second

### Screen Readers
- Semantic HTML where applicable
- ARIA labels on interactive elements (to be improved)

---

## Responsive Breakpoints

Currently portrait-only, single breakpoint:

```css
/* Mobile (default) */
@media (max-width: 767px) { ... }

/* Tablet and above */
@media (min-width: 768px) { ... }
```

---

## Platform-Specific

### iOS
- Safe area insets: `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`
- Status bar: Light content (white text)
- Home indicator: 34px bottom margin

### Android
- System bars: Translucent
- Status bar color: #667eea (theme color)
- Navigation: Gesture navigation compatible

---

## File Organization

```
www/
├── index.html          # Structure & markup
├── app.js              # All interactive logic (658 lines)
├── styles.css          # All styles and animations
└── assets/
    ├── icon-192.png
    └── icon-512.png
```

**Code Structure**:
- Lines 1-73: Haptics utility
- Lines 76-96: Tab navigation
- Lines 98-277: Buttons screen
- Lines 279-450: Spinner screen
- Lines 452-504: Sliders screen
- Lines 506-541: Pop It screen
- Lines 543-634: Drawing screen
- Lines 636-657: Audio utility

---

## Design Principles

### 1. Simplicity
- No clutter
- One primary action per screen
- Intuitive interactions

### 2. Delight
- Satisfying animations
- Rich haptic feedback
- Playful colors and sounds

### 3. Performance
- 60fps animations
- Instant feedback
- No loading states (all local)

### 4. Privacy
- Zero data collection
- No tracking
- No network requests

### 5. Accessibility
- High contrast
- Large touch targets
- Reduce motion support

---

## Future Considerations

### Potential Additions
- Dark mode toggle
- Custom color themes
- Sound volume control
- Animation intensity slider
- Accessibility settings panel

### Not Planned
- User accounts
- Cloud sync
- Social features
- Analytics
- Ads

---

**Maintained by**: Design Team
**Based on**: Fidget Fun v1.0.0
**Next Review**: After each major release

**To update this document**:
1. Make design changes in code
2. Update this spec to match
3. Screenshot updated screens
4. Archive previous version
