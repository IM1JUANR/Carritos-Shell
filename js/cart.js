// Sistema de carrito de compras - cart.js
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shellCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('shellCart', JSON.stringify(this.items));
    }

    // Agregar producto al carrito
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} agregado al carrito`);
        this.animateCartButton();
        
        return true;
    }

    // Eliminar producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto eliminado del carrito');
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Incrementar cantidad
    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    // Decrementar cantidad
    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    // Vaciar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Carrito vaciado');
    }

    // Obtener total del carrito
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener cantidad total de items
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Actualizar UI del carrito
    updateCartUI() {
        this.updateCartCount();
        this.updateCartModal();
        this.updateCartPage();
    }

    // Actualizar contador del carrito
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    // Actualizar modal del carrito
    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartTotal) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString('es-CO')}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="window.cart.decreaseQuantity(${item.id})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="window.cart.increaseQuantity(${item.id})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.cart.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        cartTotal.textContent = `$${this.getTotal().toLocaleString('es-CO')}`;
    }

    // Actualizar página del carrito
    updateCartPage() {
        // Solo actualizar si estamos en la página del carrito
        if (!window.location.pathname.includes('carrito.html')) return;

        const cartPageItems = document.getElementById('cart-page-items');
        const emptyCartSection = document.getElementById('empty-cart-section');
        const cartContentSection = document.getElementById('cart-content-section');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const totalItemsElement = document.getElementById('total-items');
        const shippingElement = document.getElementById('shipping');

        if (this.items.length === 0) {
            if (emptyCartSection) emptyCartSection.style.display = 'block';
            if (cartContentSection) cartContentSection.style.display = 'none';
        } else {
            if (emptyCartSection) emptyCartSection.style.display = 'none';
            if (cartContentSection) cartContentSection.style.display = 'block';

            if (cartPageItems) {
                cartPageItems.innerHTML = this.items.map(item => `
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
                            <div class="item-total">
                                $${(item.price * item.quantity).toLocaleString('es-CO')}
                            </div>
                            <button class="remove-item" onclick="window.cart.removeItem(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Calcular totales
            const subtotal = this.getTotal();
            const shipping = subtotal > 100000 ? 0 : 10000;
            const total = subtotal + shipping;

            if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString('es-CO')}`;
            if (totalElement) totalElement.textContent = `$${total.toLocaleString('es-CO')}`;
            if (totalItemsElement) totalItemsElement.textContent = this.getItemCount();
            if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`;
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    // Animar botón del carrito
    animateCartButton() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.classList.add('bounce');
            setTimeout(() => cartBtn.classList.remove('bounce'), 300);
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Toggle modal del carrito
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const cartClose = document.getElementById('cartClose');

        if (cartBtn && cartModal) {
            cartBtn.addEventListener('click', () => {
                cartModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (cartClose && cartModal) {
            cartClose.addEventListener('click', () => {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Cerrar modal al hacer clic fuera
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Botón vaciar carrito
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    this.clearCart();
                }
            });
        }

        // Botón checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    alert('Redirigiendo al proceso de pago...');
                    // Aquí iría la redirección al checkout real
                } else {
                    this.showNotification('El carrito está vacío', 'error');
                }
            });
        }
    }
}

// Instancia global del carrito
window.cart = new ShoppingCart();

// Función helper para agregar producto (usada desde los botones)
window.addToCart = function(productId) {
    // Obtener productos del array global
    const products = window.products;
    if (!products) {
        console.error('Productos no disponibles');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        window.cart.addItem(product);
    }
}

// Estilos CSS para animaciones
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--color-success);
        color: var(--color-white);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 3000;
    }

    .notification.error {
        background: var(--color-danger);
    }

    .notification.show {
        transform: translateX(0);
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    .cart-btn.bounce {
        animation: bounce 0.3s;
    }
`;
document.head.appendChild(cartStyles);