// Datos de productos - Hacerlos disponibles globalmente inmediatamente
window.products = [
    {
        id: 1,
        name: "BMW M Motor Sport Collection",
        category: "Premium",
        price: 50000,
        image: "Imagenes/Carros/1.jpeg",
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Ford Mustang GT Collection",
        category: "Premium",
        price: 50000,
        image: "Imagenes/Carros/2.jpeg",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Nissan Formula E Gen 2 Car Collection",
        category: "Racing",
        price: 50000,
        image: "Imagenes/Carros/3.jpeg",
        badge: "Exclusivo"
    },
    {
        id: 4,
        name: "Ford Mustang GT Shell V-Power Racing Collection",
        category: "Racing",
        price: 50000,
        image: "Imagenes/Carros/4.jpeg",
        badge: "Limitado"
    },
    {
        id: 5,
        name: "Indy Cart Collection",
        category: "Racing",
        price: 50000,
        image: "Imagenes/Carros/5.jpeg",
        badge: "Nuevo"
    },
    {
        id: 6,
        name: "Ferrari F1-75 Collection",
        category: "Formula 1",
        price: 50000,
        image: "Imagenes/Carros/6.jpeg",
        badge: "Exclusivo"
    }
];

// Agregar a window para que esté disponible globalmente
window.products = products;

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    setupScrollEffects();
    setupNewsletter();
});

// Renderizar productos en el catálogo
function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toLocaleString('es-CO')}</div>
                <button class="add-to-cart" onclick="handleAddToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');

    // Agregar event listeners a las tarjetas de producto
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Si el clic no fue en el botón de agregar al carrito
            if (!e.target.closest('.add-to-cart')) {
                const productId = parseInt(card.dataset.id);
                console.log('Navegando a producto con ID:', productId);
                window.location.href = `producto.html?id=${productId}`;
            }
        });
    });

    // Animación de entrada
    observeProducts();
}

// Manejar agregar al carrito
window.handleAddToCart = function(productId) {
    if (typeof addToCart === 'function') {
        addToCart(productId);
    } else {
        console.error('Función addToCart no disponible');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle menú móvil
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Compensar por el header fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efectos de scroll
function setupScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Añadir/quitar clase scrolled al header
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header en móvil
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
    });
}

// Animaciones de entrada con Intersection Observer
function observeProducts() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    document.querySelectorAll('.product-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Newsletter
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validar email
            if (validateEmail(email)) {
                // Aquí iría la lógica para enviar el email
                console.log('Email suscrito:', email);
                
                // Mostrar notificación
                if (window.cart && window.cart.showNotification) {
                    window.cart.showNotification('¡Gracias por suscribirte a nuestro newsletter!');
                }
                
                // Limpiar formulario
                emailInput.value = '';
            } else {
                if (window.cart && window.cart.showNotification) {
                    window.cart.showNotification('Por favor ingresa un email válido', 'error');
                }
            }
        });
    }
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Filtrar productos por categoría (para futuras implementaciones)
window.filterProducts = function(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderFilteredProducts(filteredProducts);
}

// Renderizar productos filtrados
function renderFilteredProducts(filteredProducts) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toLocaleString('es-CO')}</div>
                <button class="add-to-cart" onclick="handleAddToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
    
    observeProducts();
}

// Buscar productos
window.searchProducts = function(searchTerm) {
    const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    renderFilteredProducts(results);
}

// Estilos CSS para animaciones de entrada
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .product-card,
    .feature-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .product-card.visible,
    .feature-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .product-card:nth-child(1) { transition-delay: 0.1s; }
    .product-card:nth-child(2) { transition-delay: 0.2s; }
    .product-card:nth-child(3) { transition-delay: 0.3s; }
    .product-card:nth-child(4) { transition-delay: 0.4s; }
    .product-card:nth-child(5) { transition-delay: 0.5s; }
    .product-card:nth-child(6) { transition-delay: 0.6s; }
    
    .header {
        transition: transform 0.3s ease-in-out;
    }
    
    @media (max-width: 768px) {
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }
    }
`;
document.head.appendChild(animationStyles);