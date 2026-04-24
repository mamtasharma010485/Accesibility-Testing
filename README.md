# AccessShop — Accessible E-Commerce Website

> A production-ready, **WCAG 2.1 AA** compliant e-commerce storefront designed for **deaf**, **mute**, and **motor-impaired** shoppers. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## ♿ Accessibility Features

### For Deaf Users
- **Zero audio alerts** — all feedback is visual (toast banners, ARIA live regions)
- **Sign Language Guide widget** (ISL) via accessibility toolbar
- **High contrast mode** (black + yellow) for low vision

### For Mute / Non-Verbal Users
- **No voice input required** — all interactions are text-based
- **AAC-friendly** product descriptions
- Text-based inline form validation with clear error guidance

### For Motor-Impaired Users
- **Full keyboard-only navigation** — Tab, arrow keys, Enter, Escape
- **Roving tab-index** on product grid (arrow keys navigate between cards)
- **Skip-to-content links** at top of page (appear on first Tab press)
- **Motor-Friendly Mode** — enlarges all buttons/links to 64px height
- **Focus trap** inside cart drawer and product modal
- **No time-limited interactions** anywhere

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Navigate between elements |
| `↑ ↓ ← →` | Browse product grid |
| `Enter` / `Space` | Activate focused element |
| `Esc` | Close modals, cart, dropdowns |
| `/` | Focus search box |
| `C` | Toggle cart drawer |
| `A` | Open accessibility settings |
| `?` | Open keyboard shortcuts help |

---

## 🗂️ Project Structure

```
Accesibility-Testing/
├── index.html                  # Main HTML shell
├── styles/
│   ├── main.css                # Design system (tokens, components, responsive)
│   └── accessibility.css       # High contrast, dark, font scale, motor mode
└── js/
    ├── accessibility.js        # Toolbar, notifier, keyboard navigator, focus trap
    ├── cart.js                 # Cart with ARIA announcements & focus trap
    ├── checkout.js             # 3-step form with inline ARIA validation
    └── app.js                  # Product catalogue, search, filter, sort, modals
```

---

## 🚀 Running Locally

Simply open `index.html` in your browser — no build step required.

```bash
# Or serve with any static server, e.g.:
npx serve .
```

---

## ✅ WCAG 2.1 AA Compliance

- `:focus-visible` 3px gold outline on all interactive elements
- 48px minimum touch/click targets on all buttons
- `prefers-reduced-motion` honored site-wide
- Semantic HTML5 landmarks (`<main>`, `<nav>`, `<aside>`, `<article>`)
- All images have descriptive `alt` text
- All form fields have `<label>`, `aria-required`, `aria-describedby`
- ARIA live regions for dynamic content (cart, search results, notifications)

---

## 🛍️ Product Catalogue (8 Products)

| Product | Category | Accessibility |
|---|---|---|
| Ergonomic Large-Key Keyboard | Adaptive Tech | Motor, Deaf |
| Vibrating Smart Watch | Adaptive Tech | Deaf, Mute |
| AAC Tablet | Communication | Mute, Deaf |
| Ergonomic Lumbar Chair | Ergonomic | Motor |
| Visual Alert Doorbell | Daily Living | Deaf |
| Vertical Ergonomic Mouse | Ergonomic | Motor |
| Vibrating Wristband Pager | Communication | Deaf |
| Switch Access Control Kit | Adaptive Tech | Motor, Mute |

---

## 📋 License

MIT — Free to use, modify, and distribute.
