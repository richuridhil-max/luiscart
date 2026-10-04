/**
 * Luiscart - Application Logic & Reactive Store
 * Handles Cart, Wishlist, Currency, Filters, Search, Modals & Checkout
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = "919746359282";

  // --- STATE ---
  const state = {
    products: [...LUISCART_PRODUCTS],
    filteredProducts: [...LUISCART_PRODUCTS],
    cart: JSON.parse(localStorage.getItem('luiscart_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('luiscart_wishlist') || '[]'),
    currency: localStorage.getItem('luiscart_currency') || 'USD',
    category: 'All',
    priceFilter: 'all',
    ratingFilter: 'all',
    colorFilter: 'all',
    materialFilter: 'all',
    offerFilter: 'all',
    sortBy: 'featured',
    searchQuery: '',
    couponCode: null,
    discountPercent: 0,
    quickViewProduct: null,
    currentCheckoutStep: 1,
    lastOrder: null
  };

  // --- DOM CACHE ---
  const DOM = {
    productGrid: document.getElementById('product-grid'),
    productCount: document.getElementById('product-count'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartItemsList: document.getElementById('cart-items-list'),
    cartCountBadges: document.querySelectorAll('.cart-count-badge'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartTotal: document.getElementById('cart-total'),
    cartDiscountRow: document.getElementById('cart-discount-row'),
    cartDiscountVal: document.getElementById('cart-discount-val'),
    shippingProgress: document.getElementById('shipping-progress'),
    shippingText: document.getElementById('shipping-text'),
    wishlistCountBadges: document.querySelectorAll('.wishlist-count-badge'),
    wishlistModal: document.getElementById('wishlist-modal'),
    wishlistBackdrop: document.getElementById('wishlist-backdrop'),
    wishlistItemsList: document.getElementById('wishlist-items-list'),
    quickViewModal: document.getElementById('quick-view-modal'),
    quickViewBackdrop: document.getElementById('quick-view-backdrop'),
    quickViewContent: document.getElementById('quick-view-content'),
    checkoutModal: document.getElementById('checkout-modal'),
    checkoutBackdrop: document.getElementById('checkout-backdrop'),
    checkoutForm: document.getElementById('checkout-form'),
    orderConfirmationModal: document.getElementById('order-confirmation-modal'),
    orderConfirmationContent: document.getElementById('order-confirmation-content'),
    currencySelectors: document.querySelectorAll('.currency-select'),
    searchInput: document.getElementById('search-input'),
    searchSuggestions: document.getElementById('search-suggestions'),
    toastContainer: document.getElementById('toast-container'),
    activeFilterTags: document.getElementById('active-filter-tags'),
    filterDropdowns: document.querySelectorAll('.filter-dropdown'),
    cartWhatsAppBtn: document.getElementById('cart-whatsapp-btn')
  };

  // --- HELPERS ---
  function formatPrice(amountInUSD) {
    const cur = CURRENCIES[state.currency] || CURRENCIES.USD;
    const converted = amountInUSD * cur.rate;
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const parts = formatted.split('.');
    return {
      symbol: cur.symbol,
      main: parts[0],
      cents: parts[1] || '00',
      fullText: `${cur.symbol}${formatted}`
    };
  }

  function showToast(message, icon = 'check-circle') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-5 h-5 text-[#c5a869]"></i>
      <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function saveState() {
    localStorage.setItem('luiscart_cart', JSON.stringify(state.cart));
    localStorage.setItem('luiscart_wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('luiscart_currency', state.currency);
  }

  // --- WHATSAPP MESSAGING INTEGRATION ---
  function sendWhatsAppOrder(customDetails = null) {
    if (state.cart.length === 0) {
      showToast("Your cart is empty! Add items first.", "alert-circle");
      return;
    }

    const subtotalUSD = state.cart.reduce((sum, item) => {
      const p = state.products.find(prod => prod.id === item.id);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    let discountUSD = subtotalUSD * (state.discountPercent / 100);
    const finalTotal = formatPrice(Math.max(0, subtotalUSD - discountUSD)).fullText;

    const itemsText = state.cart.map(item => {
      const p = state.products.find(prod => prod.id === item.id);
      if (!p) return '';
      const itemPrice = formatPrice(p.price * item.quantity).fullText;
      return `• ${item.quantity}x *${p.name}* (${item.color || p.color}) - ${itemPrice}`;
    }).filter(Boolean).join('\n');

    let message = `🛍️ *NEW ORDER - LUISCART PREMIUM*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customDetails) {
      if (customDetails.orderId) message += `🔖 *Order ID:* ${customDetails.orderId}\n`;
      message += `👤 *Client Name:* ${customDetails.name || 'Valued Client'}\n`;
      if (customDetails.phone) message += `📞 *Phone:* ${customDetails.phone}\n`;
      message += `📍 *Delivery Address:* ${customDetails.address}, ${customDetails.city} - ${customDetails.zip}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    }
    message += `📦 *Order Items:*\n${itemsText}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (state.discountPercent > 0) {
      message += `🏷️ *VIP Discount (${state.discountPercent}%):* -${formatPrice(discountUSD).fullText}\n`;
    }
    message += `💰 *Grand Total:* *${finalTotal}*\n`;
    message += `🚚 *Delivery:* Express Insured Courier\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Hello Luiscart, please confirm my order and share dispatch details. Thank you!`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    showToast("Connecting to WhatsApp concierge...", "message-circle");
  }

  function sendWhatsAppSingleProduct(productId, qty = 1, color = null) {
    const p = state.products.find(prod => prod.id === productId);
    if (!p) return;
    const itemTotal = formatPrice(p.price * qty).fullText;

    let message = `🛍️ *LUISCART LUXURY INQUIRY / ORDER*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Product:* ${p.name}\n`;
    message += `*Quantity:* ${qty}\n`;
    message += `*Variant/Color:* ${color || p.color}\n`;
    message += `*Price:* ${itemTotal}\n`;
    message += `*Category:* ${p.category}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Hello Luiscart (+91 9746359282), I would like to order this item. Please confirm availability and delivery.`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    showToast("Connecting to WhatsApp...", "message-circle");
  }

  // --- FILTERING & SORTING ---
  function applyFilters() {
    let list = [...state.products];

    // Search
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }

    // Category
    if (state.category !== 'All') {
      list = list.filter(p => p.category === state.category);
    }

    // Price
    if (state.priceFilter !== 'all') {
      if (state.priceFilter === 'under-100') list = list.filter(p => p.price < 100);
      else if (state.priceFilter === '100-300') list = list.filter(p => p.price >= 100 && p.price <= 300);
      else if (state.priceFilter === '300-600') list = list.filter(p => p.price > 300 && p.price <= 600);
      else if (state.priceFilter === 'over-600') list = list.filter(p => p.price > 600);
    }

    // Rating
    if (state.ratingFilter !== 'all') {
      const minRating = parseFloat(state.ratingFilter);
      list = list.filter(p => p.rating >= minRating);
    }

    // Color
    if (state.colorFilter !== 'all') {
      list = list.filter(p => p.color.toLowerCase().includes(state.colorFilter.toLowerCase()));
    }

    // Material
    if (state.materialFilter !== 'all') {
      list = list.filter(p => p.material.toLowerCase().includes(state.materialFilter.toLowerCase()));
    }

    // Offer
    if (state.offerFilter !== 'all') {
      list = list.filter(p => p.offer.toLowerCase() === state.offerFilter.toLowerCase());
    }

    // Sorting
    if (state.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    state.filteredProducts = list;
    renderProducts();
    renderActiveFilterBadges();
  }

  function renderActiveFilterBadges() {
    if (!DOM.activeFilterTags) return;
    const tags = [];
    if (state.category !== 'All') tags.push({ label: `Category: ${state.category}`, reset: () => state.category = 'All' });
    if (state.priceFilter !== 'all') tags.push({ label: `Price: ${state.priceFilter}`, reset: () => state.priceFilter = 'all' });
    if (state.ratingFilter !== 'all') tags.push({ label: `Rating: ${state.ratingFilter}★+`, reset: () => state.ratingFilter = 'all' });
    if (state.colorFilter !== 'all') tags.push({ label: `Color: ${state.colorFilter}`, reset: () => state.colorFilter = 'all' });
    if (state.materialFilter !== 'all') tags.push({ label: `Material: ${state.materialFilter}`, reset: () => state.materialFilter = 'all' });
    if (state.offerFilter !== 'all') tags.push({ label: `Offer: ${state.offerFilter}`, reset: () => state.offerFilter = 'all' });
    if (state.searchQuery) tags.push({ label: `Search: "${state.searchQuery}"`, reset: () => { state.searchQuery = ''; if (DOM.searchInput) DOM.searchInput.value = ''; } });

    if (tags.length === 0) {
      DOM.activeFilterTags.innerHTML = '';
      return;
    }

    DOM.activeFilterTags.innerHTML = `
      <div class="flex items-center flex-wrap gap-2 pt-3 pb-1">
        <span class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Filters:</span>
        ${tags.map((t, idx) => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium">
            ${t.label}
            <button class="hover:text-red-500 reset-tag-btn" data-idx="${idx}">&times;</button>
          </span>
        `).join('')}
        <button id="clear-all-filters-btn" class="text-xs text-gray-500 hover:text-emerald-800 underline font-medium ml-2">Clear All</button>
      </div>
    `;

    DOM.activeFilterTags.querySelectorAll('.reset-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        tags[idx].reset();
        applyFilters();
      });
    });

    const clearAll = document.getElementById('clear-all-filters-btn');
    if (clearAll) {
      clearAll.addEventListener('click', () => {
        state.category = 'All';
        state.priceFilter = 'all';
        state.ratingFilter = 'all';
        state.colorFilter = 'all';
        state.materialFilter = 'all';
        state.offerFilter = 'all';
        state.searchQuery = '';
        if (DOM.searchInput) DOM.searchInput.value = '';
        applyFilters();
      });
    }
  }

  // --- RENDER PRODUCTS GRID (Reference layout) ---
  function renderProducts() {
    if (!DOM.productGrid) return;
    if (DOM.productCount) {
      DOM.productCount.textContent = `(${state.filteredProducts.length} items found)`;
    }

    if (state.filteredProducts.length === 0) {
      DOM.productGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center mb-4">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-1">No matching items found</h3>
          <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">We couldn't find any products matching your current filters. Try resetting your search or filter criteria.</p>
          <button id="empty-reset-filters" class="px-6 py-2.5 rounded-full bg-[#0c3a35] text-white text-sm font-semibold hover:bg-emerald-950 transition-colors">
            Reset All Filters
          </button>
        </div>
      `;
      lucide.createIcons();
      const emptyReset = document.getElementById('empty-reset-filters');
      if (emptyReset) {
        emptyReset.addEventListener('click', () => {
          state.category = 'All';
          state.priceFilter = 'all';
          state.ratingFilter = 'all';
          state.colorFilter = 'all';
          state.materialFilter = 'all';
          state.offerFilter = 'all';
          state.searchQuery = '';
          if (DOM.searchInput) DOM.searchInput.value = '';
          applyFilters();
        });
      }
      return;
    }

    DOM.productGrid.innerHTML = state.filteredProducts.map(product => {
      const price = formatPrice(product.price);
      const isWishlisted = state.wishlist.includes(product.id);
      const inCart = state.cart.some(item => item.id === product.id);

      return `
        <div class="product-card rounded-2xl flex flex-col group cursor-pointer" data-id="${product.id}">
          <!-- Product Image Container -->
          <div class="product-image-container aspect-square p-6 relative">
            ${product.offer ? `
              <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                product.offer.includes('50%') 
                  ? 'bg-red-500 text-white' 
                  : 'bg-[#0c3a35] text-white'
              }">
                ${product.offer}
              </span>
            ` : ''}

            <!-- Floating Wishlist Heart -->
            <button 
              class="btn-wishlist ${isWishlisted ? 'active' : ''} absolute top-3 right-3 z-10" 
              title="Add to Wishlist"
              data-wishlist-id="${product.id}"
            >
              <i data-lucide="heart" class="w-4 h-4"></i>
            </button>

            <!-- Product Photo -->
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy"
              class="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Product Meta & Actions (Exact reference layout) -->
          <div class="pt-4 pb-2 px-1 flex flex-col flex-grow justify-between">
            <div>
              <!-- Title & Price Row -->
              <div class="flex items-baseline justify-between gap-2 mb-1">
                <h3 class="font-bold text-gray-900 text-base leading-tight group-hover:text-[#0c3a35] transition-colors truncate">
                  ${product.name}
                </h3>
                <div class="price-display shrink-0">
                  <span class="currency font-bold text-gray-900 text-sm">${price.symbol}</span>
                  <span class="font-bold text-gray-900 text-base">${price.main}</span>
                  <span class="cents font-bold text-gray-900">${price.cents}</span>
                </div>
              </div>

              <!-- Subtitle Description (Reference exact 1-line feature) -->
              <p class="text-xs text-gray-500 font-normal line-clamp-1 mb-2">
                ${product.subtitle}
              </p>

              <!-- Star Rating & Review Count -->
              <div class="flex items-center gap-1.5 mb-4">
                <div class="flex items-center text-emerald-800">
                  ${Array(5).fill(0).map((_, i) => `
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  `).join('')}
                </div>
                <span class="text-xs text-gray-500 font-medium">(${product.reviewsCount})</span>
              </div>
            </div>

            <!-- Pill Add to Cart Button (Reference layout) -->
            <div>
              <button 
                class="btn-cart-pill ${inCart ? 'btn-cart-pill-filled' : 'btn-cart-pill-outline'} w-auto add-to-cart-btn" 
                data-product-id="${product.id}"
              >
                ${inCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
    attachProductCardEvents();
  }

  function attachProductCardEvents() {
    // Card Click -> Quick View
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent opening if clicked on wishlist or cart button
        if (e.target.closest('.btn-wishlist') || e.target.closest('.add-to-cart-btn')) {
          return;
        }
        const pid = card.dataset.id;
        openQuickView(pid);
      });
    });

    // Wishlist Button Click
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.wishlistId;
        toggleWishlist(pid);
      });
    });

    // Add To Cart Button Click
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.productId;
        addToCart(pid);
      });
    });
  }

  // --- CART FUNCTIONS ---
  function addToCart(productId, quantity = 1, options = {}) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(i => i.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: productId,
        quantity: quantity,
        color: options.color || product.color,
        addedAt: Date.now()
      });
    }

    saveState();
    updateCartUI();
    renderProducts();
    openCartDrawer();
    showToast(`Added "${product.name}" to your cart.`);
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveState();
    updateCartUI();
    renderProducts();
    showToast("Item removed from cart.", "trash-2");
  }

  function updateCartQuantity(productId, newQty) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQty;
      saveState();
      updateCartUI();
    }
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update badges
    DOM.cartCountBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.classList.toggle('hidden', totalItems === 0);
    });

    // Render cart items inside drawer
    if (state.cart.length === 0) {
      DOM.cartItemsList.innerHTML = `
        <div class="py-16 text-center text-gray-500">
          <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-3"></i>
          <p class="font-semibold text-gray-700 text-lg">Your cart is empty</p>
          <p class="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Explore our curated collections and grab up to 50% off select audio & luxury goods.</p>
          <button id="drawer-continue-shopping" class="mt-6 px-6 py-2.5 rounded-full bg-[#0c3a35] text-white text-sm font-semibold hover:bg-emerald-950 transition-colors">
            Start Shopping
          </button>
        </div>
      `;
      const contBtn = document.getElementById('drawer-continue-shopping');
      if (contBtn) contBtn.addEventListener('click', closeCartDrawer);
    } else {
      DOM.cartItemsList.innerHTML = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.id);
        if (!product) return '';
        const itemPrice = formatPrice(product.price * item.quantity);

        return `
          <div class="flex items-center gap-4 py-4 border-b border-gray-100">
            <div class="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden p-2 flex items-center justify-center shrink-0">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="font-semibold text-gray-900 text-sm truncate">${product.name}</h4>
              <p class="text-xs text-gray-400 mb-2">${item.color || product.color}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 qty-minus-btn" data-id="${item.id}">-</button>
                  <span class="w-8 text-center text-xs font-semibold">${item.quantity}</span>
                  <button class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 qty-plus-btn" data-id="${item.id}">+</button>
                </div>
                <div class="font-bold text-gray-900 text-sm">
                  ${itemPrice.fullText}
                </div>
              </div>
            </div>
            <button class="text-gray-400 hover:text-red-500 transition-colors p-1 remove-cart-item-btn" data-id="${item.id}" title="Remove">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `;
      }).join('');

      // Attach drawer controls
      DOM.cartItemsList.querySelectorAll('.qty-minus-btn').forEach(b => {
        b.addEventListener('click', () => {
          const item = state.cart.find(i => i.id === b.dataset.id);
          if (item) updateCartQuantity(item.id, item.quantity - 1);
        });
      });
      DOM.cartItemsList.querySelectorAll('.qty-plus-btn').forEach(b => {
        b.addEventListener('click', () => {
          const item = state.cart.find(i => i.id === b.dataset.id);
          if (item) updateCartQuantity(item.id, item.quantity + 1);
        });
      });
      DOM.cartItemsList.querySelectorAll('.remove-cart-item-btn').forEach(b => {
        b.addEventListener('click', () => removeFromCart(b.dataset.id));
      });
    }

    // Calculations
    const subtotalUSD = state.cart.reduce((sum, item) => {
      const p = state.products.find(prod => prod.id === item.id);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    let discountUSD = subtotalUSD * (state.discountPercent / 100);
    const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

    if (DOM.cartSubtotal) DOM.cartSubtotal.textContent = formatPrice(subtotalUSD).fullText;
    if (DOM.cartTotal) DOM.cartTotal.textContent = formatPrice(finalTotalUSD).fullText;

    // Free shipping threshold ($150)
    const freeShippingThreshold = 150;
    const shippingProgressPct = Math.min(100, (subtotalUSD / freeShippingThreshold) * 100);
    if (DOM.shippingProgress) DOM.shippingProgress.style.width = `${shippingProgressPct}%`;
    if (DOM.shippingText) {
      if (subtotalUSD >= freeShippingThreshold) {
        DOM.shippingText.innerHTML = `<span class="text-emerald-700 font-semibold">🎉 You have unlocked Free Insured Express Delivery!</span>`;
      } else {
        const remaining = formatPrice(freeShippingThreshold - subtotalUSD).fullText;
        DOM.shippingText.textContent = `Add ${remaining} more to unlock Complimentary Express Shipping`;
      }
    }

    // Discount row
    if (DOM.cartDiscountRow) {
      if (state.discountPercent > 0) {
        DOM.cartDiscountRow.classList.remove('hidden');
        if (DOM.cartDiscountVal) {
          DOM.cartDiscountVal.textContent = `-${formatPrice(discountUSD).fullText} (${state.discountPercent}%)`;
        }
      } else {
        DOM.cartDiscountRow.classList.add('hidden');
      }
    }

    lucide.createIcons();
  }

  function openCartDrawer() {
    DOM.cartDrawer.classList.add('open');
    DOM.cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- WISHLIST FUNCTIONS ---
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const product = state.products.find(p => p.id === productId);

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`Removed "${product.name}" from wishlist.`);
    } else {
      state.wishlist.push(productId);
      showToast(`Saved "${product.name}" to wishlist.`, 'heart');
    }

    saveState();
    updateWishlistUI();
    renderProducts();
  }

  function updateWishlistUI() {
    const count = state.wishlist.length;
    DOM.wishlistCountBadges.forEach(b => {
      b.textContent = count;
      b.classList.toggle('hidden', count === 0);
    });

    if (!DOM.wishlistItemsList) return;
    if (count === 0) {
      DOM.wishlistItemsList.innerHTML = `
        <div class="py-12 text-center text-gray-500">
          <i data-lucide="heart" class="w-12 h-12 text-gray-300 mx-auto mb-2"></i>
          <p class="font-semibold text-gray-700">Your wishlist is empty</p>
          <p class="text-xs text-gray-400 mt-1">Tap the heart icon on any product card to curate your private favorites.</p>
        </div>
      `;
    } else {
      DOM.wishlistItemsList.innerHTML = state.wishlist.map(id => {
        const product = state.products.find(p => p.id === id);
        if (!product) return '';
        const price = formatPrice(product.price);

        return `
          <div class="flex items-center gap-4 py-3 border-b border-gray-100">
            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1.5" />
            <div class="flex-grow min-w-0">
              <h4 class="font-semibold text-sm text-gray-900 truncate">${product.name}</h4>
              <p class="text-xs text-gray-400">${product.category}</p>
              <p class="font-bold text-sm text-emerald-900 mt-1">${price.fullText}</p>
            </div>
            <div class="flex flex-col gap-2">
              <button class="px-3 py-1 bg-[#0c3a35] text-white text-xs font-semibold rounded-full hover:bg-emerald-950 wishlist-add-cart-btn" data-id="${product.id}">
                Add to Cart
              </button>
              <button class="text-xs text-red-500 hover:underline wishlist-remove-btn" data-id="${product.id}">
                Remove
              </button>
            </div>
          </div>
        `;
      }).join('');

      DOM.wishlistItemsList.querySelectorAll('.wishlist-add-cart-btn').forEach(b => {
        b.addEventListener('click', () => {
          addToCart(b.dataset.id);
          closeWishlistModal();
        });
      });
      DOM.wishlistItemsList.querySelectorAll('.wishlist-remove-btn').forEach(b => {
        b.addEventListener('click', () => toggleWishlist(b.dataset.id));
      });
    }

    lucide.createIcons();
  }

  function openWishlistModal() {
    updateWishlistUI();
    DOM.wishlistModal.classList.remove('hidden');
    DOM.wishlistBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlistModal() {
    DOM.wishlistModal.classList.add('hidden');
    DOM.wishlistBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- QUICK VIEW MODAL ---
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    state.quickViewProduct = product;

    const price = formatPrice(product.price);
    const origPrice = product.originalPrice ? formatPrice(product.originalPrice) : null;
    const isWishlisted = state.wishlist.includes(product.id);

    DOM.quickViewContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Gallery -->
        <div>
          <div class="aspect-square bg-gray-100 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
            <img id="qv-main-image" src="${product.image}" alt="${product.name}" class="w-full h-full object-contain mix-blend-multiply" />
            ${product.offer ? `
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c3a35] text-white">
                ${product.offer}
              </span>
            ` : ''}
          </div>
          ${product.thumbnails && product.thumbnails.length > 1 ? `
            <div class="flex gap-3 mt-4">
              ${product.thumbnails.map((thumb, idx) => `
                <button class="w-16 h-16 rounded-xl border-2 ${idx === 0 ? 'border-[#0c3a35]' : 'border-transparent'} overflow-hidden p-1 bg-gray-50 qv-thumb-btn" data-src="${thumb}">
                  <img src="${thumb}" class="w-full h-full object-contain mix-blend-multiply" />
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Details -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
              <span>${product.category}</span>
              <span class="text-emerald-700 flex items-center gap-1 font-bold">
                <i data-lucide="shield-check" class="w-4 h-4"></i> Authenticity Verified
              </span>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-2 leading-tight">${product.name}</h2>
            <p class="text-sm text-gray-500 mb-4">${product.subtitle}</p>

            <!-- Price -->
            <div class="flex items-baseline gap-3 mb-4">
              <span class="text-3xl font-extrabold text-gray-900">${price.fullText}</span>
              ${origPrice ? `
                <span class="text-lg text-gray-400 line-through">${origPrice.fullText}</span>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">SAVE ${(100 - (product.price / product.originalPrice * 100)).toFixed(0)}%</span>
              ` : ''}
            </div>

            <!-- Ratings -->
            <div class="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100">
              <div class="flex text-emerald-800">
                ${Array(5).fill(0).map(() => `
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                `).join('')}
              </div>
              <span class="text-sm font-semibold text-gray-700">${product.rating.toFixed(1)}</span>
              <span class="text-xs text-gray-400">(${product.reviewsCount} customer reviews)</span>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 leading-relaxed mb-6">${product.description}</p>

            <!-- Specs Grid -->
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 class="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Craftsmanship & Specifications</h4>
              <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                ${Object.entries(product.specs || {}).map(([key, val]) => `
                  <div>
                    <span class="text-gray-400 block">${key}</span>
                    <span class="font-semibold text-gray-800">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Add to Cart, WhatsApp & Wishlist Actions -->
          <div class="space-y-3 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-3">
              <div class="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button id="qv-qty-minus" class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">-</button>
                <span id="qv-qty-val" class="w-10 text-center text-sm font-semibold">1</span>
                <button id="qv-qty-plus" class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">+</button>
              </div>

              <button id="qv-add-cart-btn" class="flex-grow py-3 px-4 rounded-full bg-[#0c3a35] hover:bg-emerald-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                Add To Cart
              </button>

              <button id="qv-wishlist-btn" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shrink-0">
                <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}"></i>
              </button>
            </div>

            <!-- Instant WhatsApp Order Button -->
            <button id="qv-whatsapp-btn" class="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Direct WhatsApp Order (+91 9746359282)
            </button>
          </div>
        </div>
      </div>
    `;

    DOM.quickViewModal.classList.remove('hidden');
    DOM.quickViewBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();

    // Thumbnails Switcher
    const mainImg = document.getElementById('qv-main-image');
    document.querySelectorAll('.qv-thumb-btn').forEach(tb => {
      tb.addEventListener('click', () => {
        document.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.replace('border-[#0c3a35]', 'border-transparent'));
        tb.classList.replace('border-transparent', 'border-[#0c3a35]');
        if (mainImg) mainImg.src = tb.dataset.src;
      });
    });

    // Quantity Stepper
    let qty = 1;
    const qtyVal = document.getElementById('qv-qty-val');
    document.getElementById('qv-qty-minus').addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
      }
    });
    document.getElementById('qv-qty-plus').addEventListener('click', () => {
      qty++;
      qtyVal.textContent = qty;
    });

    // Add to cart from modal
    document.getElementById('qv-add-cart-btn').addEventListener('click', () => {
      addToCart(product.id, qty);
      closeQuickView();
    });

    // WhatsApp order from modal
    const qvWhatsAppBtn = document.getElementById('qv-whatsapp-btn');
    if (qvWhatsAppBtn) {
      qvWhatsAppBtn.addEventListener('click', () => {
        sendWhatsAppSingleProduct(product.id, qty);
      });
    }

    // Wishlist toggle from modal
    document.getElementById('qv-wishlist-btn').addEventListener('click', () => {
      toggleWishlist(product.id);
      openQuickView(product.id);
    });
  }

  function closeQuickView() {
    DOM.quickViewModal.classList.add('hidden');
    DOM.quickViewBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- CHECKOUT & ORDER FLOW ---
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast("Your cart is empty! Add items first.", "alert-circle");
      return;
    }
    closeCartDrawer();
    state.currentCheckoutStep = 1;
    renderCheckoutStep();
    DOM.checkoutModal.classList.remove('hidden');
    DOM.checkoutBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    DOM.checkoutModal.classList.add('hidden');
    DOM.checkoutBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCheckoutStep() {
    const subtotalUSD = state.cart.reduce((sum, item) => {
      const p = state.products.find(prod => prod.id === item.id);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    const discountUSD = subtotalUSD * (state.discountPercent / 100);
    const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

    const step1El = document.getElementById('checkout-step-1');
    const step2El = document.getElementById('checkout-step-2');
    const checkoutTotalSummary = document.getElementById('checkout-total-summary');

    if (checkoutTotalSummary) {
      checkoutTotalSummary.textContent = formatPrice(finalTotalUSD).fullText;
    }

    if (state.currentCheckoutStep === 1) {
      step1El.classList.remove('hidden');
      step2El.classList.add('hidden');
    } else {
      step1El.classList.add('hidden');
      step2El.classList.remove('hidden');
    }
    lucide.createIcons();
  }

  function completeOrder(formData) {
    const orderId = 'LC-' + Math.floor(100000 + Math.random() * 900000);
    const subtotalUSD = state.cart.reduce((sum, item) => {
      const p = state.products.find(prod => prod.id === item.id);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    const discountUSD = subtotalUSD * (state.discountPercent / 100);
    const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

    state.lastOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      customer: formData.name || 'Valued Client',
      email: formData.email || 'client@luiscart.com',
      phone: formData.phone || '',
      address: `${formData.address || '100 Luxury Avenue'}, ${formData.city || 'Beverly Hills'}, ${formData.zip || '90210'}`,
      items: [...state.cart],
      total: formatPrice(finalTotalUSD).fullText,
      paymentMethod: formData.paymentMethod || 'Credit Card'
    };

    // If customer selected WhatsApp Order, launch WhatsApp with order summary
    if (formData.paymentMethod === 'WhatsApp Order') {
      sendWhatsAppOrder({
        orderId: orderId,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip: formData.zip
      });
    }

    // Clear cart
    state.cart = [];
    state.couponCode = null;
    state.discountPercent = 0;
    saveState();
    updateCartUI();
    renderProducts();
    closeCheckout();

    // Show Confirmation
    openOrderConfirmation();
  }

  function openOrderConfirmation() {
    if (!state.lastOrder) return;
    const order = state.lastOrder;

    DOM.orderConfirmationContent.innerHTML = `
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-[#0c3a35] flex items-center justify-center mx-auto mb-3">
          <i data-lucide="check" class="w-8 h-8 stroke-[3]"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">Thank You For Your Order</h3>
        <p class="text-xs text-gray-500 mt-1">Order <strong>${order.orderId}</strong> placed successfully. Confirmation sent to <strong>${order.email}</strong></p>
      </div>

      <!-- Receipt Card -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6 font-mono text-xs">
        <div class="flex justify-between items-center pb-3 border-b border-gray-200">
          <div>
            <span class="text-gray-400 block">ORDER REFERENCE</span>
            <span class="font-bold text-gray-900 text-sm">${order.orderId}</span>
          </div>
          <div class="text-right">
            <span class="text-gray-400 block">DATE</span>
            <span class="font-bold text-gray-900">${order.date}</span>
          </div>
        </div>

        <div class="py-3 border-b border-gray-200">
          <span class="text-gray-400 block mb-1">CLIENT & SHIPPING DETAILS</span>
          <p class="text-gray-800 font-sans font-medium">${order.customer} ${order.phone ? `(${order.phone})` : ''}</p>
          <p class="text-gray-600 font-sans">${order.address}</p>
          <p class="text-gray-500 font-sans mt-1 text-[11px]">Payment: <strong class="text-brand-emerald">${order.paymentMethod}</strong></p>
        </div>

        <div class="py-3 border-b border-gray-200">
          <span class="text-gray-400 block mb-2">CURATED ITEMS</span>
          ${order.items.map(item => {
            const p = state.products.find(prod => prod.id === item.id);
            if (!p) return '';
            return `
              <div class="flex justify-between py-1 font-sans text-xs">
                <span>${item.quantity}x ${p.name}</span>
                <span class="font-semibold">${formatPrice(p.price * item.quantity).fullText}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pt-3 flex justify-between items-center text-sm font-sans font-bold text-gray-900">
          <span>Total:</span>
          <span class="text-base text-emerald-900">${order.total}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a 
          href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello Luiscart (+91 9746359282), I placed order ' + order.orderId + ' for total ' + order.total + '. Please confirm dispatch.')}" 
          target="_blank"
          class="flex-1 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Chat on WhatsApp
        </a>
        <button onclick="window.print()" class="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 flex items-center justify-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i> Print Receipt
        </button>
        <button id="close-confirmation-btn" class="flex-1 py-3 rounded-full bg-[#0c3a35] text-white font-semibold text-xs hover:bg-emerald-950">
          Continue
        </button>
      </div>
    `;

    DOM.orderConfirmationModal.classList.remove('hidden');
    DOM.cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();

    document.getElementById('close-confirmation-btn').addEventListener('click', () => {
      DOM.orderConfirmationModal.classList.add('hidden');
      DOM.cartBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // --- SEARCH & AUTOCOMPLETE ---
  function initSearch() {
    if (!DOM.searchInput) return;

    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();

      // Show quick suggestions dropdown
      if (state.searchQuery.trim().length > 1) {
        const matches = state.products.filter(p => 
          p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(state.searchQuery.toLowerCase())
        ).slice(0, 4);

        if (matches.length > 0 && DOM.searchSuggestions) {
          DOM.searchSuggestions.innerHTML = matches.map(m => `
            <div class="flex items-center gap-3 p-2.5 hover:bg-gray-50 cursor-pointer rounded-lg search-suggest-item" data-id="${m.id}">
              <img src="${m.image}" class="w-9 h-9 object-contain bg-gray-100 rounded p-1" />
              <div class="min-w-0 flex-grow">
                <p class="text-xs font-semibold text-gray-900 truncate">${m.name}</p>
                <p class="text-[10px] text-gray-400">${m.category} • ${formatPrice(m.price).fullText}</p>
              </div>
            </div>
          `).join('');
          DOM.searchSuggestions.classList.remove('hidden');

          DOM.searchSuggestions.querySelectorAll('.search-suggest-item').forEach(item => {
            item.addEventListener('click', () => {
              openQuickView(item.dataset.id);
              DOM.searchSuggestions.classList.add('hidden');
            });
          });
        }
      } else if (DOM.searchSuggestions) {
        DOM.searchSuggestions.classList.add('hidden');
      }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (DOM.searchSuggestions && !DOM.searchInput.contains(e.target) && !DOM.searchSuggestions.contains(e.target)) {
        DOM.searchSuggestions.classList.add('hidden');
      }
    });
  }

  // --- SETUP EVENT LISTENERS ---
  function setupEvents() {
    // Currency Switcher
    DOM.currencySelectors.forEach(select => {
      select.value = state.currency;
      select.addEventListener('change', (e) => {
        state.currency = e.target.value;
        saveState();
        renderProducts();
        updateCartUI();
        updateWishlistUI();
        showToast(`Currency changed to ${state.currency}.`);
      });
    });

    // Cart Drawer Triggers
    document.querySelectorAll('.open-cart-trigger').forEach(btn => {
      btn.addEventListener('click', openCartDrawer);
    });
    document.querySelectorAll('.close-cart-trigger').forEach(btn => {
      btn.addEventListener('click', closeCartDrawer);
    });
    if (DOM.cartBackdrop) {
      DOM.cartBackdrop.addEventListener('click', closeCartDrawer);
    }

    // Wishlist Modal Triggers
    document.querySelectorAll('.open-wishlist-trigger').forEach(btn => {
      btn.addEventListener('click', openWishlistModal);
    });
    document.querySelectorAll('.close-wishlist-trigger').forEach(btn => {
      btn.addEventListener('click', closeWishlistModal);
    });
    if (DOM.wishlistBackdrop) {
      DOM.wishlistBackdrop.addEventListener('click', closeWishlistModal);
    }

    // Quick View Modal Triggers
    document.querySelectorAll('.close-quick-view-trigger').forEach(btn => {
      btn.addEventListener('click', closeQuickView);
    });
    if (DOM.quickViewBackdrop) {
      DOM.quickViewBackdrop.addEventListener('click', closeQuickView);
    }

    // Checkout Modal Triggers
    document.querySelectorAll('.open-checkout-trigger').forEach(btn => {
      btn.addEventListener('click', openCheckout);
    });
    document.querySelectorAll('.close-checkout-trigger').forEach(btn => {
      btn.addEventListener('click', closeCheckout);
    });
    if (DOM.checkoutBackdrop) {
      DOM.checkoutBackdrop.addEventListener('click', closeCheckout);
    }

    // Checkout Step Navigation
    const nextToStep2 = document.getElementById('checkout-next-to-payment');
    if (nextToStep2) {
      nextToStep2.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('checkout-name')?.value;
        const email = document.getElementById('checkout-email')?.value;
        const address = document.getElementById('checkout-address')?.value;
        if (!name || !email || !address) {
          showToast("Please fill in your shipping details", "alert-circle");
          return;
        }
        state.currentCheckoutStep = 2;
        renderCheckoutStep();
      });
    }

    const backToStep1 = document.getElementById('checkout-back-to-shipping');
    if (backToStep1) {
      backToStep1.addEventListener('click', (e) => {
        e.preventDefault();
        state.currentCheckoutStep = 1;
        renderCheckoutStep();
      });
    }

    // Cart Drawer WhatsApp Order Trigger
    const cartWhatsAppBtn = document.getElementById('cart-whatsapp-btn');
    if (cartWhatsAppBtn) {
      cartWhatsAppBtn.addEventListener('click', () => {
        sendWhatsAppOrder();
      });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          name: document.getElementById('checkout-name')?.value,
          email: document.getElementById('checkout-email')?.value,
          phone: document.getElementById('checkout-phone')?.value,
          address: document.getElementById('checkout-address')?.value,
          city: document.getElementById('checkout-city')?.value,
          zip: document.getElementById('checkout-zip')?.value,
          paymentMethod: document.querySelector('input[name="payment_method"]:checked')?.value || 'WhatsApp Order'
        };
        completeOrder(formData);
      });
    }

    // Coupon Code Application
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'LUIS50') {
          state.couponCode = code;
          state.discountPercent = 50;
          updateCartUI();
          showToast("Promo code applied: 50% OFF unlocked! 🎉");
        } else if (code === 'VIP10') {
          state.couponCode = code;
          state.discountPercent = 10;
          updateCartUI();
          showToast("VIP code applied: 10% discount added.");
        } else {
          showToast("Invalid code. Try 'LUIS50' for 50% off!", "alert-circle");
        }
      });
    }

    // Filter Pills Dropdown triggers & options
    DOM.filterDropdowns.forEach(dropdown => {
      const toggleBtn = dropdown.querySelector('.filter-toggle-btn');
      const menu = dropdown.querySelector('.filter-menu');

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other menus
        DOM.filterDropdowns.forEach(other => {
          if (other !== dropdown) {
            other.querySelector('.filter-menu')?.classList.add('hidden');
          }
        });
        menu.classList.toggle('hidden');
      });

      // Selection within menu
      menu.querySelectorAll('[data-filter-val]').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const type = dropdown.dataset.filterType;
          const val = opt.dataset.filterVal;

          if (type === 'category') state.category = val;
          else if (type === 'price') state.priceFilter = val;
          else if (type === 'rating') state.ratingFilter = val;
          else if (type === 'color') state.colorFilter = val;
          else if (type === 'material') state.materialFilter = val;
          else if (type === 'offer') state.offerFilter = val;
          else if (type === 'sort') state.sortBy = val;

          // Update active styling on button
          if (val === 'all' || val === 'featured') {
            toggleBtn.classList.remove('active');
          } else {
            toggleBtn.classList.add('active');
          }

          menu.classList.add('hidden');
          applyFilters();
        });
      });
    });

    // Close any open filter menu when clicking outside
    document.addEventListener('click', () => {
      DOM.filterDropdowns.forEach(d => d.querySelector('.filter-menu')?.classList.add('hidden'));
    });

    // Hero "Buy Now" CTA button
    const heroCta = document.getElementById('hero-buy-now-btn');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        // Filter to Audio & Tech or 50% Off and smooth scroll
        state.category = 'Audio & Tech';
        applyFilters();
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Top Category Pills in Nav
    document.querySelectorAll('.nav-category-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.category;
        state.category = cat;
        applyFilters();
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Newsletter submit
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email')?.value;
        if (email) {
          showToast(`Welcome to the Luiscart VIP Club! Your 15% welcome code is LUIS15.`);
          newsletterForm.reset();
        }
      });
    }
  }

  // --- INITIALIZE ---
  function init() {
    initSearch();
    setupEvents();
    applyFilters();
    updateCartUI();
    updateWishlistUI();
    lucide.createIcons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
