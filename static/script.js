/* ═══════════════════════════════════════════════
   Deep Agent — Frontend Interactivity
   ═══════════════════════════════════════════════ */

// ── State ──
let currentFeature = 'chat';
let selectedSummarizeStyle = 'bullets';
let selectedCodeLang = 'python';
let selectedAnalysisType = 'full';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStyleSelectors();
    initLangSelectors();
    initAnalysisSelectors();
    initChatInput();
    initMobileMenu();
});

// ═══════ NAVIGATION ═══════
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            switchPanel(feature);
        });
    });
}

function switchPanel(feature) {
    currentFeature = feature;

    // Update nav
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-feature="${feature}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update panels
    document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`panel-${feature}`);
    if (activePanel) activePanel.classList.add('active');

    // Close mobile sidebar
    closeMobileSidebar();
}

// ═══════ MOBILE MENU ═══════
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    if (toggle) {
        toggle.addEventListener('click', toggleMobileSidebar);
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');

    // Create or toggle overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', closeMobileSidebar);
        document.body.appendChild(overlay);
    }
    overlay.classList.toggle('active', sidebar.classList.contains('open'));
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ═══════ SELECTOR BUTTONS ═══════
function initStyleSelectors() {
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSummarizeStyle = btn.dataset.style;
        });
    });
}

function initLangSelectors() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCodeLang = btn.dataset.lang;
        });
    });
}

function initAnalysisSelectors() {
    document.querySelectorAll('.analysis-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.analysis-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAnalysisType = btn.dataset.type;
        });
    });
}

// ═══════ CHAT ═══════
function initChatInput() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // Enter to send, Shift+Enter for new line
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChat();
        }
    });
}

async function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to UI
    appendMessage('user', message);
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    const typingEl = showTyping();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        const data = await res.json();

        removeTyping(typingEl);

        if (data.error) {
            appendMessage('assistant', '❌ Error: ' + data.error);
        } else {
            appendMessage('assistant', data.response);
        }
    } catch (err) {
        removeTyping(typingEl);
        appendMessage('assistant', '❌ Network error. Please check if the server is running.');
    }
}

function appendMessage(role, content) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${formatMarkdown(content)}</p>`;

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant-message';
    msgDiv.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(typing);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    return msgDiv;
}

function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function clearChat() {
    fetch('/api/chat/clear', { method: 'POST' });
    const container = document.getElementById('chatMessages');
    container.innerHTML = `
        <div class="message assistant-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>Hello! I'm <strong>Deep Agent</strong>, powered by Gemini via LangChain. I can remember our conversation context. Ask me anything!</p>
            </div>
        </div>
    `;
    showToast('Chat history cleared');
}

// ═══════ SUMMARIZER ═══════
async function summarize() {
    const text = document.getElementById('summarizeInput').value.trim();
    if (!text) return showToast('Please enter text to summarize');

    const btn = document.getElementById('summarizeBtn');
    setLoading(btn, true);

    try {
        const res = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, style: selectedSummarizeStyle }),
        });
        const data = await res.json();

        const output = document.getElementById('summarizeOutput');
        const result = document.getElementById('summarizeResult');
        output.classList.remove('hidden');

        if (data.error) {
            result.innerHTML = '❌ ' + data.error;
        } else {
            result.innerHTML = formatMarkdown(data.response);
        }
    } catch (err) {
        showToast('Network error');
    } finally {
        setLoading(btn, false);
    }
}

// ═══════ CODE GENERATOR ═══════
async function generateCode() {
    const prompt = document.getElementById('codeInput').value.trim();
    if (!prompt) return showToast('Please describe what you want to build');

    const btn = document.getElementById('generateCodeBtn');
    setLoading(btn, true);

    try {
        const res = await fetch('/api/code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, language: selectedCodeLang }),
        });
        const data = await res.json();

        const output = document.getElementById('codeOutput');
        const result = document.getElementById('codeResult');
        output.classList.remove('hidden');

        if (data.error) {
            result.innerHTML = '❌ ' + data.error;
        } else {
            result.innerHTML = formatMarkdown(data.response);
        }
    } catch (err) {
        showToast('Network error');
    } finally {
        setLoading(btn, false);
    }
}

// ═══════ TRANSLATOR ═══════
async function translateText() {
    const text = document.getElementById('translateInput').value.trim();
    if (!text) return showToast('Please enter text to translate');

    const source = document.getElementById('sourceLang').value;
    const target = document.getElementById('targetLang').value;

    const btn = document.getElementById('translateBtn');
    setLoading(btn, true);

    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, source, target }),
        });
        const data = await res.json();

        const output = document.getElementById('translateOutput');
        const result = document.getElementById('translateResult');
        output.classList.remove('hidden');

        if (data.error) {
            result.innerHTML = '❌ ' + data.error;
        } else {
            result.innerHTML = formatMarkdown(data.response);
        }
    } catch (err) {
        showToast('Network error');
    } finally {
        setLoading(btn, false);
    }
}

function swapLanguages() {
    const source = document.getElementById('sourceLang');
    const target = document.getElementById('targetLang');
    const temp = source.value;

    if (temp === 'Auto-Detect') return showToast('Cannot swap with Auto-Detect');

    source.value = target.value;
    target.value = temp;
}

// ═══════ ANALYZER ═══════
async function analyze() {
    const text = document.getElementById('analyzeInput').value.trim();
    if (!text) return showToast('Please enter text to analyze');

    const btn = document.getElementById('analyzeBtn');
    setLoading(btn, true);

    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, type: selectedAnalysisType }),
        });
        const data = await res.json();

        const output = document.getElementById('analyzeOutput');
        const result = document.getElementById('analyzeResult');
        output.classList.remove('hidden');

        if (data.error) {
            result.innerHTML = '❌ ' + data.error;
        } else {
            result.innerHTML = formatMarkdown(data.response);
        }
    } catch (err) {
        showToast('Network error');
    } finally {
        setLoading(btn, false);
    }
}

// ═══════ UTILITIES ═══════
function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Processing...';
    } else {
        btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    }
}

function copyOutput(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Copied to clipboard!');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✅ Copied to clipboard!');
    });
}

function showToast(message) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

function formatMarkdown(text) {
    if (!text) return '';

    return text
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Headers
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        // Bullet points
        .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        // Fix nested ul
        .replace(/<\/ul>\s*<ul>/g, '')
        // Numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n/g, '<br>');
}
