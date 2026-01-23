# 🎨 Icon Generation Guide

This guide will help you generate PWA icons for the AI Architect Centre app.

## Quick Method (Browser-based)

1. **Open the icon generator:**
   - Open `scripts/generate-icons.html` in your web browser
   - Or navigate to: `file:///path/to/scripts/generate-icons.html`

2. **Generate icons:**
   - Click "Generate All Sizes" button
   - The browser will download the PNG files automatically

3. **Save the icons:**
   - Move the downloaded files to the `public/` folder:
     - `icon-192.png` → `public/icon-192.png`
     - `icon-512.png` → `public/icon-512.png`

## Alternative Method (Node.js - requires sharp)

If you have Node.js installed and want to use the automated script:

1. **Install sharp:**
   ```bash
   npm install --save-dev sharp
   ```

2. **Run the generator:**
   ```bash
   node scripts/generate-icons.js
   ```

3. **Icons will be automatically saved to `public/` folder**

## Manual Method (Online Tools)

You can also use online SVG to PNG converters:

1. Go to an online converter like:
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png

2. Upload `public/icon.svg`

3. Convert to these sizes:
   - 192x192 pixels → Save as `public/icon-192.png`
   - 512x512 pixels → Save as `public/icon-512.png`
   - 32x32 pixels → Save as `public/favicon.png` (optional)

## Icon Files Structure

After generation, your `public/` folder should contain:

```
public/
  ├── icon.svg          (Source SVG - already created)
  ├── icon-192.png      (192x192 for PWA)
  ├── icon-512.png      (512x512 for PWA)
  └── manifest.json     (PWA manifest - already created)
```

## Verification

After generating icons:

1. Run `npm run dev`
2. Open browser DevTools → Application tab
3. Check "Manifest" section - you should see your icons listed
4. Icons should appear in the browser tab and when installing as PWA

## Icon Design

The icon features:
- **Background:** Dark purple (#3A2C39) matching app theme
- **Letter "A":** Pale purple (#F2D9EE) representing "Architect"
- **AI Sparkle:** Misty orchid (#98869E) representing AI functionality
- **Grid Pattern:** Architectural grid lines in the background
- **Rounded Corners:** 80px radius for modern look

## Troubleshooting

**Icons not showing?**
- Make sure files are in the `public/` folder (not `dist/`)
- Clear browser cache
- Check browser console for 404 errors
- Verify manifest.json paths are correct

**Icons look blurry?**
- Ensure you're using the correct sizes (192x192 and 512x512)
- Don't scale up smaller icons - always generate at the target size
- Use PNG format for best quality
