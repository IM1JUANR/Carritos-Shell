// Sistema de carrito de compras
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    // Persistencia
    loadCart() {
        try {
            return JSON.parse(localStorage.getItem('shellCart')) || [];
        } catch {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem('shellCart', JSON.stringify(this.items));
    }

    // CRUD
    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} agregado al carrito`, 'success');
        this.animateCartButton();
    }

    removeItem(productId) {
        this.items = this.items.filter(i => i.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto eliminado del carrito');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(i => i.id === productId);
        if (!item) return;
        if (quantity <= 0) {
            this.removeItem(productId);
        } else {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    increaseQuantity(productId) {
        const item = this.items.find(i => i.id === productId);
        if (item) this.updateQuantity(productId, item.quantity + 1);
    }

    decreaseQuantity(productId) {
        const item = this.items.find(i => i.id === productId);
        if (item && item.quantity > 1) this.updateQuantity(productId, item.quantity - 1);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Carrito vaciado');
    }

    // Totales
    getTotal()     { return this.items.reduce((t, i) => t + i.price * i.quantity, 0); }
    getItemCount() { return this.items.reduce((t, i) => t + i.quantity, 0); }

    // UI principal
    updateCartUI() {
        this.updateCartCount();
        this.updateCartModal();
        this.updateCartPage();
    }

    updateCartCount() {
        const el = document.getElementById('cartCount');
        if (!el) return;
        const count = this.getItemCount();
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
    }

    updateCartModal() {
        const itemsEl  = document.getElementById('cartItems');
        const totalEl  = document.getElementById('cartTotal');
        const countEl  = document.getElementById('cartHeaderCount');

        if (!itemsEl) return;

        const count = this.getItemCount();

        if (countEl) {
            countEl.textContent = count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`;
        }

        if (this.items.length === 0) {
            itemsEl.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                    <small>¡Agrega algún modelo para empezar!</small>
                </div>`;
        } else {
            itemsEl.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString('es-CO')}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="window.cart.decreaseQuantity(${item.id})" aria-label="Disminuir">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="window.cart.increaseQuantity(${item.id})" aria-label="Aumentar">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.cart.removeItem(${item.id})" aria-label="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>`).join('');
        }

        if (totalEl) totalEl.textContent = `$${this.getTotal().toLocaleString('es-CO')}`;

        this.updateShippingProgress();
    }

    updateShippingProgress() {
        const fill   = document.getElementById('shippingProgressFill');
        const text   = document.getElementById('shippingProgressText');
        if (!fill || !text) return;

        const FREE_THRESHOLD = 100000;
        const total    = this.getTotal();
        const pct      = Math.min((total / FREE_THRESHOLD) * 100, 100);
        const missing  = FREE_THRESHOLD - total;

        fill.style.width = `${pct}%`;

        if (total === 0) {
            text.innerHTML = `Agrega <strong>$${FREE_THRESHOLD.toLocaleString('es-CO')}</strong> para <strong>envío gratis</strong>`;
        } else if (missing > 0) {
            text.innerHTML = `Te faltan <span class="amount">$${missing.toLocaleString('es-CO')}</span> para <strong>envío gratis</strong>`;
        } else {
            text.innerHTML = `<strong>¡Envío gratis desbloqueado!</strong> 🎉`;
        }
    }

    updateCartPage() {
        if (!window.location.pathname.includes('carrito.html')) return;

        const itemsEl    = document.getElementById('cart-page-items');
        const emptyEl    = document.getElementById('empty-cart-section');
        const contentEl  = document.getElementById('cart-content-section');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl    = document.getElementById('total');
        const countEl    = document.getElementById('total-items');
        const shippingEl = document.getElementById('shipping');

        if (this.items.length === 0) {
            if (emptyEl)   emptyEl.style.display   = 'block';
            if (contentEl) contentEl.style.display = 'none';
            return;
        }

        if (emptyEl)   emptyEl.style.display   = 'none';
        if (contentEl) contentEl.style.display = 'block';

        if (itemsEl) {
            itemsEl.innerHTML = this.items.map(item => `
                <div class="cart-page-item" data-id="${item.id}">
                    <div class="cart-page-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-page-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-page-item-category">${item.category}</p>
                        <p class="cart-page-item-price">$${item.price.toLocaleString('es-CO')}</p>
                    </div>
                    <div class="cart-page-item-controls">
                        <div class="quantity-control">
                            <button onclick="window.cart.decreaseQuantity(${item.id})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${item.quantity}" min="1" readonly>
                            <button onclick="window.cart.increaseQuantity(${item.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="item-total">$${(item.price * item.quantity).toLocaleString('es-CO')}</div>
                        <button class="remove-item" onclick="window.cart.removeItem(${item.id})" aria-label="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`).join('');
        }

        const subtotal = this.getTotal();
        const shipping = subtotal > 100000 ? 0 : 10000;
        const total    = subtotal + shipping;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-CO')}`;
        if (totalEl)    totalEl.textContent    = `$${total.toLocaleString('es-CO')}`;
        if (countEl)    countEl.textContent    = this.getItemCount();
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`;
    }

    // Notificación toast
    showNotification(message, type = 'success') {
        const el   = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        const icon = el && el.querySelector('i');

        if (!el || !text) return;

        const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle' };

        text.textContent = message;
        el.className = `notification ${type}`;
        if (icon) icon.className = icons[type] || icons.success;
        el.classList.add('show');

        clearTimeout(this._notifTimer);
        this._notifTimer = setTimeout(() => el.classList.remove('show'), 3000);
    }

    animateCartButton() {
        const btn = document.getElementById('cartBtn');
        if (!btn) return;
        const count = btn.querySelector('.cart-count');

        btn.classList.remove('bounce');
        void btn.offsetWidth;
        btn.classList.add('bounce');

        if (count) {
            count.classList.remove('bump');
            void count.offsetWidth;
            count.classList.add('bump');
            setTimeout(() => count.classList.remove('bump'), 250);
        }

        setTimeout(() => btn.classList.remove('bounce'), 350);
    }

    // Event listeners
    setupEventListeners() {
        const cartBtn     = document.getElementById('cartBtn');
        const cartModal   = document.getElementById('cartModal');
        const cartClose   = document.getElementById('cartClose');
        const backdrop    = document.getElementById('cartBackdrop');

        const openCart  = () => { cartModal && cartModal.classList.add('active'); backdrop && backdrop.classList.add('active'); document.body.style.overflow = 'hidden'; };
        const closeCart = () => { cartModal && cartModal.classList.remove('active'); backdrop && backdrop.classList.remove('active'); document.body.style.overflow = ''; };

        if (cartBtn)   cartBtn.addEventListener('click', openCart);
        if (cartClose) cartClose.addEventListener('click', closeCart);
        if (backdrop)  backdrop.addEventListener('click', closeCart);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeCart();
        });

        const clearBtn = document.getElementById('clear-cart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('¿Vaciar el carrito?')) this.clearCart();
            });
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    this.showNotification('Redirigiendo al pago...', 'success');
                } else {
                    this.showNotification('El carrito está vacío', 'error');
                }
            });
        }
    }
}

// Instancia global
window.cart = new ShoppingCart();

// Helper público para agregar al carrito desde botones
window.addToCart = function(productId) {
    const product = (window.products || []).find(p => p.id === productId);
    if (product) window.cart.addItem(product);
};
