/* ══════════════════════════════════════════════
   AccessShop — Accessibility Engine
   Toolbar | Notifier | Announcer | Sign Language
   ══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   Screen Reader Announcer
   Injects text into ARIA live regions
   so screen readers announce changes.
───────────────────────────────────────── */
class ScreenReaderAnnouncer {
    constructor() {
        this.polite = document.getElementById('aria-live-polite');
        this.assertive = document.getElementById('aria-live-assertive');
    }

    /** Announce a non-urgent message (won't interrupt current speech) */
    politely(message) {
        if (!this.polite) return;
        this.polite.textContent = '';
        requestAnimationFrame(() => { this.polite.textContent = message; });
    }

    /** Announce an urgent alert (will interrupt current speech) */
    urgently(message) {
        if (!this.assertive) return;
        this.assertive.textContent = '';
        requestAnimationFrame(() => { this.assertive.textContent = message; });
    }
}

/* ─────────────────────────────────────────
   Visual Notifier (Toast System)
   For deaf users — replaces all audio cues
   with prominent visual toasts.
───────────────────────────────────────── */
class VisualNotifier {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.announcer = new ScreenReaderAnnouncer();
    }

    show({ type = 'info', title, message, duration = 4000 }) {
        const icons = { success: '✅', warning: '⚠️', error: '❌', info: '💡', cart: '🛒' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button class="toast-dismiss" aria-label="Dismiss notification">✕</button>
    `;
        this.container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        const dismiss = toast.querySelector('.toast-dismiss');
        const remove = () => {
            toast.style.animation = 'none';
            toast.style.transform = 'translateX(120%)';
            toast.style.opacity = '0';
            toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        };
        dismiss.addEventListener('click', remove);
        if (duration > 0) setTimeout(remove, duration);

        // Also announce to screen reader
        this.announcer.politely(`${title}. ${message || ''}`);

        // Visual flash on page for deaf users
        document.body.classList.add('visual-flash');
        setTimeout(() => document.body.classList.remove('visual-flash'), 700);

        return toast;
    }

    success(title, message) { this.show({ type: 'success', title, message }); }
    error(title, message) { this.show({ type: 'error', title, message, duration: 6000 }); }
    warning(title, message) { this.show({ type: 'warning', title, message }); }
    cart(title, message) { this.show({ type: 'cart', title, message }); }
    info(title, message) { this.show({ type: 'info', title, message }); }
}

/* ─────────────────────────────────────────
   Accessibility Toolbar Controller
   Persists preferences to localStorage.
───────────────────────────────────────── */
class AccessibilityToolbar {
    constructor(notifier) {
        this.notifier = notifier;
        this.prefs = this._loadPrefs();
        this._applyAll();
        this._bind();
    }

    _defaultPrefs() {
        return { font: 'normal', contrast: 'normal', motor: false, reduceMotion: false, keyboard: false, signLang: false };
    }

    _loadPrefs() {
        try {
            const saved = localStorage.getItem('accessshop_a11y');
            return saved ? { ...this._defaultPrefs(), ...JSON.parse(saved) } : this._defaultPrefs();
        } catch { return this._defaultPrefs(); }
    }

    _savePrefs() {
        try { localStorage.setItem('accessshop_a11y', JSON.stringify(this.prefs)); } catch { }
    }

    _applyAll() {
        this._applyFont(this.prefs.font);
        this._applyContrast(this.prefs.contrast);
        this._applyMotor(this.prefs.motor);
        this._applyReduceMotion(this.prefs.reduceMotion);
        this._applyKeyboard(this.prefs.keyboard);
        this._applySignLang(this.prefs.signLang);
    }

    _applyFont(val) {
        document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
        if (val !== 'normal') document.body.classList.add(`font-${val}`);
        document.querySelectorAll('[data-font]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.font === val);
            btn.setAttribute('aria-pressed', btn.dataset.font === val);
        });
    }

    _applyContrast(val) {
        document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        if (val !== 'normal') document.body.classList.add(`contrast-${val}`);
        document.querySelectorAll('[data-contrast]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.contrast === val);
            btn.setAttribute('aria-pressed', btn.dataset.contrast === val);
        });
    }

    _applyMotor(on) {
        document.body.classList.toggle('motor-friendly', on);
        const btn = document.getElementById('motor-mode-toggle');
        if (btn) btn.setAttribute('aria-checked', String(on));
    }

    _applyReduceMotion(on) {
        document.body.classList.toggle('reduce-motion', on);
        const btn = document.getElementById('reduce-motion-toggle');
        if (btn) btn.setAttribute('aria-checked', String(on));
    }

    _applyKeyboard(on) {
        document.body.classList.toggle('keyboard-mode', on);
        const btn = document.getElementById('keyboard-mode-toggle');
        if (btn) btn.setAttribute('aria-checked', String(on));
    }

    _applySignLang(on) {
        const panel = document.getElementById('sign-lang-panel');
        const toggle = document.getElementById('sign-lang-toggle');
        if (panel) { if (on) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', ''); }
        if (toggle) toggle.setAttribute('aria-checked', String(on));
    }

    _bind() {
        // Panel toggle
        const toggleBtn = document.getElementById('a11y-panel-toggle');
        const controls = document.getElementById('a11y-controls');
        if (toggleBtn && controls) {
            toggleBtn.addEventListener('click', () => {
                const open = controls.hasAttribute('hidden');
                if (open) { controls.removeAttribute('hidden'); toggleBtn.setAttribute('aria-expanded', 'true'); }
                else { controls.setAttribute('hidden', ''); toggleBtn.setAttribute('aria-expanded', 'false'); }
            });
        }

        // Font buttons
        document.querySelectorAll('[data-font]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.prefs.font = btn.dataset.font;
                this._applyFont(btn.dataset.font);
                this._savePrefs();
                this.notifier.info('Font Size Updated', `Changed to ${btn.dataset.font}`);
            });
        });

        // Contrast buttons
        document.querySelectorAll('[data-contrast]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.prefs.contrast = btn.dataset.contrast;
                this._applyContrast(btn.dataset.contrast);
                this._savePrefs();
                this.notifier.info('Display Updated', `Contrast set to ${btn.dataset.contrast}`);
            });
        });

        // Switches
        const switches = {
            'motor-mode-toggle': 'motor',
            'reduce-motion-toggle': 'reduceMotion',
            'keyboard-mode-toggle': 'keyboard',
            'sign-lang-toggle': 'signLang',
        };
        Object.entries(switches).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', () => {
                this.prefs[key] = !this.prefs[key];
                this[`_apply${key.charAt(0).toUpperCase() + key.slice(1)}`](this.prefs[key]);
                this._savePrefs();
                const labels = {
                    motor: 'Motor-Friendly Mode', reduceMotion: 'Reduce Motion',
                    keyboard: 'Keyboard Mode', signLang: 'Sign Language Panel'
                };
                this.notifier.info(labels[key], this.prefs[key] ? 'Enabled' : 'Disabled');
            });
        });

        // Sign language close button
        const slClose = document.getElementById('sign-lang-close');
        if (slClose) {
            slClose.addEventListener('click', () => {
                this.prefs.signLang = false;
                this._applySignLang(false);
                this._savePrefs();
            });
        }

        // Hero a11y button
        const heroBtn = document.getElementById('hero-a11y-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                const controls = document.getElementById('a11y-controls');
                const toggleBtn = document.getElementById('a11y-panel-toggle');
                if (controls && controls.hasAttribute('hidden')) {
                    controls.removeAttribute('hidden');
                    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
                }
                document.getElementById('accessibility-toolbar')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Footer keyboard help link
        const footerKb = document.getElementById('footer-keyboard-help');
        if (footerKb) footerKb.addEventListener('click', e => { e.preventDefault(); window.openKeyboardHelp?.(); });

        // Footer sign lang link
        const footerSl = document.getElementById('footer-sign-lang');
        if (footerSl) footerSl.addEventListener('click', e => {
            e.preventDefault();
            this.prefs.signLang = true;
            this._applySignLang(true);
            this._savePrefs();
        });
    }
}

/* ─────────────────────────────────────────
   Keyboard Navigator
   Implements roving tab-index for the
   product grid so arrow keys work.
───────────────────────────────────────── */
class KeyboardNavigator {
    constructor() {
        this.grid = null;
        this._bindGlobal();
    }

    /** Call after grid is rendered */
    init() {
        this.grid = document.getElementById('products-container');
        if (!this.grid) return;
        const cards = this._cards();
        cards.forEach((card, i) => {
            card.setAttribute('tabindex', i === 0 ? '0' : '-1');
            card.addEventListener('keydown', e => this._onCardKey(e));
        });
    }

    _cards() {
        return Array.from(this.grid?.querySelectorAll('.product-card') || []);
    }

    _onCardKey(e) {
        const cards = this._cards();
        const idx = cards.indexOf(e.currentTarget);
        const cols = this._colCount();
        let next = -1;

        if (e.key === 'ArrowRight') next = idx + 1;
        if (e.key === 'ArrowLeft') next = idx - 1;
        if (e.key === 'ArrowDown') next = idx + cols;
        if (e.key === 'ArrowUp') next = idx - cols;

        if (next >= 0 && next < cards.length) {
            e.preventDefault();
            cards[idx].setAttribute('tabindex', '-1');
            cards[next].setAttribute('tabindex', '0');
            cards[next].focus();
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
        }
    }

    _colCount() {
        const cards = this._cards();
        if (cards.length < 2) return 1;
        const firstTop = cards[0].getBoundingClientRect().top;
        let cols = 1;
        for (let i = 1; i < cards.length; i++) {
            if (Math.abs(cards[i].getBoundingClientRect().top - firstTop) < 5) cols++;
            else break;
        }
        return cols;
    }

    _bindGlobal() {
        document.addEventListener('keydown', e => {
            // '/' focuses search
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                document.getElementById('site-search')?.focus();
            }
            // 'c' toggles cart
            if (e.key === 'c' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                window.toggleCart?.();
            }
            // 'a' opens accessibility panel
            if (e.key === 'a' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                const controls = document.getElementById('a11y-controls');
                const toggleBtn = document.getElementById('a11y-panel-toggle');
                if (controls?.hasAttribute('hidden')) {
                    controls.removeAttribute('hidden');
                    toggleBtn?.setAttribute('aria-expanded', 'true');
                } else {
                    controls?.setAttribute('hidden', '');
                    toggleBtn?.setAttribute('aria-expanded', 'false');
                }
            }
            // '?' shows keyboard help
            if (e.key === '?') window.openKeyboardHelp?.();
            // Escape closes modals / drawers
            if (e.key === 'Escape') window.closeAll?.();
        });
    }
}

/* ─────────────────────────────────────────
   Focus Trap — keeps keyboard focus inside
   an open modal or side drawer.
───────────────────────────────────────── */
class FocusTrap {
    constructor(el) { this.el = el; this._handler = null; }

    activate() {
        this._focusFirst();
        this._handler = e => this._trap(e);
        document.addEventListener('keydown', this._handler);
    }

    deactivate() {
        if (this._handler) document.removeEventListener('keydown', this._handler);
        this._handler = null;
    }

    _focusable() {
        return Array.from(this.el.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.closest('[hidden]'));
    }

    _focusFirst() { const f = this._focusable(); if (f.length) f[0].focus(); }

    _trap(e) {
        if (e.key !== 'Tab') return;
        const focusable = this._focusable();
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
}

// Export globals
window.ScreenReaderAnnouncer = ScreenReaderAnnouncer;
window.VisualNotifier = VisualNotifier;
window.AccessibilityToolbar = AccessibilityToolbar;
window.KeyboardNavigator = KeyboardNavigator;
window.FocusTrap = FocusTrap;
