'use strict';

/* ══════════════════════════════════════════════
   AccessShop — Main App Orchestrator
   Product catalogue, search, modals, init.
══════════════════════════════════════════════ */

/* ─── Product Catalogue ─── */
const PRODUCTS = [
    {
        id: 1,
        name: 'Ergonomic Large-Key Wireless Keyboard',
        category: 'adaptive-tech',
        categoryLabel: 'Adaptive Tech',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_keyboard_1777004366390.png',
        price: 2499,
        originalPrice: 3499,
        rating: 4.8,
        ratingCount: 312,
        badge: 'sale',
        badgeLabel: 'Sale',
        description: 'Oversized, high-contrast keys with tactile feedback. Ideal for users with motor impairment or low vision. Wireless, ergonomic, plug-and-play with no special drivers needed.',
        features: ['Oversized keys (30% larger)', 'High-contrast printed labels', 'Wireless Bluetooth 5.0', 'One-handed mode support', 'Backlit with adjustable brightness'],
        a11yTags: ['motor', 'deaf'],
    },
    {
        id: 2,
        name: 'Vibrating Smart Watch with Visual Alerts',
        category: 'adaptive-tech',
        categoryLabel: 'Adaptive Tech',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_smartwatch_1777004989460.png',
        price: 4999,
        originalPrice: 6999,
        rating: 4.7,
        ratingCount: 198,
        badge: 'sale',
        badgeLabel: 'Sale',
        description: 'Receives all phone notifications as strong tactile vibration patterns and bright LED flashes. Perfect for deaf and hard-of-hearing users who rely on visual and haptic feedback.',
        features: ['Strong tactile vibration alerts', 'LED flash for calls & messages', 'Large 1.9" high-contrast display', 'Real-time captions on screen', 'Water-resistant IP68'],
        a11yTags: ['deaf', 'mute'],
    },
    {
        id: 3,
        name: 'AAC Tablet — Augmentative Communication',
        category: 'communication',
        categoryLabel: 'Communication',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_tablet_1777005005527.png',
        price: 12999,
        originalPrice: 15999,
        rating: 4.9,
        ratingCount: 87,
        badge: 'new',
        badgeLabel: 'New',
        description: 'Pre-loaded with an Augmentative and Alternative Communication (AAC) app allowing non-verbal users to express needs, emotions, and sentences using picture symbols.',
        features: ['8" high-brightness touchscreen', 'Pre-installed AAC software', 'Symbol-to-speech output', 'Rugged protective case', 'Stylus + switch-access ready'],
        a11yTags: ['mute', 'deaf'],
    },
    {
        id: 4,
        name: 'Ergonomic Lumbar Office Chair',
        category: 'ergonomic',
        categoryLabel: 'Ergonomic',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_chair_1777005034189.png',
        price: 8499,
        originalPrice: 10999,
        rating: 4.6,
        ratingCount: 541,
        badge: 'sale',
        badgeLabel: 'Sale',
        description: 'Full lumbar support, adjustable armrests, headrest, and seat depth. Designed for long-duration use by people with musculoskeletal conditions or physical disabilities.',
        features: ['Adjustable lumbar & headrest', '120° recline with tilt lock', 'Adjustable 3D armrests', 'Breathable mesh back', 'Weight capacity: 120 kg'],
        a11yTags: ['motor'],
    },
    {
        id: 5,
        name: 'Visual Alert Doorbell System',
        category: 'daily-living',
        categoryLabel: 'Daily Living',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/hero_banner_1777004366390.png',
        price: 1899,
        originalPrice: 2499,
        rating: 4.5,
        ratingCount: 223,
        badge: null,
        badgeLabel: null,
        description: 'Doorbell that triggers a bright strobe flash throughout your home instead of a chime — designed for deaf and hard-of-hearing users.',
        features: ['360° LED strobe flash', 'Up to 5 room receivers', 'Adjustable flash intensity', 'No audio required', '30m wireless range'],
        a11yTags: ['deaf'],
    },
    {
        id: 6,
        name: 'One-Handed Ergonomic Vertical Mouse',
        category: 'ergonomic',
        categoryLabel: 'Ergonomic',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_keyboard_1777004366390.png',
        price: 1699,
        originalPrice: 2199,
        rating: 4.4,
        ratingCount: 176,
        badge: 'sale',
        badgeLabel: 'Sale',
        description: 'Vertical ergonomic mouse that reduces wrist strain by 60%. Large programmable buttons ideal for motor-impaired users and those with repetitive strain injuries.',
        features: ['Vertical 57° natural grip', 'Large programmable buttons', 'Wireless 2.4GHz', 'DPI adjustable 400–3200', 'Left & right-hand versions'],
        a11yTags: ['motor'],
    },
    {
        id: 7,
        name: 'Vibrating Wristband Alert Pager',
        category: 'communication',
        categoryLabel: 'Communication',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_smartwatch_1777004989460.png',
        price: 999,
        originalPrice: 1499,
        rating: 4.3,
        ratingCount: 89,
        badge: null,
        badgeLabel: null,
        description: 'Wireless wristband that vibrates when triggered by a companion button. Useful for deaf users to be alerted by family members silently and without visual contact.',
        features: ['Silent vibration alert', '60m wireless range', 'Up to 6 transmitters', 'Long battery life', 'Water-resistant'],
        a11yTags: ['deaf'],
    },
    {
        id: 8,
        name: 'Switch Access Control Kit',
        category: 'adaptive-tech',
        categoryLabel: 'Adaptive Tech',
        img: 'C:/Users/mamta.sharma/.gemini/antigravity/brain/71fe94e8-6373-4ab5-9b45-c4c2c825e5bd/product_tablet_1777005005527.png',
        price: 3299,
        originalPrice: 4500,
        rating: 4.7,
        ratingCount: 62,
        badge: 'new',
        badgeLabel: 'New',
        description: 'Plug-and-play switch access kit enabling computer and tablet control with a single large button. Compatible with all operating systems for users with severe motor impairments.',
        features: ['Single-switch scanning mode', 'Plug-and-play USB & Bluetooth', 'Works with Windows, Mac, iOS, Android', 'Oversized activation button', 'Mounting bracket included'],
        a11yTags: ['motor', 'mute'],
    },
];

/* ─── Rating Stars Helper ─── */
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ─── A11y Tags Helper ─── */
function renderA11yTags(tags) {
    const labels = { deaf: '🤟 Deaf-Friendly', mute: '💬 No Voice', motor: '⌨ Keyboard-OK' };
    return tags.map(t => `<span class="a11y-tag ${t}" aria-label="${labels[t]}">${labels[t]}</span>`).join('');
}

/* ─── Build Product Card HTML ─── */
function buildCard(p) {
    const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    return `
    <article class="product-card" role="listitem" data-id="${p.id}" data-category="${p.category}"
             tabindex="0" aria-label="${p.name}, ₹${p.price.toLocaleString('en-IN')}. ${p.a11yTags.map(t => ({ deaf: 'Deaf friendly', mute: 'No voice required', motor: 'Keyboard accessible' })[t]).join(', ')}">
      <div class="product-img-wrap">
        ${p.badge ? `<span class="product-badge ${p.badge}" aria-label="${p.badgeLabel} item">${p.badgeLabel}</span>` : ''}
        <button class="wishlist-btn-card" data-id="${p.id}" aria-label="Add ${p.name} to wishlist" aria-pressed="false">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-category">${p.categoryLabel}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars" aria-hidden="true">${renderStars(p.rating)}</span>
          <span class="sr-only">Rated ${p.rating} out of 5</span>
          <span class="rating-count">(${p.ratingCount})</span>
        </div>
        <div class="product-price">
          <span class="price-current" aria-label="Price: ₹${p.price.toLocaleString('en-IN')}">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.originalPrice ? `<span class="price-original" aria-label="Original price: ₹${p.originalPrice.toLocaleString('en-IN')}">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          ${discount > 0 ? `<span class="price-discount" aria-label="${discount}% discount">${discount}% off</span>` : ''}
        </div>
      </div>
      <div class="product-a11y-tags" aria-label="Accessibility compatibility">${renderA11yTags(p.a11yTags)}</div>
      <div class="product-actions">
        <button class="btn btn-outline quick-view-btn" data-id="${p.id}" aria-label="Quick view ${p.name}">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </button>
        <button class="btn btn-primary add-cart-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart, price ₹${p.price.toLocaleString('en-IN')}">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Cart
        </button>
      </div>
    </article>
  `;
}

/* ─── Main App Class ─── */
class AccessShopApp {
    constructor() {
        this.announcer = new ScreenReaderAnnouncer();
        this.notifier = new VisualNotifier();
        this.toolbar = new AccessibilityToolbar(this.notifier);
        this.cart = new CartManager(this.notifier, this.announcer);
        this.checkout = new CheckoutManager(this.notifier, this.announcer, () => this.cart);
        this.navigator = new KeyboardNavigator();
        this.wishlist = new Set();

        this._currentFilter = 'all';
        this._currentSort = 'featured';
        this._searchQuery = '';

        this._renderProducts();
        this._bindSearch();
        this._bindFilters();
        this._bindSort();
        this._bindModal();
        this._bindKeyboardHelp();
        this._bindGlobalEscape();

        // Expose globals for keyboard shortcuts in accessibility.js
        window.closeAll = () => this._closeAll();
        window.openKeyboardHelp = () => this._openKbHelp();

        // Welcome announcement for screen readers
        setTimeout(() => {
            this.announcer.politely('AccessShop loaded. Fully accessible e-commerce. Press slash to search, C for cart, A for accessibility settings, question mark for keyboard shortcuts.');
        }, 800);
    }

    /* ── Product Rendering ── */
    _filtered() {
        let list = [...PRODUCTS];
        // Filter
        if (this._currentFilter !== 'all') list = list.filter(p => p.category === this._currentFilter);
        // Search
        if (this._searchQuery) {
            const q = this._searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q));
        }
        // Sort
        switch (this._currentSort) {
            case 'price-asc': list.sort((a, b) => a.price - b.price); break;
            case 'price-desc': list.sort((a, b) => b.price - a.price); break;
            case 'rating': list.sort((a, b) => b.rating - a.rating); break;
            case 'newest': list.sort((a, b) => b.id - a.id); break;
        }
        return list;
    }

    _renderProducts() {
        const container = document.getElementById('products-container');
        const countEl = document.getElementById('results-count');
        if (!container) return;
        const list = this._filtered();

        if (list.length === 0) {
            container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--clr-text-muted)">
          <div style="font-size:3rem;margin-bottom:1rem" aria-hidden="true">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters.</p>
          <button class="btn btn-outline" id="clear-filters-btn" style="margin-top:1rem">Clear Filters</button>
        </div>`;
            document.getElementById('clear-filters-btn')?.addEventListener('click', () => this._clearFilters());
        } else {
            container.innerHTML = list.map(buildCard).join('');
        }

        if (countEl) {
            countEl.innerHTML = `Showing <strong>${list.length}</strong> product${list.length !== 1 ? 's' : ''}`;
            this.announcer.politely(`${list.length} product${list.length !== 1 ? 's' : ''} shown`);
        }

        // Bind card events
        container.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const p = PRODUCTS.find(p => p.id === parseInt(btn.dataset.id));
                if (p) this.cart.add(p, 1);
            });
        });
        container.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const p = PRODUCTS.find(p => p.id === parseInt(btn.dataset.id));
                if (p) this._openModal(p);
            });
        });
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const p = PRODUCTS.find(p => p.id === parseInt(card.dataset.id));
                if (p) this._openModal(p);
            });
            // Enter/Space on article card — directly open modal (articles don't auto-fire click on Enter)
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const p = PRODUCTS.find(q => q.id === parseInt(card.dataset.id));
                    if (p) this._openModal(p);
                }
            });
        });
        container.querySelectorAll('.wishlist-btn-card').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const p = PRODUCTS.find(p => p.id === id);
                if (!p) return;
                if (this.wishlist.has(id)) {
                    this.wishlist.delete(id);
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                    btn.setAttribute('aria-label', `Add ${p.name} to wishlist`);
                    this.notifier.info('Wishlist', `${p.name} removed from wishlist`);
                } else {
                    this.wishlist.add(id);
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    btn.setAttribute('aria-label', `Remove ${p.name} from wishlist`);
                    this.notifier.success('Wishlist', `${p.name} added to wishlist`);
                }
                const wBadge = document.getElementById('wishlist-count');
                const wBtn = document.getElementById('wishlist-btn');
                if (wBadge) wBadge.textContent = this.wishlist.size;
                if (wBtn) wBtn.setAttribute('aria-label', `Wishlist (${this.wishlist.size} items)`);
            });
        });

        // Re-init keyboard navigation after re-render
        this.navigator.init();
    }

    _clearFilters() {
        this._currentFilter = 'all';
        this._currentSort = 'featured';
        this._searchQuery = '';
        document.getElementById('site-search')?.value && (document.getElementById('site-search').value = '');
        document.querySelectorAll('.chip').forEach(c => { c.classList.toggle('active', c.dataset.filter === 'all'); c.setAttribute('aria-pressed', c.dataset.filter === 'all'); });
        this._renderProducts();
    }

    /* ── Search ── */
    _bindSearch() {
        const input = document.getElementById('site-search');
        const dropdown = document.getElementById('search-results-dropdown');
        const btn = document.getElementById('search-btn');
        if (!input) return;

        let debounce;
        input.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const q = input.value.trim();
                if (q.length > 1) this._showSearchDropdown(q, dropdown);
                else { dropdown.setAttribute('hidden', ''); dropdown.setAttribute('aria-expanded', 'false'); }
            }, 200);
        });

        const doSearch = () => {
            const q = input.value.trim();
            this._searchQuery = q;
            dropdown.setAttribute('hidden', '');
            dropdown.setAttribute('aria-expanded', 'false');
            this._renderProducts();
            if (q) document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
        };

        btn?.addEventListener('click', doSearch);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); if (e.key === 'Escape') { dropdown.setAttribute('hidden', ''); input.value = ''; this._searchQuery = ''; this._renderProducts(); } });

        // Close dropdown on outside click
        document.addEventListener('click', e => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.setAttribute('hidden', '');
        });
    }

    _showSearchDropdown(q, dropdown) {
        const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
        if (!results.length) { dropdown.setAttribute('hidden', ''); return; }
        dropdown.innerHTML = results.map(p => `
      <div class="search-result-item" role="option" tabindex="0" data-id="${p.id}"
           aria-label="${p.name}, ₹${p.price.toLocaleString('en-IN')}">
        <img src="${p.img}" alt="" aria-hidden="true" />
        <div>
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `).join('');
        dropdown.removeAttribute('hidden');
        dropdown.setAttribute('aria-expanded', 'true');
        dropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const p = PRODUCTS.find(p => p.id === parseInt(item.dataset.id));
                if (p) { this._openModal(p); dropdown.setAttribute('hidden', ''); }
            });
            item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
        });
    }

    /* ── Filters ── */
    _bindFilters() {
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
                this._currentFilter = chip.dataset.filter;
                this._renderProducts();
            });
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                const map = { 'Adaptive Tech': 'adaptive-tech', 'Ergonomic': 'ergonomic', 'Communication': 'communication', 'Daily Living': 'daily-living' };
                const cat = map[link.textContent.trim()];
                if (cat) {
                    e.preventDefault();
                    this._currentFilter = cat;
                    document.querySelectorAll('.chip').forEach(c => { c.classList.toggle('active', c.dataset.filter === cat); c.setAttribute('aria-pressed', c.dataset.filter === cat); });
                    this._renderProducts();
                    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* ── Sort ── */
    _bindSort() {
        document.getElementById('sort-select')?.addEventListener('change', e => {
            this._currentSort = e.target.value;
            this._renderProducts();
        });
    }

    /* ── Product Modal ── */
    _bindModal() {
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('modal-overlay');
        const closeBtn = document.getElementById('modal-close');
        [closeBtn, overlay].forEach(el => el?.addEventListener('click', () => this._closeModal()));
        window._modalTrap = null;
    }

    _openModal(p) {
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('modal-overlay');
        if (!modal) return;

        // Populate
        document.getElementById('modal-product-img').src = p.img;
        document.getElementById('modal-product-img').alt = p.name;
        document.getElementById('modal-product-category').textContent = p.categoryLabel;
        document.getElementById('modal-product-title').textContent = p.name;
        document.getElementById('modal-product-rating').innerHTML = `<span class="stars" aria-hidden="true">${renderStars(p.rating)}</span><span class="sr-only">${p.rating} out of 5</span><span class="rating-count">(${p.ratingCount} reviews)</span>`;
        document.getElementById('modal-product-desc').textContent = p.description;
        document.getElementById('modal-product-price').textContent = `₹${p.price.toLocaleString('en-IN')}`;
        document.getElementById('modal-product-features').innerHTML = p.features.map(f => `<div class="modal-feature">${f}</div>`).join('');
        document.getElementById('modal-qty').value = 1;

        // Add to cart button
        const addBtn = document.getElementById('modal-add-cart');
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        newBtn.addEventListener('click', () => {
            const qty = parseInt(document.getElementById('modal-qty').value) || 1;
            this.cart.add(p, qty);
            this._closeModal();
        });

        // Qty controls
        document.getElementById('modal-qty-dec')?.addEventListener('click', () => {
            const inp = document.getElementById('modal-qty');
            inp.value = Math.max(1, parseInt(inp.value) - 1);
        });
        document.getElementById('modal-qty-inc')?.addEventListener('click', () => {
            const inp = document.getElementById('modal-qty');
            inp.value = Math.min(99, parseInt(inp.value) + 1);
        });

        // Open
        modal.classList.add('open');
        modal.removeAttribute('aria-hidden');
        overlay.classList.add('active');
        window._modalTrap = new FocusTrap(modal);
        window._modalTrap.activate();
        this.announcer.politely(`Product details opened: ${p.name}. ${p.description}`);
    }

    _closeModal() {
        document.getElementById('product-modal')?.classList.remove('open');
        document.getElementById('product-modal')?.setAttribute('aria-hidden', 'true');
        document.getElementById('modal-overlay')?.classList.remove('active');
        window._modalTrap?.deactivate();
        this.announcer.politely('Product details closed');
    }

    /* ── Keyboard Help Modal ── */
    _bindKeyboardHelp() {
        const modal = document.getElementById('keyboard-help-modal');
        const closeBtn = document.getElementById('kb-modal-close');
        const overlay = document.getElementById('modal-overlay');
        closeBtn?.addEventListener('click', () => this._closeKbHelp());
        window.openKeyboardHelp = () => this._openKbHelp();
    }

    _openKbHelp() {
        const modal = document.getElementById('keyboard-help-modal');
        if (!modal) return;
        modal.classList.add('open');
        modal.removeAttribute('aria-hidden');
        document.getElementById('modal-overlay')?.classList.add('active');
        window._kbTrap = new FocusTrap(modal);
        window._kbTrap.activate();
    }

    _closeKbHelp() {
        const modal = document.getElementById('keyboard-help-modal');
        modal?.classList.remove('open');
        modal?.setAttribute('aria-hidden', 'true');
        document.getElementById('modal-overlay')?.classList.remove('active');
        window._kbTrap?.deactivate();
    }

    /* ── Close Everything (Escape) ── */
    _closeAll() {
        this._closeModal();
        this._closeKbHelp();
        this.cart.close();
        document.getElementById('a11y-controls')?.setAttribute('hidden', '');
        document.getElementById('a11y-panel-toggle')?.setAttribute('aria-expanded', 'false');
        document.getElementById('search-results-dropdown')?.setAttribute('hidden', '');
    }

    _bindGlobalEscape() {
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this._closeAll(); });
    }
}

/* ─── Bootstrap on DOM ready ─── */
document.addEventListener('DOMContentLoaded', () => {
    window.__app = new AccessShopApp();
});
