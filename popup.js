/**
 * SignClub - Popup Interface
 * Handles signature creation and management
 */

class PopupSignatureCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.strokes = [];
        this.currentStroke = [];

        this.setupCanvas();
        this.attachEventListeners();
    }

    setupCanvas() {
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        this.currentStroke = [coords];
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);

        // Hide placeholder
        document.getElementById('canvasPlaceholder').style.display = 'none';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const coords = this.getCoordinates(e);
        this.currentStroke.push(coords);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (this.isDrawing && this.currentStroke.length > 0) {
            this.strokes.push([...this.currentStroke]);
            this.currentStroke = [];
        }
        this.isDrawing = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = [];
        this.currentStroke = [];
        document.getElementById('canvasPlaceholder').style.display = 'block';
    }

    undo() {
        if (this.strokes.length === 0) return;

        this.strokes.pop();
        this.redraw();

        if (this.strokes.length === 0) {
            document.getElementById('canvasPlaceholder').style.display = 'block';
        }
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.strokes.forEach(stroke => {
            if (stroke.length === 0) return;

            this.ctx.beginPath();
            this.ctx.moveTo(stroke[0].x, stroke[0].y);

            for (let i = 1; i < stroke.length; i++) {
                this.ctx.lineTo(stroke[i].x, stroke[i].y);
            }

            this.ctx.stroke();
        });
    }

    isEmpty() {
        return this.strokes.length === 0;
    }

    getImageData() {
        return this.canvas.toDataURL('image/png');
    }
}

class SignatureManager {
    constructor() {
        this.signatures = [];
        this.load();
    }

    async load() {
        return new Promise((resolve) => {
            // Use local storage instead of sync to avoid quota issues
            chrome.storage.local.get(['signatures'], (result) => {
                this.signatures = result.signatures || [];
                resolve(this.signatures);
            });
        });
    }

    async save(signature) {
        this.signatures.push(signature);
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ signatures: this.signatures }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Storage error:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }

    async delete(id) {
        this.signatures = this.signatures.filter(sig => sig.id !== id);
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ signatures: this.signatures }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Storage error:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }

    async getAll() {
        await this.load();
        return this.signatures;
    }
}

// Initialize
let signatureCanvas;
let signatureManager;

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize canvas
    const canvas = document.getElementById('signatureCanvas');
    signatureCanvas = new PopupSignatureCanvas(canvas);

    // Initialize storage
    signatureManager = new SignatureManager();
    await signatureManager.load();

    // Setup tabs
    setupTabs();

    // Setup buttons
    setupButtons();

    // Load saved signatures
    await loadSavedSignatures();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Reload signatures when switching to saved tab
            if (tabName === 'saved') {
                loadSavedSignatures();
            }
        });
    });
}

function setupButtons() {
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', () => {
        signatureCanvas.clear();
    });

    // Undo button
    document.getElementById('undoBtn').addEventListener('click', () => {
        signatureCanvas.undo();
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', async () => {
        if (signatureCanvas.isEmpty()) {
            showNotification('Please draw a signature first', 'error');
            return;
        }

        const name = document.getElementById('signatureName').value.trim() || 'Untitled Signature';
        const imageData = signatureCanvas.getImageData();

        const signature = {
            id: Date.now().toString(),
            name: name,
            imageData: imageData,
            createdAt: new Date().toISOString()
        };

        await signatureManager.save(signature);

        showNotification('Signature saved successfully!', 'success');

        // Clear canvas and input
        signatureCanvas.clear();
        document.getElementById('signatureName').value = '';

        // Switch to saved tab
        document.querySelector('[data-tab="saved"]').click();
    });
}

async function loadSavedSignatures() {
    const signatures = await signatureManager.getAll();
    const listContainer = document.getElementById('signaturesList');

    if (signatures.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No saved signatures yet</p>
                <p style="font-size: 12px; margin-top: 5px;">Create one in the Create tab!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = signatures.map(sig => `
        <div class="signature-item" data-id="${sig.id}">
            <div class="signature-preview">
                <img src="${sig.imageData}" alt="${sig.name}" />
            </div>
            <div class="signature-info">
                <div>
                    <div class="signature-name">${sig.name}</div>
                    <div class="signature-date">${formatDate(sig.createdAt)}</div>
                </div>
                <div class="signature-actions">
                    <button class="btn btn-secondary btn-small download-btn" data-id="${sig.id}">
                        Download
                    </button>
                    <button class="btn btn-danger btn-small delete-btn" data-id="${sig.id}">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Attach event listeners
    listContainer.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this signature?')) {
                await signatureManager.delete(id);
                await loadSavedSignatures();
                showNotification('Signature deleted', 'success');
            }
        });
    });

    listContainer.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const signature = signatures.find(sig => sig.id === id);
            if (signature) {
                downloadSignature(signature);
            }
        });
    });
}

function downloadSignature(signature) {
    const link = document.createElement('a');
    link.download = `${signature.name.replace(/\s+/g, '_')}.png`;
    link.href = signature.imageData;
    link.click();
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

function showNotification(message, type = 'info') {
    // Simple notification - could be enhanced
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
