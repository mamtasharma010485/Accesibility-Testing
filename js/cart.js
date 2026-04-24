'use strict';

/* ══════════════════════════════════════════════
   AccessShop — Cart Manager
   Accessible quantity controls, focus trap,
   ARIA live announcements on all changes.
══════════════════════════════════════════════ */

class CartManager {
    constructor(notifier, announcer) {
        this.notifier = notifier;
        this.announcer = announcer;
        this.items = this._load();
        this.trap = null;
        this._bind();
        this._render();
        this._updateBadge();
    }

    /* ── Persistence ── */
    _load() {
        try { return JSON.parse(localStorage.getItem('accessshop_cart') || '[]'); }
        catch { return []; }
    }
    _save() {
        try { localStorage.setItem('accessshop_cart', JSON.stringify(this.items)); }
        catch { }
    }

    /* ── Public API ── */
    add(product, qty = 1) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty = Math.min(existing.qty + qty, 99);
            this.notifier.cart('Updated Cart', `${product.name} × ${existing.qty}`);
            this.announcer.politely(`${product.name} quantity updated to ${existing.qty}`);
        } else {
            this.items.push({ ...product, qty });
            this.notifier.cart('Added to Cart', `${product.name} added successfully!`);
            this.announcer.urgently(`${product.name} added to cart. Cart now has ${this.items.length} item${this.items.length !== 1 ? 's' : ''}.`);
        }
        this._save();
        this._render();
        this._updateBadge();
    }

    remove(id) {
        const item = this.items.find(i => i.id === id);
        this.items = this.items.filter(i => i.id !== id);
        this._save();
        this._render();
        this._updateBadge();
        if (item) {
            this.notifier.warning('Item Removed', `${item.name} removed from cart`);
            this.announcer.politely(`${item.name} removed from cart`);
        }
    }

    updateQty(id, qty) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;
        if (qty <= 0) { this.remove(id); return; }
        item.qty = Math.min(qty, 99);
        this._save();
        this._render();
        this._updateBadge();
        this.announcer.politely(`${item.name} quantity updated to ${item.qty}`);
    }

    clear() { this.items = []; this._save(); this._render(); this._updateBadge(); }

    get total() { return this.items.reduce((sum, i) => sum + i.price * i.qty, 0); }
    get count() { return this.items.reduce((sum, i) => sum + i.qty, 0); }

    getItems() { return [...this.items]; }

    /* ── Render ── */
    _render() {
        const container = document.getElementById('cart-items');
        const emptyEl = document.getElementById('cart-empty');
        const footerEl = document.getElementById('cart-footer');
        const totalEl = document.getElementById('cart-total-price');
        const drawer = document.getElementById('cart-drawer');
        if (!container) return;

        const isEmpty = this.items.length === 0;
        // Drive visibility via data attribute (toggled by CSS rules below) and inline style
        if (drawer) drawer.setAttribute('data-cart-state', isEmpty ? 'empty' : 'has-items');

        // Explicit inline style as fallback for any specificity conflict
        if (emptyEl) emptyEl.style.setProperty('display', isEmpty ? 'flex' : 'none', 'important');
        if (footerEl) {
            footerEl.style.setProperty('display', isEmpty ? 'none' : 'flex', 'important');
            footerEl.style.flexDirection = 'column';
            if (!isEmpty) footerEl.removeAttribute('hidden');
        }

        if (isEmpty) { container.innerHTML = ''; return; }

        if (totalEl) totalEl.textContent = `₹${this.total.toLocaleString('en-IN')}`;

        container.innerHTML = this.items.map(item => `
      <div class="cart-item" role="listitem" id="cart-item-${item.id}">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" loading="lazy" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
          <div class="cart-item-controls">
            <div class="qty-control" role="group" aria-label="Quantity for ${item.name}">
              <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14"/></svg>
              </button>
              <input type="number" class="qty-input" data-id="${item.id}" value="${item.qty}" min="1" max="99"
                     aria-label="Quantity for ${item.name}" />
              <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">✕</button>
          </div>
        </div>
      </div>
    `).join('');

        // Bind qty/remove events
        container.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (!item) return;
                this.updateQty(id, btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1);
            });
        });
        container.querySelectorAll('.qty-input').forEach(inp => {
            inp.addEventListener('change', () => {
                const id = parseInt(inp.dataset.id);
                this.updateQty(id, parseInt(inp.value) || 1);
            });
        });
        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => this.remove(parseInt(btn.dataset.id)));
        });
    }

    _updateBadge() {
        const badge = document.getElementById('cart-count');
        const cartBtn = document.getElementById('cart-btn');
        const count = this.count;
        if (badge) badge.textContent = count;
        if (cartBtn) cartBtn.setAttribute('aria-label', `Open shopping cart, ${count} item${count !== 1 ? 's' : ''}`);
    }

    /* ── Drawer Open/Close ── */
    open() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        const cartBtn = document.getElementById('cart-btn');
        if (!drawer) return;
        drawer.removeAttribute('aria-hidden');
        drawer.classList.add('open');
        overlay?.classList.add('active');
        cartBtn?.setAttribute('aria-expanded', 'true');
        this.trap = new FocusTrap(drawer);
        this.trap.activate();
        this.announcer.politely(`Cart opened. ${this.count} item${this.count !== 1 ? 's' : ''} in cart.`);
    }

    close() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        const cartBtn = document.getElementById('cart-btn');
        if (!drawer) return;
        drawer.setAttribute('aria-hidden', 'true');
        drawer.classList.remove('open');
        overlay?.classList.remove('active');
        cartBtn?.setAttribute('aria-expanded', 'false');
        this.trap?.deactivate();
        cartBtn?.focus();
        this.announcer.politely('Cart closed');
    }

    toggle() {
        const drawer = document.getElementById('cart-drawer');
        drawer?.getAttribute('aria-hidden') !== 'false' ? this.open() : this.close();
    }

    /* ── Bindings ── */
    _bind() {
        document.getElementById('cart-btn')?.addEventListener('click', () => this.toggle());
        document.getElementById('cart-close')?.addEventListener('click', () => this.close());
        document.getElementById('cart-overlay')?.addEventListener('click', () => this.close());

        document.getElementById('cart-start-shopping')?.addEventListener('click', () => {
            this.close();
            document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
            this.close();
            setTimeout(() => {
                const cs = document.getElementById('checkout-section');
                if (cs) { cs.removeAttribute('hidden'); cs.scrollIntoView({ behavior: 'smooth' }); }
            }, 400);
        });

        // Expose toggle globally for keyboard shortcut
        window.toggleCart = () => this.toggle();
    }
}

window.CartManager = CartManager;
