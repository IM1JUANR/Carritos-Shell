// Catálogo de productos
window.products = [
    { id: 1, name: "BMW M Motor Sport Collection",                    category: "Premium",   price: 50000, image: "Imagenes/Carros/1.jpeg", badge: "Nuevo"     },
    { id: 2, name: "Ford Mustang GT Collection",                      category: "Premium",   price: 50000, image: "Imagenes/Carros/2.jpeg", badge: "Popular"   },
    { id: 3, name: "Nissan Formula E Gen 2 Car Collection",           category: "Racing",    price: 50000, image: "Imagenes/Carros/3.jpeg", badge: "Exclusivo" },
    { id: 4, name: "Ford Mustang GT Shell V-Power Racing Collection",  category: "Racing",    price: 50000, image: "Imagenes/Carros/4.jpeg", badge: "Limitado"  },
    { id: 5, name: "Indy Cart Collection",                            category: "Racing",    price: 50000, image: "Imagenes/Carros/5.jpeg", badge: "Nuevo"     },
    { id: 6, name: "Ferrari F1-75 Collection",                        category: "Formula 1", price: 50000, image: "Imagenes/Carros/6.jpeg", badge: "Exclusivo" }
];

const BADGE_CLASSES = {
    'Nuevo':     'badge-nuevo',
    'Popular':   'badge-popular',
    'Exclusivo': 'badge-exclusivo',
    'Limitado':  'badge-limitado'
};

let activeFilter = 'all';
let searchTerm   = '';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(window.products);
    setupFilters();
    setupSearch();
    setupEventListeners();
    setupScrollEffects();
    setupNewsletter();
    setupBackToTop();
});

// ── Renderizado ──────────────────────────────────────────────────────────────

function buildProductCard(product) {
    const badgeClass = BADGE_CLASSES[product.badge] || 'badge-nuevo';
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ''}
                <div class="product-image-overlay">
                    <button class="overlay-btn" onclick="event.stopPropagation(); goToProduct(${product.id})">
                        <i class="fas fa-eye"></i> Ver detalle
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toLocaleString('es-CO')}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); handleAddToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>`;
}

function renderProducts(list) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Sin resultados</h3>
                <p>No se encontraron modelos con ese criterio.</p>
            </div>`;
        return;
    }

    grid.innerHTML = list.map(buildProductCard).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', e => {
            if (!e.target.closest('.add-to-cart') && !e.target.closest('.overlay-btn')) {
                goToProduct(parseInt(card.dataset.id));
            }
        });
    });

    observeCards();
}

function goToProduct(id) {
    window.location.href = `producto.html?id=${id}`;
}

// ── Filtros ──────────────────────────────────────────────────────────────────

function getFilteredProducts() {
    return window.products.filter(p => {
        const matchCategory = activeFilter === 'all' || p.category === activeFilter;
        const matchSearch   = p.name.toLowerCase().includes(searchTerm) ||
                              p.category.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });
}

function applyFilters() {
    renderProducts(getFilteredProducts());
}

function setupFilters() {
    const tabs = document.getElementById('filterTabs');
    if (!tabs) return;

    tabs.addEventListener('click', e => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        tabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeFilter = tab.dataset.filter;
        applyFilters();
    });
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let timer;
    input.addEventListener('input', e => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            searchTerm = e.target.value.trim().toLowerCase();
            applyFilters();
        }, 220);
    });
}

// ── Carrito helper ───────────────────────────────────────────────────────────

window.handleAddToCart = function(productId) {
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId);
    }
};

// ── Eventos generales ────────────────────────────────────────────────────────

function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu    = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', open);
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu && navMenu.classList.remove('active');
            menuToggle && menuToggle.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

// ── Scroll effects ───────────────────────────────────────────────────────────

function setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 80);
    }, { passive: true });
}

// ── Intersection Observer ────────────────────────────────────────────────────

function observeCards() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.product-card, .feature-card').forEach(el => observer.observe(el));
}

// ── Back to top ──────────────────────────────────────────────────────────────

function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Newsletter ───────────────────────────────────────────────────────────────

function setupNewsletter() {
    const form = document.getElementById('newsletterForm') || document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = e.target.querySelector('input[type="email"]');
        const email = input.value.trim();
        const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (re.test(email)) {
            window.cart && window.cart.showNotification('¡Gracias por suscribirte!', 'success');
            input.value = '';
        } else {
            window.cart && window.cart.showNotification('Ingresa un correo válido', 'error');
        }
    });
}

// ── Filtros externos (API pública) ───────────────────────────────────────────

window.filterProducts = function(category) {
    activeFilter = category;
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });
    applyFilters();
};

window.searchProducts = function(term) {
    searchTerm = term.toLowerCase();
    applyFilters();
};
