// Página de detalle de producto
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const product = (window.products || []).find(p => p.id === productId);

    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    loadProduct(product);
    setupProductEvents(product);
    setupMobileMenu();
    setupNewsletter();
});

let selectedQuantity = 1;

function loadProduct(product) {
    // Título
    document.title = `${product.name} — Shell Collection`;

    // Breadcrumb
    const bc = document.getElementById('breadcrumbProduct');
    if (bc) bc.textContent = product.name;

    // Categoría y nombre
    const catEl  = document.getElementById('productCategory');
    const nameEl = document.getElementById('productName');
    if (catEl)  catEl.textContent  = product.category;
    if (nameEl) nameEl.textContent = product.name;

    // Precio
    const priceEl = document.getElementById('productPrice');
    if (priceEl) priceEl.textContent = `$${product.price.toLocaleString('es-CO')}`;

    // Imagen principal
    const mainImg = document.getElementById('mainImage');
    if (mainImg) { mainImg.src = product.image; mainImg.alt = product.name; }

    // Miniaturas (misma imagen por ahora, representa ángulos distintos)
    const thumbsEl = document.getElementById('thumbnails');
    if (thumbsEl) {
        thumbsEl.innerHTML = [1, 2, 3, 4].map((_, i) => `
            <div class="thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${product.image}" alt="${product.name} — Vista ${i + 1}" loading="lazy">
            </div>`).join('');
    }
}

function setupProductEvents(product) {
    const decreaseBtn     = document.getElementById('decreaseQty');
    const increaseBtn     = document.getElementById('increaseQty');
    const qtyInput        = document.getElementById('quantity');
    const addBtn          = document.getElementById('addToCartDetail');
    const buyNowBtn       = document.getElementById('buyNow');
    const thumbsContainer = document.getElementById('thumbnails');
    const mainImgWrap     = document.getElementById('mainImageContainer');

    // Cantidad
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                if (qtyInput) qtyInput.value = selectedQuantity;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (selectedQuantity < 10) {
                selectedQuantity++;
                if (qtyInput) qtyInput.value = selectedQuantity;
            }
        });
    }

    if (qtyInput) {
        qtyInput.addEventListener('change', e => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1)  val = 1;
            if (val > 10)               val = 10;
            selectedQuantity   = val;
            qtyInput.value     = val;
        });
    }

    // Agregar al carrito
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!window.cart) return;

            for (let i = 0; i < selectedQuantity; i++) {
                window.cart.addItem(product);
            }

            const original = addBtn.innerHTML;
            addBtn.innerHTML = '<i class="fas fa-check"></i> Agregado';
            addBtn.style.background = 'var(--color-success)';

            setTimeout(() => {
                addBtn.innerHTML = original;
                addBtn.style.background = '';
            }, 2000);
        });
    }

    // Comprar ahora
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            if (!window.cart) return;
            for (let i = 0; i < selectedQuantity; i++) {
                window.cart.addItem(product);
            }
            window.location.href = 'carrito.html';
        });
    }

    // Galería — cambiar imagen al hacer clic en miniatura
    if (thumbsContainer) {
        thumbsContainer.addEventListener('click', e => {
            const thumb = e.target.closest('.thumbnail');
            if (!thumb) return;

            const mainImg = document.getElementById('mainImage');
            if (mainImg) {
                mainImg.src = thumb.querySelector('img').src;
                // Reset zoom si está activo
                mainImg.style.transform   = '';
                mainImg.style.transformOrigin = '';
                if (mainImgWrap) mainImgWrap.style.cursor = 'zoom-in';
                isZoomed = false;
            }

            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    }

    // Zoom en imagen principal
    let isZoomed = false;

    if (mainImgWrap) {
        mainImgWrap.style.cursor = 'zoom-in';
        mainImgWrap.addEventListener('click', e => {
            const img  = document.getElementById('mainImage');
            if (!img) return;

            if (!isZoomed) {
                const rect = mainImgWrap.getBoundingClientRect();
                img.style.transformOrigin = `${e.clientX - rect.left}px ${e.clientY - rect.top}px`;
                img.style.transform       = 'scale(2)';
                mainImgWrap.style.cursor  = 'zoom-out';
                isZoomed = true;
            } else {
                img.style.transform      = '';
                img.style.transformOrigin = '';
                mainImgWrap.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });
    }
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav    = document.getElementById('navMenu');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('active');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.nav-wrapper')) {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = e.target.querySelector('input[type="email"]');
        const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (re.test(input.value.trim())) {
            window.cart && window.cart.showNotification('¡Gracias por suscribirte!', 'success');
            input.value = '';
        } else {
            window.cart && window.cart.showNotification('Ingresa un correo válido', 'error');
        }
    });
}
