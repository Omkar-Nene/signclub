# SignClub ✍️

**Digital Signatures for Google Docs** - Create, manage, and insert signatures instantly.

> _"First rule of SignClub? You always sign your documents!"_

## What is SignClub?

SignClub is a Chrome extension that makes adding digital signatures to Google Docs effortless. Draw your signature once, save it, and insert it anywhere with a simple right-click.

Perfect for contracts, approvals, personal letters, and any document that needs your signature.

## ✨ Features

- **🎨 Create Signatures**: Draw smooth, professional signatures with your mouse or trackpad
- **💾 Save Multiple Signatures**: Store unlimited signatures with custom names
- **⚡ Quick Insert**: Right-click anywhere in Google Docs to insert
- **🔄 Cloud Sync**: Signatures sync across all your Chrome browsers
- **📝 On-the-Fly Creation**: Create and insert signatures without pre-saving
- **🎯 Smart Library**: All signatures automatically saved and available in context menu

## 🚀 How It Works

### 1. Create Your First Signature

1. Click the **SignClub** icon in your Chrome toolbar
2. Go to the **"Create"** tab
3. Draw your signature on the canvas
4. Name it (e.g., "Work Signature")
5. Click **"Save Signature"**

### 2. Insert Into Google Docs

**Method 1: Pre-saved Signature**
1. Open any Google Doc
2. Right-click where you want your signature
3. Select **SignClub → Insert Saved Signature → [Your Signature]**
4. Press **Ctrl+V** (or Cmd+V on Mac) to paste
5. Done! ✅

**Method 2: Create & Insert**
1. Open a Google Doc
2. Right-click where you need a signature
3. Select **SignClub → Create & Insert Signature**
4. Draw your signature in the modal
5. Optionally give it a custom name
6. Click **"Insert Signature"**
7. It's saved to your library AND pasted in the document! ✨

## 📦 Installation

### For Testing (Developer Mode)

1. Clone this repository
   ```bash
   git clone <repository-url>
   cd quick_sign_app
   ```

2. Open Chrome and go to Extensions
   - Navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right)

3. Load the extension
   - Click **"Load unpacked"**
   - Select the `quick_sign_app` folder
   - SignClub appears in your extensions!

4. Pin it (optional)
   - Click the puzzle icon in Chrome toolbar
   - Find SignClub and click the pin icon

### From Chrome Web Store (Coming Soon)

SignClub will be available in the Chrome Web Store soon!

## 💡 Usage Tips

- **Multiple Signatures**: Create different signatures for work, personal, initials, etc.
- **Auto-Save**: Every signature you create is automatically saved to your library
- **Custom Names**: Check the box when creating to give meaningful names
- **Timestamp Names**: Unchecked signatures get timestamped names automatically
- **Cloud Sync**: Sign in to Chrome to sync signatures across devices
- **Google Drive PDFs**: Open PDFs through Google Drive - SignClub works there too!

## 🎯 Perfect For

- ✅ Signing contracts and agreements
- ✅ Approving documents
- ✅ Personal correspondence
- ✅ Business documents
- ✅ Legal forms
- ✅ PDFs opened in Google Drive
- ✅ Any Google Docs document

## 🔧 Tech Stack

- **Platform**: Chrome Extension (Manifest V3)
- **JavaScript**: Vanilla JS ES6+
- **Canvas API**: For smooth signature drawing
- **Chrome Storage**: Local storage for signatures
- **No external dependencies**: Lightweight and fast

## 📂 Project Structure

```
quick_sign_app/
├── manifest.json              # Extension configuration
├── popup.html                 # Extension popup UI
├── popup.js                   # Popup logic & signature canvas
├── background.js              # Service worker & context menus
├── content-google-docs.js     # Google Docs integration
├── favicon-256.png            # Extension icon
└── README.md                  # This file
```

## 🌟 Why SignClub?

**Fast**: Insert signatures in seconds, not minutes
**Simple**: No complex setup or accounts needed
**Secure**: All signatures stored locally in Chrome
**Synced**: Access your signatures on any Chrome browser
**Free**: No subscriptions, no paywalls
**Privacy**: No data sent to external servers

## ⚙️ Permissions Explained

SignClub requests these permissions:

- **storage**: Save your signatures locally
- **contextMenus**: Add right-click menu options
- **activeTab**: Access current tab to insert signatures
- **notifications**: Show helpful tips and status updates
- **docs.google.com, drive.google.com**: Insert signatures into Google Docs/Drive

**Privacy**: SignClub does NOT collect, track, or transmit your data. Everything stays on your device.

## 🐛 Troubleshooting

**Signature won't paste in Google Docs?**
- Try pressing Ctrl+V (Cmd+V on Mac) manually
- Grant clipboard permissions if prompted

**Context menu not appearing?**
- Refresh the Google Doc page
- Make sure you're on a Google Docs page (docs.google.com)

**Signatures not syncing?**
- Sign in to Chrome
- Check you're using the same Google account

**Extension not loading?**
- Refresh `chrome://extensions/`
- Check for error messages on the extension card
- Make sure Developer Mode is enabled

## 🔮 Roadmap

- [ ] Signature templates and styles
- [ ] Keyboard shortcuts for quick insert
- [ ] Signature search and filtering
- [ ] Export/import signature library
- [ ] Multiple signature formats (initials, stamps)
- [ ] Dark mode support
- [ ] Custom signature colors

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Omkar Nene**

- GitHub: [@omkarnene](https://github.com/omkarnene) _(update with your actual username)_

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues) if you want to contribute.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 🎬 Tagline

**"First rule of SignClub? You always sign your documents!"**

---

Made with ❤️ for everyone who needs to sign documents online.
