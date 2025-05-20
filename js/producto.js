// Definir los productos directamente si no están disponibles
if (!window.products) {
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
}

// Función principal que carga cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado en la página de producto');
    
    // Obtener ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    console.log('ID del producto:', productId);
    console.log('Productos disponibles:', window.products);
    
    if (!productId) {
        console.error('No se encontró ID del producto');
        alert('Producto no encontrado');
        window.location.href = 'index.html';
        return;
    }
    
    // Buscar el producto
    const product = window.products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Producto no encontrado con ID:', productId);
        alert('Producto no encontrado');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Producto encontrado:', product);
    
    // Actualizar la información del producto en la página
    actualizarProducto(product);
    configurarEventListeners(product);
});

// Variables globales
let selectedQuantity = 1;

// Función para actualizar la información del producto
function actualizarProducto(product) {
    console.log('Actualizando información del producto...');
    
    // Actualizar breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
        console.log('Breadcrumb actualizado');
    }
    
    // Actualizar categoría
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.textContent = product.category;
        console.log('Categoría actualizada');
    }
    
    // Actualizar nombre
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = product.name;
        console.log('Nombre actualizado');
    }
    
    // Actualizar precio
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        productPrice.textContent = `$${product.price.toLocaleString('es-CO')}`;
        console.log('Precio actualizado');
    }
    
    // Actualizar imagen principal
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
        console.log('Imagen principal actualizada');
    }
    
    // Crear miniaturas
    const thumbnails = document.getElementById('thumbnails');
    if (thumbnails) {
        thumbnails.innerHTML = `
            <div class="thumbnail active" data-index="0">
                <img src="${product.image}" alt="${product.name} - Vista 1">
            </div>
            <div class="thumbnail" data-index="1">
                <img src="${product.image}" alt="${product.name} - Vista 2">
            </div>
            <div class="thumbnail" data-index="2">
                <img src="${product.image}" alt="${product.name} - Vista 3">
            </div>
            <div class="thumbnail" data-index="3">
                <img src="${product.image}" alt="${product.name} - Vista 4">
            </div>
        `;
        console.log('Miniaturas creadas');
    }
    
    // Actualizar título de la página
    document.title = `${product.name} - Shell Collection`;
}

// Configurar event listeners
function configurarEventListeners(product) {
    console.log('Configurando event listeners...');
    
    // Control de cantidad
    const decreaseQty = document.getElementById('decreaseQty');
    const increaseQty = document.getElementById('increaseQty');
    const quantity = document.getElementById('quantity');
    
    if (decreaseQty) {
        decreaseQty.addEventListener('click', function() {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                quantity.value = selectedQuantity;
            }
        });
    }
    
    if (increaseQty) {
        increaseQty.addEventListener('click', function() {
            if (selectedQuantity < 10) {
                selectedQuantity++;
                quantity.value = selectedQuantity;
            }
        });
    }
    
    if (quantity) {
        quantity.addEventListener('change', function(e) {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            selectedQuantity = value;
            quantity.value = value;
        });
    }
    
    // Agregar al carrito
    const addToCartDetail = document.getElementById('addToCartDetail');
    if (addToCartDetail) {
        addToCartDetail.addEventListener('click', function() {
            console.log('Agregando al carrito...');
            
            // Verificar si la función addToCart existe
            if (typeof window.addToCart === 'function') {
                for (let i = 0; i < selectedQuantity; i++) {
                    window.addToCart(product.id);
                }
                
                // Animar botón
                addToCartDetail.classList.add('success');
                const originalHTML = addToCartDetail.innerHTML;
                addToCartDetail.innerHTML = '<i class="fas fa-check"></i> Agregado al Carrito';
                
                setTimeout(function() {
                    addToCartDetail.classList.remove('success');
                    addToCartDetail.innerHTML = originalHTML;
                }, 2000);
            } else {
                console.error('Función addToCart no disponible');
                // Intentar agregar directamente al carrito
                if (window.cart && window.cart.addItem) {
                    for (let i = 0; i < selectedQuantity; i++) {
                        window.cart.addItem(product);
                    }
                }
            }
        });
    }
    
    // Comprar ahora
    const buyNow = document.getElementById('buyNow');
    if (buyNow) {
        buyNow.addEventListener('click', function() {
            if (typeof window.addToCart === 'function') {
                for (let i = 0; i < selectedQuantity; i++) {
                    window.addToCart(product.id);
                }
            } else if (window.cart && window.cart.addItem) {
                for (let i = 0; i < selectedQuantity; i++) {
                    window.cart.addItem(product);
                }
            }
            window.location.href = 'carrito.html';
        });
    }
    
    // Galería de imágenes
    const thumbnails = document.getElementById('thumbnails');
    if (thumbnails) {
        thumbnails.addEventListener('click', function(e) {
            const thumbnail = e.target.closest('.thumbnail');
            if (thumbnail) {
                // Actualizar imagen principal
                const mainImage = document.getElementById('mainImage');
                if (mainImage) {
                    mainImage.src = thumbnail.querySelector('img').src;
                }
                
                // Actualizar estado activo
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            }
        });
    }
    
    // Zoom en imagen principal
    const mainImageContainer = document.querySelector('.main-image');
    if (mainImageContainer) {
        let isZoomed = false;
        const mainImage = document.getElementById('mainImage');
        
        mainImageContainer.addEventListener('click', function(e) {
            if (!isZoomed) {
                const rect = mainImageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                mainImage.style.transformOrigin = `${x}px ${y}px`;
                mainImage.style.transform = 'scale(2)';
                mainImageContainer.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                mainImage.style.transform = 'scale(1)';
                mainImageContainer.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });
    }
    
    // Navegación móvil
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    console.log('Event listeners configurados');
}

// Estilos adicionales
const estilos = `
    .add-to-cart-detail.success {
        background: var(--color-success, #28a745) !important;
        transform: scale(1.05);
    }
    
    .add-to-cart-detail {
        transition: all 0.3s ease;
    }
    
    .thumbnail {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .thumbnail:hover {
        transform: scale(1.05);
    }
    
    .thumbnail.active {
        border: 2px solid var(--color-primary, #ef3636);
    }
    
    .main-image {
        cursor: zoom-in;
        transition: transform 0.3s ease;
    }
    
    .main-image img {
        transition: transform 0.3s ease;
    }
`;

// Agregar estilos al head
const styleElement = document.createElement('style');
styleElement.textContent = estilos;
document.head.appendChild(styleElement);

console.log('Script de producto cargado completamente');