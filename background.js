/**
 * SignClub - Background Service Worker
 * Handles context menus and communication between popup and content scripts
 */

// Create context menu on installation
chrome.runtime.onInstalled.addListener(async () => {
    // Parent menu item
    chrome.contextMenus.create({
        id: 'signclub-parent',
        title: 'SignClub',
        contexts: ['page', 'frame']
    });

    // Create & insert signature
    chrome.contextMenus.create({
        id: 'signclub-create-insert',
        parentId: 'signclub-parent',
        title: 'Create & Insert Signature',
        contexts: ['page', 'frame']
    });

    // Separator
    chrome.contextMenus.create({
        id: 'signclub-separator',
        parentId: 'signclub-parent',
        type: 'separator',
        contexts: ['page', 'frame']
    });

    // Insert saved signatures (will be populated dynamically)
    chrome.contextMenus.create({
        id: 'signclub-insert-saved',
        parentId: 'signclub-parent',
        title: 'Insert Saved Signature',
        contexts: ['page', 'frame']
    });

    console.log('SignClub context menus created');

    // Load saved signatures immediately
    await updateContextMenu();
});

// Update context menu with saved signatures
async function updateContextMenu() {
    const result = await chrome.storage.local.get(['signatures']);
    const signatures = result.signatures || [];

    // Remove old signature menu items
    chrome.contextMenus.remove('signclub-insert-saved', () => {
        // Recreate with submenu
        if (signatures.length === 0) {
            chrome.contextMenus.create({
                id: 'signclub-insert-saved',
                parentId: 'signclub-parent',
                title: 'Insert Saved Signature',
                contexts: ['page', 'frame'],
                enabled: false
            });
        } else {
            chrome.contextMenus.create({
                id: 'signclub-insert-saved',
                parentId: 'signclub-parent',
                title: 'Insert Saved Signature',
                contexts: ['page', 'frame']
            });

            // Add each signature as a submenu item
            signatures.forEach((sig, index) => {
                chrome.contextMenus.create({
                    id: `signclub-sig-${sig.id}`,
                    parentId: 'signclub-insert-saved',
                    title: sig.name,
                    contexts: ['page', 'frame']
                });
            });
        }
    });
}

// Listen for storage changes to update menu
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.signatures) {
        updateContextMenu();
    }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('SignClub BG: Context menu clicked', {
        menuItemId: info.menuItemId,
        tab: tab,
        tabId: tab?.id,
        tabIdType: typeof tab?.id
    });

    // Check if tab is valid (tab.id can be undefined or -1 for some special pages)
    if (!tab || typeof tab.id !== 'number' || tab.id < 0) {
        console.warn('SignClub: Cannot inject into this page (tab ID:', tab?.id + '). Chrome internal pages and some PDFs are protected.');

        // Show a notification to the user
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'favicon-256.png',
            title: 'SignClub - PDF Viewer Limitation',
            message: 'Chrome\'s built-in PDF viewer is protected. To add signatures:\n1. Download the PDF\n2. Open from file system, OR\n3. Use Google Drive PDFs'
        });
        return;
    }

    const message = info.menuItemId === 'signclub-create-insert'
        ? { action: 'openSignatureModal', clickPosition: { x: info.pageX, y: info.pageY } }
        : null;

    if (info.menuItemId === 'signclub-create-insert') {
        console.log('SignClub BG: Sending openSignatureModal to tab', tab.id);
        // Try sending to main frame first, then all frames if it fails
        try {
            await chrome.tabs.sendMessage(tab.id, message);
            console.log('SignClub BG: Message sent to main frame');
        } catch (error) {
            console.log('SignClub BG: Main frame failed, trying all frames');
            // Get all frames and send to each
            const frames = await chrome.webNavigation.getAllFrames({ tabId: tab.id });
            for (const frame of frames) {
                try {
                    await chrome.tabs.sendMessage(tab.id, message, { frameId: frame.frameId });
                    console.log('SignClub BG: Message sent to frame', frame.frameId);
                } catch (e) {
                    // Ignore frame errors
                }
            }
        }
    } else if (info.menuItemId.startsWith('signclub-sig-')) {
        const signatureId = info.menuItemId.replace('signclub-sig-', '');
        const result = await chrome.storage.local.get(['signatures']);
        const signatures = result.signatures || [];
        const signature = signatures.find(sig => sig.id === signatureId);

        if (signature) {
            console.log('SignClub BG: Sending insertSignature to tab', tab.id);
            const sigMessage = {
                action: 'insertSignature',
                signature: signature,
                clickPosition: { x: info.pageX, y: info.pageY }
            };

            try {
                await chrome.tabs.sendMessage(tab.id, sigMessage);
                console.log('SignClub BG: Message sent to main frame');
            } catch (error) {
                console.log('SignClub BG: Main frame failed, trying all frames');
                const frames = await chrome.webNavigation.getAllFrames({ tabId: tab.id });
                for (const frame of frames) {
                    try {
                        await chrome.tabs.sendMessage(tab.id, sigMessage, { frameId: frame.frameId });
                        console.log('SignClub BG: Message sent to frame', frame.frameId);
                    } catch (e) {
                        // Ignore frame errors
                    }
                }
            }
        }
    }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSignatures') {
        chrome.storage.local.get(['signatures'], (result) => {
            sendResponse({ signatures: result.signatures || [] });
        });
        return true; // Keep channel open for async response
    }

    if (request.action === 'updateContextMenu') {
        updateContextMenu();
    }
});

// Initialize context menu on startup
chrome.runtime.onStartup.addListener(() => {
    updateContextMenu();
});

console.log('SignClub background service worker loaded');

// Also update menu when service worker wakes up
updateContextMenu();
