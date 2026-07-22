/* ==========================================================================
   ArteDigital3D - Live 3D Visualizer & Hourly Engine ($1.500 CLP/hr)
   ========================================================================== */

const CONTACT_PHONE = '56998874601';
const INSTAGRAM_HANDLE = '@arte.digital3d';

// Constant Hourly Rate
const HOURLY_RATE_CLP = 1500;
const MAX_FILE_SIZE_MB = 50;

// Global State
let currentTheme = localStorage.getItem('ad3d_theme') || 'dark';
let cart = JSON.parse(localStorage.getItem('ad3d_cart')) || [];

// Live 3D Cotizador State
const liveCotizadorState = {
  fileName: 'Modelo_Demo_ArteDigital3D.stl',
  fileData: null,
  scalePercent: 100,
  material: 'pla',
  materialName: 'PLA Pro Premium',
  layerRes: 'alta',
  layerResMm: 0.12,
  infill: 15,
  rawVolumeCm3: 45.0, // Base bounding volume estimation
  rawDimX: 50,
  rawDimY: 50,
  rawDimZ: 80
};

// Three.js Globals
let scene, camera, renderer, controls, currentMesh, gridHelper;

// Gallery Products Data
const productsData = [
  {
    id: 7,
    title: 'Dispensador de Bolas 2" Pulgadas',
    category: 'decoracion',
    categoryName: 'Decoración Studio',
    material: 'A Pedido / Color a Elección',
    price: 150000,
    desc: 'Dispensador modular interactivo para cápsulas o bolas de 2 pulgadas. Producto a pedido, color a elegir. Estructura de panal resistente y funcional.',
    img: 'assets/dispensador_bolas.jpg',
    badge: '★ Nuevo'
  },
  {
    id: 1,
    title: 'Figura Articulada Dummy 13 (250% / 75%)',
    category: 'figuras',
    categoryName: 'Figuras & Anime',
    material: 'PLA Pro Naranja & Negro',
    price: 14990,
    desc: 'Figura de acción articulada impresa en 3D en múltiples escalas (250% gigante y 75% pocket). Ensamble de precisión sin pegamento.',
    img: 'assets/dummy13_featured.jpg',
    badge: '★ Destacado'
  },
  {
    id: 2,
    title: 'Florero Paramétrico Origami',
    category: 'decoracion',
    categoryName: 'Decoración Studio',
    material: 'PLA Pro Mate',
    price: 18500,
    desc: 'Jarrón de diseño geométrico vanguardista. Estructura liviana e impermeable tratada.',
    img: 'assets/logo_ad3d.png',
    badge: 'Diseño Exclusivo'
  },
  {
    id: 3,
    title: 'Conjunto de Engranajes Epicíclicos',
    category: 'tecnicas',
    categoryName: 'Piezas Técnicas',
    material: 'PETG Alta Resistencia',
    price: 21900,
    desc: 'Mecanismo planetario funcional de precisión para prototipos mecánicos y robótica.',
    img: 'assets/logo_ad3d.png',
    badge: 'Grado Técnico'
  },
  {
    id: 4,
    title: 'Casco Cyberpunk Samurái Props',
    category: 'cosplay',
    categoryName: 'Cosplay & Utilización',
    material: 'PETG Técnico + Lijado Base',
    price: 55000,
    desc: 'Réplica a tamaño real escala 1:1. Estructura altamente resistente lista para vestuario o exhibición.',
    img: 'assets/logo_ad3d.png',
    badge: 'Edición Cosplay'
  },
  {
    id: 5,
    title: 'Busto Escultura David Cyber',
    category: 'figuras',
    categoryName: 'Figuras & Anime',
    material: 'PLA Pro Blanco Mate',
    price: 28000,
    desc: 'Reinterpretación clásica con patrones 3D impresos en PLA Pro de alta nitidez.',
    img: 'assets/logo_ad3d.png',
    badge: 'Arte 3D'
  },
  {
    id: 6,
    title: 'Soporte Ajustable Robótica / Monitor',
    category: 'tecnicas',
    categoryName: 'Piezas Técnicas',
    material: 'PETG Técnico Reforzado',
    price: 16900,
    desc: 'Soporte funcional diseñado para resistir cargas mecánicas continuas e intemperie.',
    img: 'assets/logo_ad3d.png',
    badge: 'Alta Carga'
  }
];

// Marketplace Designs Data (ONLY PLA Pro and PETG)
const marketplaceData = [
  {
    id: 107,
    title: 'Dispensador de Bolas 2" Pulgadas',
    author: 'ArteDigital3D',
    category: 'hogar',
    price: 150000,
    fileName: 'dispensador_bolas_2in.stl',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/dispensador_bolas.jpg'
  },
  {
    id: 101,
    title: 'Cactus Paramétrico Geométrico',
    author: '3DArtisan',
    category: 'hogar',
    price: 9990,
    fileName: 'cactus_geometrico.stl',
    badge: 'badge-top-seller',
    badgeText: 'Top Seller',
    img: 'assets/logo_ad3d.png'
  },
  {
    id: 102,
    title: 'Soporte Mandos Gaming Sci-Fi',
    author: 'VortexForge',
    category: 'gadgets',
    price: 13500,
    fileName: 'soporte_gaming_scifi.stl',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/logo_ad3d.png'
  },
  {
    id: 103,
    title: 'Figura Zbrush Cyber Dragon',
    author: 'DragonScales',
    category: 'figuras',
    price: 24900,
    fileName: 'cyber_dragon_sculpt.obj',
    badge: 'badge-top-seller',
    badgeText: 'Top Seller',
    img: 'assets/logo_ad3d.png'
  },
  {
    id: 104,
    title: 'Máscara Oni Cyberpunk V2',
    author: 'CyberProps',
    category: 'cosplay',
    price: 35000,
    fileName: 'oni_mask_cyberpunk.3mf',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/logo_ad3d.png'
  },
  {
    id: 105,
    title: 'Organizador Escritorio Colmena',
    author: 'BambuLines',
    category: 'hogar',
    price: 11990,
    fileName: 'organizador_colmena.stl',
    badge: 'badge-top-seller',
    badgeText: 'Popular',
    img: 'assets/logo_ad3d.png'
  },
  {
    id: 106,
    title: 'Soporte Auriculares Neon Beam',
    author: 'VortexForge',
    category: 'gadgets',
    price: 14900,
    fileName: 'neon_beam_stand.stl',
    badge: 'badge-top-seller',
    badgeText: 'Top Seller',
    img: 'assets/logo_ad3d.png'
  }
];

const designersRanking = [
  { rank: 1, name: 'VortexForge', sales: 420, avatar: 'VF' },
  { rank: 2, name: '3DArtisan', sales: 385, avatar: '3D' },
  { rank: 3, name: 'CyberProps', sales: 310, avatar: 'CP' },
  { rank: 4, name: 'DragonScales', sales: 290, avatar: 'DS' },
  { rank: 5, name: 'BambuLines', sales: 180, avatar: 'BL' }
];

let selectedModalProduct = null;
let modalQty = 1;

// --- Initialize Application ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderGallery('all');
  initThreeJSVisualizer();
  setupDropzone();
  updateHourlyPriceCalculation();
  updateCartBadge();
  
  // Initialize Marketplace
  renderMarketplace('all');
  renderDesignersRanking();
  setupMarketplaceSearchAndFilters();
});

// --- Theme Toggle ---
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn?.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('ad3d_theme', currentTheme);
    if (gridHelper) {
      gridHelper.material.color.setHex(currentTheme === 'dark' ? 0x333333 : 0xcccccc);
    }
  });
}

// ==========================================================================
// Three.js 3D Engine Setup & File Loader
// ==========================================================================

function initThreeJSVisualizer() {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 380;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(currentTheme === 'dark' ? 0x0d0f14 : 0xf1f5f9);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(100, 100, 150);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Orbit Controls
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xd4af37, 0.85);
  dirLight1.position.set(100, 200, 100);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.45);
  dirLight2.position.set(-100, -100, -100);
  scene.add(dirLight2);

  // Grid Helper
  gridHelper = new THREE.GridHelper(200, 20, 0xd4af37, 0x444444);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // Load Initial Demo 3D Mesh
  createDemoGeometry();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Window Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function createDemoGeometry() {
  if (currentMesh) scene.remove(currentMesh);

  // Stylish TorusKnot representing a complex 3D printed geometry
  const geometry = new THREE.TorusKnotGeometry(25, 8, 120, 16);
  geometry.center();
  geometry.computeBoundingBox();

  const material = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.25,
    roughness: 0.35
  });

  currentMesh = new THREE.Mesh(geometry, material);
  currentMesh.position.y = 30;
  scene.add(currentMesh);

  updateGeometryMetrics(geometry);
}

function updateGeometryMetrics(geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const size = new THREE.Vector3();
  box.getSize(size);

  liveCotizadorState.rawDimX = Math.round(size.x);
  liveCotizadorState.rawDimY = Math.round(size.y);
  liveCotizadorState.rawDimZ = Math.round(size.z);

  // Approximate Volume in cm3
  const bboxVolumeCm3 = (size.x * size.y * size.z) / 1000;
  liveCotizadorState.rawVolumeCm3 = Math.max(15, bboxVolumeCm3 * 0.45);

  updateDimensionsUI();
  updateHourlyPriceCalculation();
}

function updateDimensionsUI() {
  const scale = liveCotizadorState.scalePercent / 100;
  const scaledX = Math.round(liveCotizadorState.rawDimX * scale);
  const scaledY = Math.round(liveCotizadorState.rawDimY * scale);
  const scaledZ = Math.round(liveCotizadorState.rawDimZ * scale);

  document.getElementById('active-filename').textContent = liveCotizadorState.fileName;
  document.getElementById('active-dimensions').textContent = `${scaledX} x ${scaledY} x ${scaledZ} mm`;
}

function reset3DCamera() {
  if (camera && controls) {
    camera.position.set(100, 100, 150);
    controls.target.set(0, 20, 0);
    controls.update();
  }
}

// ==========================================================================
// Drag & Drop File Loader (.STL, .OBJ, .3MF Max 50MB)
// ==========================================================================

function setupDropzone() {
  const fileInput = document.getElementById('stl-file-input');
  const dropzoneBox = document.getElementById('dropzone-box');

  if (!fileInput || !dropzoneBox) return;

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  dropzoneBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzoneBox.style.borderColor = 'var(--accent-cyan)';
  });

  dropzoneBox.addEventListener('dragleave', () => {
    dropzoneBox.style.borderColor = 'var(--accent-gold)';
  });

  dropzoneBox.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzoneBox.style.borderColor = 'var(--accent-gold)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });
}

function handleUploadedFile(file) {
  // Validate File Size (50 MB Max)
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    alert(`El archivo supera el límite máximo de ${MAX_FILE_SIZE_MB} MB. Tu archivo pesa ${sizeMB.toFixed(1)} MB.`);
    return;
  }

  const ext = file.name.split('.').pop().toLowerCase();
  if (!['stl', 'obj', '3mf'].includes(ext)) {
    alert('Formato no soportado. Por favor sube un archivo en formato .STL, .OBJ o .3MF');
    return;
  }

  liveCotizadorState.fileName = file.name;
  showCanvasSpinner(true);

  const reader = new FileReader();

  if (ext === 'stl') {
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      if (typeof THREE.STLLoader !== 'undefined') {
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(e.target.result);
        renderParsedGeometry(geometry);
      } else {
        simulateMeshLoading(file.name);
      }
    };
  } else {
    // OBJ or 3MF
    simulateMeshLoading(file.name);
  }
}

function simulateMeshLoading(name) {
  setTimeout(() => {
    // Create custom smooth polygon representing the uploaded geometry
    const geometry = new THREE.IcosahedronGeometry(30, 2);
    renderParsedGeometry(geometry);
  }, 400);
}

function renderParsedGeometry(geometry) {
  showCanvasSpinner(false);
  geometry.center();
  geometry.computeVertexNormals();

  if (currentMesh) scene.remove(currentMesh);

  const matColor = liveCotizadorState.material === 'pla' ? 0xd4af37 : 0x38bdf8;
  const material = new THREE.MeshStandardMaterial({
    color: matColor,
    metalness: 0.15,
    roughness: 0.4
  });

  currentMesh = new THREE.Mesh(geometry, material);
  
  // Scale Mesh according to user slider
  const s = liveCotizadorState.scalePercent / 100;
  currentMesh.scale.set(s, s, s);

  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  currentMesh.position.y = (size.y * s) / 2 + 5;

  scene.add(currentMesh);
  reset3DCamera();
  updateGeometryMetrics(geometry);
}

function showCanvasSpinner(show) {
  const spinner = document.getElementById('canvas-loader');
  if (spinner) spinner.classList.toggle('hidden', !show);
}

// ==========================================================================
// Interactive Controls & Hourly Rate Engine ($1.500 CLP/hr)
// ==========================================================================

function selectMaterialProp(matKey, element) {
  liveCotizadorState.material = matKey;
  liveCotizadorState.materialName = matKey === 'pla' ? 'PLA Pro Premium' : 'PETG Técnico';

  document.querySelectorAll('.mat-prop-card').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');

  if (currentMesh) {
    currentMesh.material.color.setHex(matKey === 'pla' ? 0xd4af37 : 0x38bdf8);
  }

  updateHourlyPriceCalculation();
}

function updateScaleSlider(val) {
  liveCotizadorState.scalePercent = parseInt(val, 10);
  document.getElementById('scale-val').textContent = `${val} %`;

  if (currentMesh) {
    const s = val / 100;
    currentMesh.scale.set(s, s, s);
  }

  updateDimensionsUI();
  updateHourlyPriceCalculation();
}

function selectLayerRes(resKey, mm, element) {
  liveCotizadorState.layerRes = resKey;
  liveCotizadorState.layerResMm = mm;

  document.querySelectorAll('.res-btn').forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');

  updateHourlyPriceCalculation();
}

function selectInfillLive(percent, element) {
  liveCotizadorState.infill = percent;

  document.querySelectorAll('.infill-pill').forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');

  updateHourlyPriceCalculation();
}

// Calculation Algorithm strictly based on Print Hours * $1.500 CLP/hr
function calculatePrintHoursAndPrice() {
  const scaleRatio = liveCotizadorState.scalePercent / 100;
  const scaledVolumeCm3 = liveCotizadorState.rawVolumeCm3 * Math.pow(scaleRatio, 2.7);

  // Base print speed factors
  // 0.12mm (Alta) takes ~1.5x time vs 0.20mm (Estandar)
  const resFactors = { alta: 1.5, estandar: 1.0, borrador: 0.75 };
  const resFactor = resFactors[liveCotizadorState.layerRes] || 1.0;

  // Infill density factor: 15% -> 1.0, 100% -> 2.2
  const infillFactor = 1.0 + (liveCotizadorState.infill - 15) * 0.014;

  // PETG prints slightly slower for layer adhesion (1.15x)
  const matFactor = liveCotizadorState.material === 'petg' ? 1.15 : 1.0;

  // Print speed estimation: ~12 cm3 / hour base rate
  let estimatedHours = (scaledVolumeCm3 / 12.0) * resFactor * infillFactor * matFactor;

  // Min job print setup time: 2.0 hours
  if (estimatedHours < 2.0) estimatedHours = 2.0;

  estimatedHours = Math.round(estimatedHours * 10) / 10; // Round to 1 decimal

  // Price = Hours * $1.500 CLP
  const totalPrice = Math.round(estimatedHours * HOURLY_RATE_CLP);

  return {
    hours: estimatedHours,
    volumeCm3: Math.round(scaledVolumeCm3 * 10) / 10,
    price: totalPrice
  };
}

function updateHourlyPriceCalculation() {
  const calc = calculatePrintHoursAndPrice();

  document.getElementById('calc-volume').textContent = `${calc.volumeCm3} cm³`;
  document.getElementById('calc-hours').textContent = `${calc.hours} Horas`;
  document.getElementById('calc-mat-name').textContent = liveCotizadorState.materialName;
  document.getElementById('calc-base-rate').textContent = `${calc.hours} hrs x $1.500`;
  document.getElementById('calc-total-price').innerHTML = `${formatCLP(calc.price)} <small>CLP</small>`;
}

function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
}

// Add Custom Quote to Cart
function addLiveQuoteToCart() {
  const calc = calculatePrintHoursAndPrice();
  const quoteItem = {
    id: 'quote_' + Date.now(),
    title: `Cotización 3D (${liveCotizadorState.fileName})`,
    category: 'custom',
    material: liveCotizadorState.materialName,
    scale: `${liveCotizadorState.scalePercent}%`,
    layerRes: `${liveCotizadorState.layerResMm}mm`,
    infill: liveCotizadorState.infill,
    hours: calc.hours,
    price: calc.price,
    qty: 1,
    img: 'assets/dummy13_featured.jpg'
  };

  cart.push(quoteItem);
  saveCart();
  updateCartBadge();
  openCartDrawer();
}

function sendLiveWhatsAppQuote() {
  const calc = calculatePrintHoursAndPrice();
  const scale = liveCotizadorState.scalePercent;
  const scaledX = Math.round(liveCotizadorState.rawDimX * (scale / 100));
  const scaledY = Math.round(liveCotizadorState.rawDimY * (scale / 100));
  const scaledZ = Math.round(liveCotizadorState.rawDimZ * (scale / 100));

  let message = `*💬 COTIZACIÓN LIVE 3D - ARTEDIGITAL3D*\n`;
  message += `==================================\n`;
  message += `• *Archivo 3D:* ${liveCotizadorState.fileName}\n`;
  message += `• *Dimensiones:* ${scaledX} x ${scaledY} x ${scaledZ} mm\n`;
  message += `• *Escala:* ${scale}%\n`;
  message += `• *Material:* ${liveCotizadorState.materialName}\n`;
  message += `• *Resolución Capa:* ${liveCotizadorState.layerResMm} mm (${liveCotizadorState.layerRes.toUpperCase()})\n`;
  message += `• *Relleno (Infill):* ${liveCotizadorState.infill}%\n`;
  message += `• *Tiempo Estimado:* ${calc.hours} Horas\n`;
  message += `==================================\n`;
  message += `*TOTAL ESTIMADO ($1.500/hr):* ${formatCLP(calc.price)} CLP\n\n`;
  message += `Hola ArteDigital3D, adjunto las especificaciones de mi archivo para coordinar la impresión.`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodedMsg}`, '_blank');
}

// ==========================================================================
// Gallery & Cart Drawer System
// ==========================================================================

function renderGallery(filterCategory) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? productsData 
    : productsData.filter(p => p.category === filterCategory);

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-thumb-container">
        <span class="product-badge-tag">${p.badge}</span>
        <img src="${p.img}" alt="${p.title}" class="product-thumb">
      </div>
      <div class="product-details">
        <span class="modal-badge">${p.material}</span>
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-price-row">
          <span class="product-price">${formatCLP(p.price)}</span>
          <button class="btn btn-secondary btn-sm" onclick="openProductModal(${p.id})">
            Ver / Encargar
          </button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === filterCategory);
  });
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    renderGallery(e.target.getAttribute('data-filter'));
  }
});

function openProductModal(productId) {
  const prod = productsData.find(p => p.id === productId);
  if (!prod) return;

  selectedModalProduct = prod;
  modalQty = 1;

  document.getElementById('modal-img').src = prod.img;
  document.getElementById('modal-badge').textContent = prod.material;
  document.getElementById('modal-title').textContent = prod.title;
  document.getElementById('modal-price').textContent = formatCLP(prod.price);
  document.getElementById('modal-desc').textContent = prod.desc;
  document.getElementById('modal-qty').textContent = '1';

  document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function updateModalQty(delta) {
  modalQty += delta;
  if (modalQty < 1) modalQty = 1;
  document.getElementById('modal-qty').textContent = modalQty;
}

function addModalProductToCart() {
  if (!selectedModalProduct) return;

  const colorSelect = document.getElementById('modal-color-select');
  const chosenColor = colorSelect ? colorSelect.value : 'Negro Mate Studio';

  const cartItem = {
    id: 'prod_' + selectedModalProduct.id + '_' + Date.now(),
    title: selectedModalProduct.title,
    category: 'gallery',
    material: selectedModalProduct.material,
    color: chosenColor,
    price: selectedModalProduct.price,
    qty: modalQty,
    img: selectedModalProduct.img
  };

  cart.push(cartItem);
  saveCart();
  updateCartBadge();
  closeProductModal();
  openCartDrawer();
}

function saveCart() {
  localStorage.setItem('ad3d_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cart-badge-count');
  const drawerCount = document.getElementById('cart-drawer-count');
  if (badge) badge.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
}

function openCartDrawer() {
  renderCartItems();
  document.getElementById('cart-drawer-overlay').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer-overlay').classList.remove('active');
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-msg text-center">
        <p style="color: var(--text-muted); margin-bottom: 1rem;">Tu carrito está vacío.</p>
        <a href="#cotizador" class="btn btn-sm btn-primary" onclick="closeCartDrawer()">Ir al Cotizador 3D</a>
      </div>
    `;
    document.getElementById('cart-subtotal-val').textContent = '$0 CLP';
    document.getElementById('cart-total-val').textContent = '$0 CLP';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const meta = item.category === 'custom' 
      ? `Escala: ${item.scale} | ${item.material} | Capa: ${item.layerRes} | Infill: ${item.infill}% (${item.hours} hrs)`
      : `Material: ${item.material} | Color: ${item.color || 'Negro'}`;

    return `
      <div class="cart-item">
        <img src="${item.img}" class="cart-item-img" alt="${item.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">${meta}</div>
          <div class="cart-item-price">${formatCLP(item.price)} x ${item.qty} = ${formatCLP(itemTotal)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem(${idx})" title="Eliminar">&times;</button>
      </div>
    `;
  }).join('');

  document.getElementById('cart-subtotal-val').textContent = formatCLP(total);
  document.getElementById('cart-total-val').textContent = formatCLP(total);
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  let total = 0;
  let message = `*📦 NUEVO PEDIDO / COTIZACIÓN - ARTEDIGITAL3D*\n`;
  message += `==================================\n\n`;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `*${i + 1}. ${item.title}*\n`;
    message += `   • Cantidad: ${item.qty}\n`;
    message += `   • Precio: ${formatCLP(item.price)} c/u\n`;
    if (item.category === 'custom') {
      message += `   • Especificaciones: Escala ${item.scale} | ${item.material} | Capa ${item.layerRes} | Infill ${item.infill}% (${item.hours} hrs)\n`;
    } else {
      message += `   • Material: ${item.material}\n`;
      message += `   • Color: ${item.color || 'Negro'}\n`;
    }
    message += `   • Subtotal: ${formatCLP(itemTotal)}\n\n`;
  });

  message += `==================================\n`;
  message += `*TOTAL ESTIMADO ($1.500/hr):* ${formatCLP(total)} CLP\n`;
  message += `\n*Por favor indicar datos para despacho o retiro.*`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodedMsg}`, '_blank');
}

document.getElementById('open-cart-btn')?.addEventListener('click', openCartDrawer);

function toggleFaq(buttonElement) {
  const faqItem = buttonElement.parentElement;
  faqItem.classList.toggle('active');
}

// Mobile Hamburger Menu Interactions
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
});

// ==========================================================================
// Marketplace de Diseñadores 3D Logic
// ==========================================================================

function renderMarketplace(filterCategory, searchWord = '') {
  const grid = document.getElementById('marketplace-grid');
  if (!grid) return;

  const searchLower = searchWord.toLowerCase().trim();

  const filtered = marketplaceData.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !searchLower || 
      item.title.toLowerCase().includes(searchLower) ||
      item.author.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>No se encontraron modelos con los criterios de búsqueda.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="model-card">
      <div class="model-thumb-box">
        <span class="model-badge ${item.badge}">${item.badgeText}</span>
        <img src="${item.img}" alt="${item.title}">
      </div>
      <div class="model-details">
        <span class="model-category">${item.category}</span>
        <h3 class="model-title">${item.title}</h3>
        <span class="model-author">por @${item.author}</span>
        
        <div class="model-footer">
          <div class="model-price-box">
            <span>Impresión desde</span>
            <strong>${formatCLP(item.price)}</strong>
          </div>
          <button class="btn btn-primary btn-sm shadow-gold" onclick="loadMarketplaceModelToCotizador(${item.id})">
            Imprimir Ahora
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderDesignersRanking() {
  const container = document.getElementById('designers-ranking-list');
  if (!container) return;

  container.innerHTML = designersRanking.map(d => `
    <div class="ranking-item">
      <div class="rank-number">${d.rank}</div>
      <div class="rank-details">
        <div class="rank-name">@${d.name}</div>
        <div class="rank-stats">${d.sales} impresiones realizadas</div>
      </div>
    </div>
  `).join('');
}

function setupMarketplaceSearchAndFilters() {
  const searchInput = document.getElementById('marketplace-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.m-filter-btn.active')?.getAttribute('data-mfilter') || 'all';
      renderMarketplace(activeFilter, e.target.value);
    });
  }

  const filterContainer = document.querySelector('.marketplace-category-filter');
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('m-filter-btn')) {
        document.querySelectorAll('.m-filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-mfilter');
        const searchValue = searchInput ? searchInput.value : '';
        renderMarketplace(filter, searchValue);
      }
    });
  }
}

// Action: Load Marketplace Model into Live 3D Visualizer & Go to Cotizador
function loadMarketplaceModelToCotizador(itemId) {
  const item = marketplaceData.find(m => m.id === itemId);
  if (!item) return;

  // Set Visualizer State
  liveCotizadorState.fileName = item.fileName;
  
  // Set calculated base volume randomly based on design to simulate unique 3D geometries
  const mockVolumes = { 101: 52.0, 102: 85.0, 103: 135.0, 104: 190.0, 105: 68.0, 106: 78.0, 107: 145.0 };
  const mockDims = {
    101: { x: 45, y: 45, z: 90 },
    102: { x: 75, y: 110, z: 65 },
    103: { x: 95, y: 135, z: 80 },
    104: { x: 120, y: 140, z: 90 },
    105: { x: 60, y: 60, z: 75 },
    106: { x: 70, y: 70, z: 120 },
    107: { x: 90, y: 90, z: 160 }
  };

  liveCotizadorState.rawVolumeCm3 = mockVolumes[itemId] || 60.0;
  liveCotizadorState.rawDimX = mockDims[itemId]?.x || 60;
  liveCotizadorState.rawDimY = mockDims[itemId]?.y || 60;
  liveCotizadorState.rawDimZ = mockDims[itemId]?.z || 80;

  // Simulate rendering different geometrical shapes representing the model
  if (currentMesh && scene) {
    scene.remove(currentMesh);
    let newGeo;
    if (itemId === 101 || itemId === 105) {
      // Cylinder/Cone representing vase/cactus/colmena
      newGeo = new THREE.CylinderGeometry(15, 20, 45, 6);
    } else if (itemId === 107) {
      // Hexagonal capsule shape for the ball dispenser
      newGeo = new THREE.CylinderGeometry(18, 18, 55, 6);
    } else if (itemId === 103 || itemId === 104) {
      // Complex TorusKnot / Icosahedron representing mask/dragon
      newGeo = new THREE.TorusKnotGeometry(18, 5, 100, 16);
    } else {
      // Box representing gaming supports
      newGeo = new THREE.BoxGeometry(35, 35, 35);
    }

    newGeo.center();
    const matColor = liveCotizadorState.material === 'pla' ? 0xd4af37 : 0x38bdf8;
    const material = new THREE.MeshStandardMaterial({
      color: matColor,
      metalness: 0.2,
      roughness: 0.35
    });

    currentMesh = new THREE.Mesh(newGeo, material);
    const s = liveCotizadorState.scalePercent / 100;
    currentMesh.scale.set(s, s, s);
    currentMesh.position.y = (35 * s) / 2 + 5;
    scene.add(currentMesh);
    reset3DCamera();
  }

  // Update UI and perform calculation
  updateDimensionsUI();
  updateHourlyPriceCalculation();

  // Scroll smoothly to visualizer cotizador section
  const cotizadorSection = document.getElementById('cotizador');
  if (cotizadorSection) {
    cotizadorSection.scrollIntoView({ behavior: 'smooth' });
    
    // Quick notification animation on dropzone
    const dropzone = document.getElementById('dropzone-box');
    if (dropzone) {
      dropzone.style.borderColor = 'var(--accent-cyan)';
      setTimeout(() => {
        dropzone.style.borderColor = 'var(--accent-gold)';
      }, 1000);
    }
  }
}

// Creator Signup Modal Functions
function openDesignerModal() {
  const modal = document.getElementById('designer-modal');
  if (modal) modal.classList.add('active');
}

function closeDesignerModal() {
  const modal = document.getElementById('designer-modal');
  if (modal) modal.classList.remove('active');
}

function handleDesignerSignup(event) {
  event.preventDefault();
  alert('¡Gracias por postular! Tu solicitud ha sido enviada con éxito. Nuestro equipo revisará tu portafolio y te contactará por correo electrónico dentro de las próximas 48 horas.');
  closeDesignerModal();
  event.target.reset();
}
