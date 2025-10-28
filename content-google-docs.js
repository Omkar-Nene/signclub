/**
 * SignClub - Google Docs Content Script
 * Handles signature insertion into Google Docs
 */

let lastClickPosition = { x: 0, y: 0 };
let signatureModal = null;

// Track right-click position
document.addEventListener('contextmenu', (e) => {
    lastClickPosition = { x: e.pageX, y: e.pageY };
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertSignature') {
        insertSignatureIntoGoogleDocs(request.signature, request.clickPosition);
    } else if (request.action === 'openSignatureModal') {
        openSignatureCreationModal(request.clickPosition);
    }
});

/**
 * Insert signature image into Google Docs
 */
function insertSignatureIntoGoogleDocs(signature, clickPosition) {
    try {
        // Google Docs uses a canvas-based editor, so we need to use the Insert menu API
        // This is a workaround since Google Docs doesn't expose a direct DOM API

        // Method 1: Try to use the clipboard API (most reliable)
        insertViaClipboard(signature.imageData);

    } catch (error) {
        console.error('Error inserting signature into Google Docs:', error);
        showNotification('Failed to insert signature. Please try copying and pasting manually.', 'error');
    }
}

/**
 * Insert image via clipboard (works in Google Docs)
 */
async function insertViaClipboard(imageDataUrl) {
    try {
        // Convert base64 to blob
        const blob = await fetch(imageDataUrl).then(r => r.blob());

        // Create clipboard item
        const clipboardItem = new ClipboardItem({ 'image/png': blob });

        // Write to clipboard
        await navigator.clipboard.write([clipboardItem]);

        // Show instruction to user
        showNotification('Signature copied! Press Ctrl+V (Cmd+V on Mac) to paste it into your document.', 'success', 5000);

        // Auto-paste if we have focus
        setTimeout(() => {
            document.execCommand('paste');
        }, 100);

    } catch (error) {
        console.error('Clipboard insertion failed:', error);
        showNotification('Please use Ctrl+V (Cmd+V) to paste the signature.', 'info');
    }
}

/**
 * Open signature creation modal
 */
function openSignatureCreationModal(clickPosition) {
    if (signatureModal) {
        signatureModal.remove();
    }

    // Create modal directly in DOM (not iframe) to avoid CSP issues
    signatureModal = createModalElement();
    document.body.appendChild(signatureModal);

    // Initialize the modal
    initializeModal(signatureModal, clickPosition);
}

/**
 * Create modal element with all HTML and styles
 */
function createModalElement() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'signclub-modal-container';

    modalContainer.innerHTML = `
        <style>
            #signclub-modal-container * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            #signclub-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: signclub-fadeIn 0.2s;
            }

            @keyframes signclub-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            #signclub-modal-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: signclub-slideUp 0.3s;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            @keyframes signclub-slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            #signclub-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            #signclub-modal-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
            }

            #signclub-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s;
            }

            #signclub-modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }

            #signclub-canvas-container {
                border: 2px dashed #ddd;
                border-radius: 8px;
                margin-bottom: 16px;
                background: #fafafa;
                cursor: crosshair;
                position: relative;
            }

            #signclub-signature-canvas {
                display: block;
                border-radius: 8px;
            }

            #signclub-canvas-placeholder {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #999;
                font-size: 14px;
                pointer-events: none;
            }

            .signclub-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
            }

            .signclub-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 500;
            }

            .signclub-btn-primary {
                background: #667eea;
                color: white;
            }

            .signclub-btn-primary:hover {
                background: #5568d3;
            }

            .signclub-btn-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .signclub-btn-secondary {
                background: #f0f0f0;
                color: #333;
            }

            .signclub-btn-secondary:hover {
                background: #e0e0e0;
            }

            .signclub-save-options {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid #eee;
            }

            .signclub-checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #555;
                cursor: pointer;
            }

            .signclub-checkbox-label input {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            .signclub-input-group {
                margin-top: 12px;
            }

            .signclub-input-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
            }
        </style>

        <div id="signclub-modal-overlay">
            <div id="signclub-modal-content">
                <div id="signclub-modal-header">
                    <h2 id="signclub-modal-title">✍️ Create Signature</h2>
                    <button id="signclub-modal-close">&times;</button>
                </div>

                <div id="signclub-canvas-container">
                    <canvas id="signclub-signature-canvas" width="450" height="200"></canvas>
                    <div id="signclub-canvas-placeholder">
                        Draw your signature here
                    </div>
                </div>

                <div class="signclub-controls">
                    <button class="signclub-btn signclub-btn-secondary" id="signclub-clear-btn">Clear</button>
                    <button class="signclub-btn signclub-btn-secondary" id="signclub-undo-btn">Undo</button>
                </div>

                <button class="signclub-btn signclub-btn-primary" id="signclub-insert-btn" disabled>Insert Signature</button>

                <div class="signclub-save-options">
                    <label class="signclub-checkbox-label">
                        <input type="checkbox" id="signclub-save-for-later" />
                        <span>Give this signature a custom name</span>
                    </label>

                    <div class="signclub-input-group" id="signclub-name-input-group" style="display: none;">
                        <input type="text" id="signclub-signature-name" placeholder="Enter signature name (e.g., Work Signature)" />
                    </div>

                    <p style="font-size: 12px; color: #666; margin-top: 8px;">
                        💡 Signature will be saved to your library and available in the context menu
                    </p>
                </div>
            </div>
        </div>
    `;

    return modalContainer;
}

/**
 * Initialize modal with canvas drawing functionality
 */
function initializeModal(modalContainer, clickPosition) {
    const canvas = modalContainer.querySelector('#signclub-signature-canvas');
    const placeholder = modalContainer.querySelector('#signclub-canvas-placeholder');
    const clearBtn = modalContainer.querySelector('#signclub-clear-btn');
    const undoBtn = modalContainer.querySelector('#signclub-undo-btn');
    const insertBtn = modalContainer.querySelector('#signclub-insert-btn');
    const closeBtn = modalContainer.querySelector('#signclub-modal-close');
    const overlay = modalContainer.querySelector('#signclub-modal-overlay');
    const saveCheckbox = modalContainer.querySelector('#signclub-save-for-later');
    const nameInputGroup = modalContainer.querySelector('#signclub-name-input-group');
    const nameInput = modalContainer.querySelector('#signclub-signature-name');

    // Canvas drawing state
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let strokes = [];
    let currentStroke = [];

    // Setup canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Drawing functions
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        currentStroke = [coords];
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        placeholder.style.display = 'none';
        insertBtn.disabled = false;
    }

    function draw(e) {
        if (!isDrawing) return;
        const coords = getCoordinates(e);
        currentStroke.push(coords);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    }

    function stopDrawing() {
        if (isDrawing && currentStroke.length > 0) {
            strokes.push([...currentStroke]);
            currentStroke = [];
        }
        isDrawing = false;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes = [];
        currentStroke = [];
        placeholder.style.display = 'block';
        insertBtn.disabled = true;
    }

    function undoStroke() {
        if (strokes.length === 0) return;
        strokes.pop();
        redrawCanvas();
        if (strokes.length === 0) {
            placeholder.style.display = 'block';
            insertBtn.disabled = true;
        }
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes.forEach(stroke => {
            if (stroke.length === 0) return;
            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);
            for (let i = 1; i < stroke.length; i++) {
                ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            ctx.stroke();
        });
    }

    function closeModal() {
        if (signatureModal) {
            signatureModal.remove();
            signatureModal = null;
        }
    }

    async function insertSignature() {
        if (strokes.length === 0) return;

        const imageData = canvas.toDataURL('image/png');
        const saveForLater = saveCheckbox.checked;
        const name = nameInput.value.trim() || 'Untitled Signature';

        // ALWAYS save to library (regardless of checkbox)
        // The checkbox just controls whether to show the name input
        const signature = {
            id: Date.now().toString(),
            name: saveForLater ? name : `Signature ${new Date().toLocaleString()}`,
            imageData: imageData,
            createdAt: new Date().toISOString()
        };

        // Save signature to storage first
        try {
            const result = await chrome.storage.local.get(['signatures']);
            const signatures = result.signatures || [];
            signatures.push(signature);
            await chrome.storage.local.set({ signatures });

            // Update context menu
            chrome.runtime.sendMessage({ action: 'updateContextMenu' });

            console.log('SignClub: Signature saved to library');
        } catch (error) {
            console.error('SignClub: Failed to save signature', error);
        }

        // Then insert signature
        await insertViaClipboard(imageData);

        // Close modal
        closeModal();
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    clearBtn.addEventListener('click', clearCanvas);
    undoBtn.addEventListener('click', undoStroke);
    insertBtn.addEventListener('click', insertSignature);
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Toggle name input
    saveCheckbox.addEventListener('change', (e) => {
        nameInputGroup.style.display = e.target.checked ? 'block' : 'none';
    });

    // Prevent page scroll/interaction while modal is open
    document.body.style.overflow = 'hidden';

    // Restore on close
    const originalClose = closeModal;
    closeModal = function() {
        document.body.style.overflow = '';
        originalClose();
    };
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.id = 'signclub-notification';
    notification.textContent = message;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 999998;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        animation: slideInRight 0.3s;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

console.log('SignClub: Google Docs content script loaded');
