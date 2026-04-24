'use strict';

/* ══════════════════════════════════════════════
   AccessShop — Voice Input Manager
   Uses Web Speech API (SpeechRecognition).
   Designed for motor-impaired users who can
   speak but cannot type comfortably.
══════════════════════════════════════════════ */

class VoiceInputManager {
    constructor(notifier, announcer) {
        this.notifier = notifier;
        this.announcer = announcer;
        this._active = null;   // currently listening field id
        this._recognition = null;
        this.supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if (!this.supported) {
            console.warn('VoiceInput: SpeechRecognition not supported in this browser.');
            return;
        }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        this._recognition = new SR();
        this._recognition.lang = 'en-IN';
        this._recognition.interimResults = true;
        this._recognition.maxAlternatives = 1;
        this._recognition.continuous = false;

        this._bindEvents();
    }

    /* ── Bind speech recognition events ── */
    _bindEvents() {
        const r = this._recognition;

        r.onresult = (e) => {
            const transcript = Array.from(e.results)
                .map(res => res[0].transcript)
                .join('');
            const isFinal = e.results[e.results.length - 1].isFinal;

            const field = document.getElementById(this._active);
            if (field) {
                field.value = transcript;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                // Update live transcript badge
                const badge = document.getElementById(`voice-transcript-${this._active}`);
                if (badge) {
                    badge.textContent = transcript;
                    badge.style.display = 'block';
                }
            }

            if (isFinal) this._stopListening(true);
        };

        r.onspeechend = () => this._stopListening(true);
        r.onerror = (e) => {
            const msgs = {
                'not-allowed': 'Microphone permission denied. Please allow mic access in your browser.',
                'no-speech': 'No speech detected. Please try speaking again.',
                'network': 'Network error. Please check your connection.',
                'aborted': 'Voice input cancelled.',
            };
            const msg = msgs[e.error] || `Voice error: ${e.error}`;
            this.notifier.error('Voice Input', msg);
            this.announcer.urgently(msg);
            this._stopListening(false);
        };
        r.onend = () => this._stopListening(false);
    }

    /* ── Start listening to a specific field ── */
    start(fieldId) {
        if (!this.supported) {
            this.notifier.error('Not Supported', 'Voice input requires Chrome or Edge browser.');
            return;
        }

        // Stop any currently active listening
        if (this._active) this.stop();

        this._active = fieldId;
        const btn = document.getElementById(`mic-btn-${fieldId}`);
        const field = document.getElementById(fieldId);

        if (btn) btn.classList.add('mic-active');
        if (field) field.setAttribute('aria-busy', 'true');

        // Show listening indicator
        this._showIndicator(fieldId);
        this.announcer.politely(`Listening for ${field?.labels?.[0]?.textContent || fieldId}. Speak now.`);
        this.notifier.info('🎙 Listening…', `Speak your ${field?.labels?.[0]?.textContent || 'answer'} clearly`);

        try { this._recognition.start(); }
        catch (err) { console.warn('VoiceInput: recognition already started'); }
    }

    /* ── Stop listening ── */
    stop() {
        try { this._recognition?.abort(); } catch (_) { }
        this._stopListening(false);
    }

    _stopListening(success) {
        const fieldId = this._active;
        if (!fieldId) return;

        const btn = document.getElementById(`mic-btn-${fieldId}`);
        const field = document.getElementById(fieldId);
        if (btn) btn.classList.remove('mic-active');
        if (field) field.removeAttribute('aria-busy');

        this._hideIndicator(fieldId);
        this._active = null;

        if (success && field?.value) {
            this.notifier.success('Voice Captured', `"${field.value.slice(0, 40)}${field.value.length > 40 ? '…' : ''}" entered`);
            this.announcer.politely(`Captured: ${field.value}`);
            // Auto-advance focus to next field
            const allFields = Array.from(document.querySelectorAll('#checkout-step-1 input'));
            const idx = allFields.indexOf(field);
            if (idx >= 0 && idx < allFields.length - 1) {
                setTimeout(() => allFields[idx + 1].focus(), 400);
            }
        }
    }

    /* ── Visual listening indicator ── */
    _showIndicator(fieldId) {
        const existing = document.getElementById(`voice-indicator-${fieldId}`);
        if (existing) { existing.style.display = 'flex'; return; }
        const field = document.getElementById(fieldId);
        if (!field) return;
        const wrap = field.closest('.form-group');
        if (!wrap) return;
        const ind = document.createElement('div');
        ind.id = `voice-indicator-${fieldId}`;
        ind.className = 'voice-indicator';
        ind.setAttribute('aria-live', 'polite');
        ind.innerHTML = `
            <span class="voice-pulse" aria-hidden="true"></span>
            <span class="voice-indicator-text">Listening…</span>
            <span id="voice-transcript-${fieldId}" class="voice-transcript" aria-live="polite"></span>
        `;
        wrap.appendChild(ind);
    }

    _hideIndicator(fieldId) {
        const ind = document.getElementById(`voice-indicator-${fieldId}`);
        if (ind) ind.style.display = 'none';
    }

    /* ── Guided "Fill All" voice flow ── */
    async fillAll() {
        if (!this.supported) {
            this.notifier.error('Not Supported', 'Voice input requires Chrome or Edge browser.');
            return;
        }
        const fields = [
            { id: 'first-name', prompt: 'Say your first name' },
            { id: 'last-name', prompt: 'Say your last name' },
            { id: 'email', prompt: 'Say your email address — spell it out letter by letter if needed' },
            { id: 'address', prompt: 'Say your street address' },
            { id: 'city', prompt: 'Say your city' },
            { id: 'pincode', prompt: 'Say your 6-digit PIN code' },
        ];

        this.announcer.urgently('Starting voice-guided form fill. I will ask for each field.');
        this.notifier.info('🎙 Voice Guide Starting', 'I will prompt you for each delivery field.');

        for (const f of fields) {
            await new Promise(resolve => {
                setTimeout(() => {
                    const field = document.getElementById(f.id);
                    if (!field) { resolve(); return; }
                    field.focus();
                    this.announcer.politely(f.prompt);
                    this.notifier.info('🎙 ' + (field.labels?.[0]?.textContent || f.id), f.prompt);
                    this.start(f.id);
                    // Wait for recognition to complete or timeout after 10s
                    const poll = setInterval(() => {
                        if (this._active !== f.id) { clearInterval(poll); resolve(); }
                    }, 200);
                    setTimeout(() => { clearInterval(poll); this.stop(); resolve(); }, 10000);
                }, 800);
            });
        }

        this.notifier.success('✅ Voice Fill Complete', 'All fields filled! Please review before continuing.');
        this.announcer.politely('Voice fill complete. Please review your delivery information.');
    }
}

window.VoiceInputManager = VoiceInputManager;
