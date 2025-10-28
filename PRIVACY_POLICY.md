# Privacy Policy for SignClub

**Last Updated:** October 27, 2025

## Introduction

SignClub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome extension handles your data when you use SignClub to create and insert digital signatures into Google Docs.

## Data We Collect

### Signature Data
- **What:** Digital signature images you create using our canvas drawing tool
- **Where stored:** Locally on your device using Chrome's local storage API (`chrome.storage.local`)
- **Why:** To save your signatures for future use across Google Docs documents
- **Who has access:** Only you. Your signatures never leave your device.

### Signature Metadata
- **What:** Signature names, creation timestamps, and unique IDs
- **Where stored:** Locally on your device
- **Why:** To organize and manage your signature library
- **Who has access:** Only you

## Data We DO NOT Collect

SignClub does NOT collect, transmit, or store:
- ❌ Personal identification information
- ❌ Google account credentials or authentication tokens
- ❌ Document contents from Google Docs
- ❌ Browsing history or activity
- ❌ Usage analytics or telemetry
- ❌ IP addresses or device information
- ❌ Any data on external servers

## How We Use Your Data

Your signature data is used exclusively to:
1. Display saved signatures in the extension popup
2. Populate the right-click context menu with your signature list
3. Insert signatures into Google Docs when you select them

**All operations happen locally on your device.** We do not have servers, databases, or any backend infrastructure.

## Data Storage

### Local Storage
- Signatures are stored using Chrome's `chrome.storage.local` API
- Data remains on your device and syncs across Chrome browsers where you're signed in (via Chrome Sync)
- You can delete all signatures at any time from the extension popup

### Chrome Sync (Optional)
- If you enable Chrome Sync in your browser settings, Chrome may sync your signatures across devices where you're signed in
- This is a Chrome feature, not controlled by SignClub
- Syncing happens through Google's secure infrastructure
- You can disable Chrome Sync in your browser settings at any time

## Permissions Explained

SignClub requests the following Chrome permissions:

### `storage`
- **Why:** To save your signatures locally on your device
- **What it can access:** Only data created by SignClub (your signatures)

### `contextMenus`
- **Why:** To add right-click menu options for inserting signatures
- **What it can access:** Only the context menu system

### `activeTab`
- **Why:** To insert signatures into the active Google Docs tab when you select one
- **What it can access:** Only the active tab, and only when you click a menu item

### `notifications`
- **Why:** To show confirmation messages when signatures are saved or inserted
- **What it can access:** Only the notification system

### Host Permissions: `https://docs.google.com/*` and `https://drive.google.com/*`
- **Why:** To enable signature insertion in Google Docs and PDFs opened via Google Drive
- **What it can access:** Only to inject the signature image you selected into the document

**We do not read, modify, or transmit any document content.**

## Third-Party Services

SignClub does not integrate with, share data with, or transmit data to any third-party services, analytics platforms, or advertising networks.

## Data Security

- All data is stored locally using Chrome's secure storage APIs
- No data is transmitted over the internet to our servers (we don't have any)
- Signatures are stored as base64-encoded PNG images
- Chrome's built-in security protects your local storage data

## Your Rights

You have complete control over your data:

### Delete Signatures
- Click the trash icon next to any signature in the extension popup
- This permanently removes the signature from your device

### Delete All Data
1. Right-click the SignClub extension icon
2. Select "Remove from Chrome..."
3. Confirm removal
4. All signatures and data will be permanently deleted

### Export Data
- You can manually save signatures by right-clicking signature images in the popup and selecting "Save image as..."

## Children's Privacy

SignClub does not knowingly collect any data from children under 13. The extension is designed for general productivity use and does not target children.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted to:
- This document in our GitHub repository: https://github.com/Omkar-Nene/QuickSign/blob/main/PRIVACY_POLICY.md
- The Chrome Web Store extension listing

Continued use of SignClub after changes constitutes acceptance of the updated policy.

## Contact Us

If you have questions about this Privacy Policy or SignClub's data practices:

- **GitHub Issues:** https://github.com/Omkar-Nene/QuickSign/issues
- **Email:** [Your email address]

## Open Source

SignClub is open source software. You can review our entire codebase to verify our privacy claims:
- **Repository:** https://github.com/Omkar-Nene/QuickSign
- **License:** MIT License

## Summary

**In plain English:**
- We don't collect your personal information
- Your signatures stay on your device
- We don't have servers or databases
- We can't see your signatures or documents
- You can delete everything anytime
- The code is open source - you can verify everything

---

**SignClub** - Digital Signatures for Google Docs
Built with privacy in mind.
