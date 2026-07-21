/* ==========================================================================
   ArteDigital3D - Interactive E-Commerce & 3D WebGL Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initThreeJSPreview();
    initCalculator();
    initCatalog();
    initCart();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll & Mobile Menu Effect
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   2. Three.js WebGL 3D Preview Engine
   -------------------------------------------------------------------------- */
let scene, camera, renderer, currentMesh, wireframeMesh;
let isWireframeVisible = true;

function initThreeJSPreview() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // Initial 3D Mesh (Complex Mechanical Polyhedron / Gear simulation)
    create3DMesh('#00f0ff');

    // Mouse Drag Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => { isDragging = true; });
    renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging && currentMesh) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            currentMesh.rotation.y += deltaMove.x * 0.01;
            currentMesh.rotation.x += deltaMove.y * 0.01;
            if (wireframeMesh) {
                wireframeMesh.rotation.y = currentMesh.rotation.y;
                wireframeMesh.rotation.x = currentMesh.rotation.x;
            }
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        if (currentMesh && !isDragging) {
            currentMesh.rotation.y += 0.005;
            if (wireframeMesh) wireframeMesh.rotation.y += 0.005;
        }
        renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Control buttons
    const wireframeBtn = document.getElementById('btn-toggle-wireframe');
    if (wireframeBtn) {
        wireframeBtn.addEventListener('click', () => {
            isWireframeVisible = !isWireframeVisible;
            if (wireframeMesh) wireframeMesh.visible = isWireframeVisible;
            showToast(isWireframeVisible ? 'Modo Malla (Wireframe) Activado' : 'Modo Sólido Activado');
        });
    }

    const resetCamBtn = document.getElementById('btn-reset-cam');
    if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
            if (currentMesh) {
                currentMesh.rotation.set(0, 0, 0);
                if (wireframeMesh) wireframeMesh.rotation.set(0, 0, 0);
            }
        });
    }
}

function create3DMesh(colorHex) {
    if (currentMesh) scene.remove(currentMesh);
    if (wireframeMesh) scene.remove(wireframeMesh);

    // TorusKnot geometry representing complex 3D print model
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    
    // Main Solid Material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false
    });

    currentMesh = new THREE.Mesh(geometry, material);
    scene.add(currentMesh);

    // Overlay Wireframe Representation (showing 3D print mesh/layers)
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.visible = isWireframeVisible;
    scene.add(wireframeMesh);
}

/* --------------------------------------------------------------------------
   3. Instant 3D Quote Calculator Logic
   -------------------------------------------------------------------------- */
const MATERIAL_RATES = {
    pla: { name: 'PLA+ Neón', ratePerCm3: 45, color: '#00f0ff', density: 1.24 },
    petg: { name: 'PETG Ultra-Tough', ratePerCm3: 58, color: '#a855f7', density: 1.27 },
    resin: { name: 'Resina UV Alta Precisión', ratePerCm3: 85, color: '#ec4899', density: 1.15 },
    tpu: { name: 'TPU Flexible 95A', ratePerCm3: 72, color: '#10b981', density: 1.21 }
};

let currentCalcState = {
    material: 'pla',
    infill: 20,
    layerHeight: 0.20,
    scale: 100,
    baseVolumeCm3: 65.4, // Base volume of model
    fileUploaded: false,
    fileName: 'modelo_ejemplo.stl'
};

function initCalculator() {
    const materialCards = document.querySelectorAll('.material-option');
    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            materialCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentCalcState.material = card.dataset.material;
            
            // Update 3D canvas color
            const materialData = MATERIAL_RATES[currentCalcState.material];
            if (materialData) {
                create3DMesh(materialData.color);
            }
            updateQuoteCalculation();
        });
    });

    // Infill Slider
    const infillInput = document.getElementById('calc-infill');
    const infillValDisplay = document.getElementById('calc-infill-val');
    if (infillInput) {
        infillInput.addEventListener('input', (e) => {
            currentCalcState.infill = parseInt(e.target.value);
            if (infillValDisplay) infillValDisplay.textContent = `${currentCalcState.infill}%`;
            updateQuoteCalculation();
        });
    }

    // Scale Slider
    const scaleInput = document.getElementById('calc-scale');
    const scaleValDisplay = document.getElementById('calc-scale-val');
    if (scaleInput) {
        scaleInput.addEventListener('input', (e) => {
            currentCalcState.scale = parseInt(e.target.value);
            if (scaleValDisplay) scaleValDisplay.textContent = `${currentCalcState.scale}%`;
            
            // Scale 3D Mesh
            const factor = currentCalcState.scale / 100;
            if (currentMesh) currentMesh.scale.set(factor, factor, factor);
            if (wireframeMesh) wireframeMesh.scale.set(factor, factor, factor);
            
            updateQuoteCalculation();
        });
    }

    // Quality Selector
    const qualitySelect = document.getElementById('calc-quality');
    if (qualitySelect) {
        qualitySelect.addEventListener('change', (e) => {
            currentCalcState.layerHeight = parseFloat(e.target.value);
            updateQuoteCalculation();
        });
    }

    // Drag & Drop File Simulation
    const dropZone = document.getElementById('stl-dropzone');
    const fileInput = document.getElementById('stl-file-input');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    // Add Quote to Cart Button
    const addQuoteBtn = document.getElementById('btn-add-quote-cart');
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', () => {
            const matData = MATERIAL_RATES[currentCalcState.material];
            const quotePrice = calculateQuotePrice();
            
            const customQuoteItem = {
                id: `quote-${Date.now()}`,
                name: `Pieza Personalizada (${currentCalcState.fileName})`,
                price: quotePrice,
                image: 'assets/images/prod_gears.jpg',
                details: `Mat: ${matData.name} | Relleno: ${currentCalcState.infill}% | Escala: ${currentCalcState.scale}%`,
                qty: 1
            };

            addToCart(customQuoteItem);
            showToast('¡Cotización añadida al carrito de compras!');
        });
    }

    updateQuoteCalculation();
}

function handleFileSelect(file) {
    if (!file.name.match(/\.(stl|obj|3mf)$/i)) {
        showToast('Por favor selecciona un archivo .STL, .OBJ o .3MF', 'error');
        return;
    }

    currentCalcState.fileUploaded = true;
    currentCalcState.fileName = file.name;
    
    // Randomize base volume slightly to simulate real STL parser
    currentCalcState.baseVolumeCm3 = (Math.random() * 80 + 30).toFixed(1);

    const fileNameDisplay = document.getElementById('upload-filename');
    if (fileNameDisplay) {
        fileNameDisplay.innerHTML = `<i class="bi bi-file-earmark-code"></i> <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }

    showToast(`Archivo 3D "${file.name}" cargado e inspeccionado correctamente.`);
    updateQuoteCalculation();
}

function calculateQuotePrice() {
    const matData = MATERIAL_RATES[currentCalcState.material];
    const scaleFactor = Math.pow(currentCalcState.scale / 100, 3);
    const volumeCm3 = currentCalcState.baseVolumeCm3 * scaleFactor;
    
    // Infill weight factor (shell + internal infill)
    const infillFactor = 0.3 + (currentCalcState.infill / 100) * 0.7;
    const finalVolumeCm3 = volumeCm3 * infillFactor;
    
    // Quality (layer height) factor: finer layers take longer
    const qualityFactor = currentCalcState.layerHeight === 0.12 ? 1.35 : (currentCalcState.layerHeight === 0.20 ? 1.0 : 0.85);

    const rawCost = finalVolumeCm3 * matData.ratePerCm3 * qualityFactor;
    const baseSetupFee = 3500; // Base setup cost CLP
    
    return Math.round((rawCost + baseSetupFee) / 100) * 100;
}

function updateQuoteCalculation() {
    const totalPrice = calculateQuotePrice();
    const matData = MATERIAL_RATES[currentCalcState.material];
    const scaleFactor = Math.pow(currentCalcState.scale / 100, 3);
    const volumeCm3 = (currentCalcState.baseVolumeCm3 * scaleFactor).toFixed(1);
    const estimatedWeight = Math.round(volumeCm3 * matData.density * (0.3 + (currentCalcState.infill / 100) * 0.7));
    const printTimeHours = (volumeCm3 * 0.12 * (0.20 / currentCalcState.layerHeight)).toFixed(1);

    // Update UI elements
    const priceDisplay = document.getElementById('calc-total-price');
    if (priceDisplay) {
        priceDisplay.textContent = `$${totalPrice.toLocaleString('es-CL')}`;
    }

    const volDisplay = document.getElementById('calc-stat-volume');
    if (volDisplay) volDisplay.textContent = `${volumeCm3} cm³`;

    const weightDisplay = document.getElementById('calc-stat-weight');
    if (weightDisplay) weightDisplay.textContent = `${estimatedWeight} g`;

    const timeDisplay = document.getElementById('calc-stat-time');
    if (timeDisplay) timeDisplay.textContent = `${printTimeHours} hrs`;
}

/* --------------------------------------------------------------------------
   4. E-Commerce Product Catalog
   -------------------------------------------------------------------------- */
const PRODUCTS = [
    {
        id: 'p1',
        title: 'Figura Robot Mecha Cyberpunk',
        category: 'figuras',
        price: 24900,
        image: 'assets/images/prod_mech.jpg',
        description: 'Impresión en Resina UV de ultra alta definición. Detalle microscópico y acabado liso profesional.',
        tag: 'Resina UV 8K'
    },
    {
        id: 'p2',
        title: 'Maqueta Arquitectónica Moderna',
        category: 'prototipos',
        price: 49900,
        image: 'assets/images/prod_arch.jpg',
        description: 'Maqueta a escala detallada impresa en PLA+ Blanco Titanio para presentaciones de arquitectura.',
        tag: 'Escala 1:100'
    },
    {
        id: 'p3',
        title: 'Casco Sci-Fi Wearable (Cosplay)',
        category: 'cosplay',
        price: 89900,
        image: 'assets/images/prod_helmet.jpg',
        description: 'Prop de tamaño real ligero en PETG de alta resistencia. Listo para pintar o ensamblar.',
        tag: 'Tamaño Real'
    },
    {
        id: 'p4',
        title: 'Set de Engranajes de Precisión',
        category: 'prototipos',
        price: 18900,
        image: 'assets/images/prod_gears.jpg',
        description: 'Mecanismo funcional impreso en Fibra de Carbono PETG para prototipado mecánico duro.',
        tag: 'Carbon Fiber'
    },
    {
        id: 'p5',
        title: 'Lámpara Litofanía Personalizada',
        category: 'decoracion',
        price: 32900,
        image: 'assets/images/prod_lithophane.jpg',
        description: 'Transforma tu foto favorita en una escultura 3D traslúcida que cobra vida al encender la luz.',
        tag: 'Regalo Único'
    }
];

function initCatalog() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    renderProducts(PRODUCTS);

    // Category Filter Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const cat = btn.dataset.category;
            const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
            renderProducts(filtered);
        });
    });

    // Search Filter
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = PRODUCTS.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
            renderProducts(filtered);
        });
    }
}

function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
            <i class="bi bi-search" style="font-size: 2.5rem; display: block; margin-bottom: 1rem;"></i>
            No se encontraron productos que coincidan con tu búsqueda.
        </div>`;
        return;
    }

    grid.innerHTML = items.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy" />
                <span class="badge badge-cyan product-tag">${product.tag}</span>
            </div>
            <div class="product-details">
                <div>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.description}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toLocaleString('es-CL')}</span>
                    <button class="btn btn-primary btn-sm" onclick="addCatalogItemToCart('${product.id}')">
                        <i class="bi bi-bag-plus"></i> Añadir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addCatalogItemToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
        addToCart({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.image,
            details: product.tag,
            qty: 1
        });
        showToast(`"${product.title}" añadido al carrito.`);
    }
}

/* --------------------------------------------------------------------------
   5. Cart Drawer & Checkout Management
   -------------------------------------------------------------------------- */
let cart = [];

function initCart() {
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.getElementById('cart-close-btn');

    cartToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.toggle('open');
        });
    });

    if (cartCloseBtn && cartDrawer) {
        cartCloseBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));
    }

    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Tu carrito está vacío.', 'error');
                return;
            }
            alert('¡Gracias por tu pedido en ArteDigital3D! Nos pondremos en contacto para coordinar detalles de impresión y despacho.');
            cart = [];
            updateCartUI();
            if (cartDrawer) cartDrawer.classList.remove('open');
        });
    }
}

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }
    updateCartUI();
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) cartDrawer.classList.add('open');
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-list');
    const cartCountBadge = document.getElementById('cart-badge-count');
    const subtotalDisplay = document.getElementById('cart-subtotal-price');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartCountBadge) cartCountBadge.textContent = totalQty;
    if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal.toLocaleString('es-CL')}`;

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
            <i class="bi bi-cart-x" style="font-size: 3rem; display: block; margin-bottom: 1rem;"></i>
            Tu carrito está actualmente vacío.
        </div>`;
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${item.details || ''}</div>
                <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-CL')}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeCartQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeCartQty('${item.id}', 1)">+</button>
                    <button style="margin-left: auto; background: none; border: none; color: #ef4444; cursor: pointer;" onclick="removeFromCart('${item.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function changeCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

/* --------------------------------------------------------------------------
   6. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    const color = type === 'success' ? 'var(--primary)' : '#ef4444';
    toast.style.borderColor = color;

    toast.innerHTML = `<i class="bi ${icon}" style="color: ${color}; font-size: 1.2rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
