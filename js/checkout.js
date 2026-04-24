'use strict';

/* ══════════════════════════════════════════════
   AccessShop — Checkout Manager
   Multi-step form with inline ARIA validation,
   progress indicator, and order confirmation.
══════════════════════════════════════════════ */

class CheckoutManager {
    constructor(notifier, announcer, getCart) {
        this.notifier = notifier;
        this.announcer = announcer;
        this.getCart = getCart;   // function returning CartManager instance
        this.step = 1;
        this._bind();
    }

    /* ── Navigate Steps ── */
    goTo(n) {
        const current = document.getElementById(`checkout-step-${this.step}`);
        const next = document.getElementById(`checkout-step-${n}`);
        if (!next) return;
        current?.setAttribute('hidden', '');
        next.removeAttribute('hidden');
        // Update step indicator
        for (let i = 1; i <= 3; i++) {
            const ind = document.getElementById(`step-indicator-${i}`);
            if (!ind) continue;
            ind.classList.toggle('active', i === n);
            ind.classList.toggle('completed', i < n);
            ind.setAttribute('aria-current', i === n ? 'step' : 'false');
        }
        this.step = n;
        next.querySelector('h3, h2')?.focus();
        this.announcer.politely(`Step ${n}: ${['Delivery', 'Payment', 'Order Summary'][n - 1]}`);
        document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
    }

    /* ── Field Validation ── */
    _setError(id, msg) {
        const input = document.getElementById(id);
        const error = document.getElementById(`${id}-error`);
        if (input) { input.setAttribute('aria-invalid', 'true'); input.classList.add('error'); }
        if (error) { error.textContent = msg; error.removeAttribute('hidden'); }
    }
    _clearError(id) {
        const input = document.getElementById(id);
        const error = document.getElementById(`${id}-error`);
        if (input) { input.removeAttribute('aria-invalid'); input.classList.remove('error'); }
        if (error) { error.setAttribute('hidden', ''); error.textContent = ''; }
    }

    _validateStep1() {
        const fields = [
            { id: 'first-name', label: 'First name', pattern: /\S+/ },
            { id: 'last-name', label: 'Last name', pattern: /\S+/ },
            { id: 'email', label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            { id: 'address', label: 'Address', pattern: /\S+/ },
            { id: 'city', label: 'City', pattern: /\S+/ },
            { id: 'pincode', label: 'PIN code', pattern: /^\d{6}$/ },
        ];
        let valid = true;
        fields.forEach(f => {
            const val = document.getElementById(f.id)?.value.trim() || '';
            if (!f.pattern.test(val)) {
                this._setError(f.id, `Please enter a valid ${f.label}`);
                valid = false;
            } else { this._clearError(f.id); }
        });
        if (!valid) {
            this.notifier.error('Form Incomplete', 'Please fill all required fields correctly.');
            this.announcer.urgently('Form has errors. Please correct the highlighted fields.');
            // Focus first error
            const firstErr = document.querySelector('[aria-invalid="true"]');
            firstErr?.focus();
        }
        return valid;
    }

    /* ── Build Order Summary ── */
    _renderSummary() {
        const cart = this.getCart();
        if (!cart) return;
        const container = document.getElementById('order-summary');
        if (!container) return;

        const items = cart.getItems();
        const total = cart.total;
        const delivery = total >= 999 ? 0 : 49;
        const grandTotal = total + delivery;

        const fname = document.getElementById('first-name')?.value.trim() || '';
        const lname = document.getElementById('last-name')?.value.trim() || '';
        const addr = document.getElementById('address')?.value.trim() || '';
        const city = document.getElementById('city')?.value.trim() || '';
        const pin = document.getElementById('pincode')?.value.trim() || '';
        const method = document.querySelector('input[name="payment"]:checked')?.value || 'upi';
        const methodLabels = { upi: 'UPI / PhonePe / GPay', card: 'Credit / Debit Card', cod: 'Cash on Delivery' };

        container.innerHTML = `
      <div class="order-summary-item">
        <span><strong>Delivery to:</strong></span>
        <span>${fname} ${lname}, ${city} - ${pin}</span>
      </div>
      <div class="order-summary-item">
        <span><strong>Address:</strong></span>
        <span>${addr}</span>
      </div>
      <div class="order-summary-item">
        <span><strong>Payment:</strong></span>
        <span>${methodLabels[method]}</span>
      </div>
      ${items.map(item => `
        <div class="order-summary-item">
          <span>${item.name} × ${item.qty}</span>
          <span>₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
      `).join('')}
      <div class="order-summary-item">
        <span>Delivery Charges</span>
        <span>${delivery === 0 ? '<em style="color:var(--clr-success)">FREE</em>' : `₹${delivery}`}</span>
      </div>
      <div class="order-summary-total">
        <span>Grand Total</span>
        <span style="color:var(--clr-primary)">₹${grandTotal.toLocaleString('en-IN')}</span>
      </div>
    `;
    }

    /* ── Place Order ── */
    _placeOrder() {
        const orderId = `AS${Date.now().toString().slice(-8)}`;
        // Hide all steps
        for (let i = 1; i <= 3; i++) document.getElementById(`checkout-step-${i}`)?.setAttribute('hidden', '');
        // Show success
        const success = document.getElementById('order-success');
        const orderNo = document.getElementById('order-number');
        if (success) success.removeAttribute('hidden');
        if (orderNo) orderNo.textContent = `Order ID: ${orderId}`;
        this.getCart()?.clear();
        this.notifier.success('Order Placed!', `Your order ${orderId} has been confirmed.`);
        this.announcer.urgently(`Order placed successfully! Your order ID is ${orderId}. A confirmation has been sent to your email.`);
    }

    /* ── Bindings ── */
    _bind() {
        document.getElementById('step1-next')?.addEventListener('click', () => {
            if (this._validateStep1()) this.goTo(2);
        });
        document.getElementById('step2-back')?.addEventListener('click', () => this.goTo(1));
        document.getElementById('step2-next')?.addEventListener('click', () => {
            this._renderSummary();
            this.goTo(3);
        });
        document.getElementById('step3-back')?.addEventListener('click', () => this.goTo(2));
        document.getElementById('place-order-btn')?.addEventListener('click', () => this._placeOrder());

        document.getElementById('continue-shopping-btn')?.addEventListener('click', () => {
            document.getElementById('checkout-section')?.setAttribute('hidden', '');
            document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
            // Reset form for next use
            this.step = 1;
            for (let i = 2; i <= 3; i++) document.getElementById(`checkout-step-${i}`)?.setAttribute('hidden', '');
            document.getElementById('checkout-step-1')?.removeAttribute('hidden');
            document.getElementById('order-success')?.setAttribute('hidden', '');
        });

        // Checkout button in header
        document.getElementById('header-checkout-btn')?.addEventListener('click', e => {
            e.preventDefault();
            const cs = document.getElementById('checkout-section');
            if (cs) { cs.removeAttribute('hidden'); cs.scrollIntoView({ behavior: 'smooth' }); }
        });

        // Clear field errors on input
        document.querySelectorAll('.form-group input').forEach(inp => {
            inp.addEventListener('input', () => {
                if (inp.getAttribute('aria-invalid')) this._clearError(inp.id);
            });
        });
    }
}

window.CheckoutManager = CheckoutManager;
