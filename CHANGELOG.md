# SignClub Changelog

## Version 1.0.0 - Initial Release

### 🎉 Major Changes
- **Rebranded from QuickSign to SignClub** - Pop culture reference to Fight Club
- **Focused on Google Docs** - Removed PDF viewer support due to Chrome limitations
- **Simplified codebase** - Removed unnecessary files and dependencies

### ✨ Features
- Create signatures with smooth canvas drawing
- Save unlimited signatures with custom names
- Insert signatures via right-click context menu
- Cloud sync across Chrome browsers using local storage
- On-the-fly signature creation
- Auto-save all signatures to library
- Download signatures as PNG images

### 🎯 Supported Platforms
- ✅ Google Docs (docs.google.com)
- ✅ Google Drive (drive.google.com)
- ✅ PDFs opened through Google Drive

### 🗑️ Removed
- PDF viewer direct support (Chrome sandbox limitation)
- Vite build process (not needed for extension)
- Legacy web app code
- Unused documentation files

### 📝 Files Structure
- `manifest.json` - Extension configuration
- `popup.html` / `popup.js` - Extension popup interface
- `background.js` - Service worker and context menus
- `content-google-docs.js` - Google Docs integration
- `favicon-256.png` - Extension icon
- `README.md` - User documentation

### 🔧 Technical Details
- Manifest V3 compliant
- Vanilla JavaScript (no frameworks)
- Chrome Storage API (local storage)
- Canvas API for drawing
- No external dependencies

### 🎨 Branding
- **Name**: SignClub
- **Tagline**: "First rule of SignClub? You always sign your documents!"
- **Description**: Digital Signatures for Google Docs
- **Color Scheme**: Purple gradient (#667eea to #764ba2)

---

## Next Steps

- [ ] Chrome Web Store submission
- [ ] User testing and feedback
- [ ] Marketing materials
- [ ] Demo video
- [ ] Screenshots for store listing
