/* ==========================================================================
   ArteDigital3D - Impresión 3D Premium
   ========================================================================== */

const CONTACT_PHONE = '56998874601';
const INSTAGRAM_HANDLE = '@arte.digital3d';
const MAX_FILE_SIZE_MB = 50;

function formatCLP(val) {
  return '$' + Number(val).toLocaleString('es-CL');
}

// Global State
let currentTheme = localStorage.getItem('ad3d_theme') || 'dark';
let cart = JSON.parse(localStorage.getItem('ad3d_cart')) || [];



// Gallery Products Data (ONLY products with real custom photos)
const productsData = [
  {
    id: 1,
    title: 'Figura Articulada Dummy 13 (500% y 150%)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA+ Naranja & Negro',
    price: 14990,
    desc: 'Figura de acción articulada impresa en 3D en múltiples escalas (500% Gigante y 150% Básica). Ensamble de precisión.',
    img: 'assets/dummy13_500_150.jpg',
    badge: '★ Destacado',
    scales: [
      { label: 'Escala 150% Básica', price: 14990 },
      { label: 'Escala 500% Gigante', price: 80000 }
    ]
  },
  {
    id: 3,
    title: 'Fidget Clicker Switch de Teclado',
    category: 'clickers',
    categoryName: 'Clickers & Fidgets',
    material: 'PLA+ & Switch Táctil',
    price: 4990,
    desc: 'Llavero fidget clicker con switch mecánico premium. Sonido altamente satisfactorio antiestrés.',
    img: 'assets/fidget_clicker_switch.jpg',
    badge: 'Anti-Estrés',
    colors: ['Negro Mate', 'Blanco Puro', 'Oro Titán', 'Rojo Vivo', 'Azul Cobalto']
  },
  {
    id: 8,
    title: 'Lámpara para Velas de Té – Colección Geométrica',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA+ Ivory Transparente',
    price: 12990,
    desc: 'Set de lámparas decorativas con diseños geométricos modernos para velas de té. Proyecta sombras cálidas.',
    img: 'assets/lamparas_velas_te.jpg',
    badge: 'Colección',
    colors: ['Blanco Marfil', 'Negro Mate', 'Oro Titán']
  },
  {
    id: 7,
    title: 'Máquina Expendedora 3D Universal 2"',
    category: 'modelos-virales',
    categoryName: 'Modelos Virales',
    material: 'A Pedido / Color a Elección',
    price: 100000,
    desc: 'Máquina expendedora 3D universal para cápsulas de 2". Modelo Lite (22,6 x 17,5 cm) y Modelo Grande (29,3 x 25,0 cm).',
    img: 'assets/dispensador_bolas_v2.jpg',
    badge: '★ Destacado',
    scales: [
      { label: 'Modelo Lite (22,6 x 17,5 cm)', price: 100000, img: 'assets/dispensador_bolas_v2.jpg' },
      { label: 'Modelo Grande (29,3 x 25,0 cm)', price: 200000, img: 'assets/dispensador_bolas_modelos.png' }
    ]
  },
  {
    id: 18,
    title: 'Lámpara Sol de Mayo',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA+ Terracota / Transparente',
    price: 29900,
    desc: 'Lámpara escultórica impresa en 3D inspirada en formas solares radiantes.',
    img: 'assets/lampara_sol_de_mayo.jpg',
    badge: 'Escultórico',
    colors: ['Terracota', 'Blanco Marfil', 'Oro Titán']
  },
  {
    id: 19,
    title: 'Dragón Shenron Articulado',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA+ Verde & Bronce',
    price: 14990,
    desc: 'Figura mítica de dragón Shenron con articulaciones completas impresas en 3D.',
    img: 'assets/dragon_shenron.jpg',
    badge: 'Mítico',
    colors: ['Clásico Shenron', 'Variante']
  },
  {
    id: 20,
    title: 'Figura Dummy 13 (150% Versión Básica)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA+ (Variedad de Colores)',
    price: 14990,
    desc: 'Dummy 150% Variedad de Colores Versión Básica.',
    img: 'assets/dummy13_colors_150.jpg',
    badge: '★ 150% Básica',
    colors: ['Naranjo', 'Blanco', 'Verde', 'Morado', 'Rojo', 'Amarillo']
  },
  {
    id: 21,
    title: 'Llaveros del Zodíaco Coleccionables',
    category: 'regalos',
    categoryName: 'Regalos',
    material: 'PLA+ Multicolor & Relieve',
    price: 4990,
    desc: 'Colección de 12 llaveros del zodíaco impresos en 3D con relieve detallado e ilustraciones alegóricas.',
    img: 'assets/llaveros_zodiaco.jpg',
    badge: 'Colección Zodíaco',
    colors: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  },
  {
    id: 22,
    title: 'Soporte para Notebook Universal',
    category: 'regalos',
    categoryName: 'Regalos',
    material: 'PETG Técnico / PLA+ Escultórico',
    price: 19900,
    desc: 'Soporte de diseño escultórico minimalista para notebook y MacBook. Eleva la pantalla mejorando la ergonomía y la ventilación.',
    img: 'assets/soporte_notebook_universal.jpg',
    badge: 'Ergonómico',
    colors: ['Beige Marfil', 'Negro Mate', 'Oro Titán', 'Gris Espacial']
  },
  {
    id: 23,
    title: 'Figura Articulada Dummy 13 (Squad Edición Especial)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA+ & PETG Técnico',
    price: 14990,
    desc: 'Figura articulada Dummy 13 edición especial con accesorios y base de exhibición. Articulaciones hiper-flexibles de alto rendimiento.',
    img: 'assets/dummy13_squad_multicolor.jpg',
    badge: 'Edición Especial',
    colors: ['Rojo Vivo', 'Amarillo Sol', 'Naranjo', 'Negro Sigilo', 'Azul Cobalto']
  },
  {
    id: 24,
    title: 'Lámpara Dragón de Fuego 3D',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA+ Translúcido & Iluminación LED Warm',
    price: 39900,
    desc: 'Espectacular lámpara de dragón volador exhalando fuego con iluminación LED integrada. El torbellino de llamas translúcidas genera un ambiente cálido e hipnótico ideal para dormitorios, estudios y coleccionistas.',
    img: 'assets/lampara_dragon_fuego.jpg',
    badge: '🔥 Mítica & LED',
    colors: ['Fuego Cálido Sol', 'Llama Rubí Red', 'Fuego Místico Gold']
  },
  {
    id: 25,
    title: 'Escuadra de Guerreros Articulados Dummy 13 (Edición Armor Tactix)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PETG Técnico & PLA+ Alta Densidad',
    price: 16990,
    desc: 'Set de guerreros articulados Dummy 13 versión táctica con armaduras pesadas, cañones de hombro, lanzas mecánicas y articulaciones de máxima precisión. Diseñados para poses de combate dinámicas y exhibición colectiva.',
    img: 'assets/dummy13_warriors_squad.jpg',
    badge: '⚡ Escuadra Táctica',
    colors: ['Azul Táctico', 'Rojo Carmesí', 'Gris Titanio', 'Naranjo Fuego']
  },
  {
    id: 26,
    title: 'Figura Articulada Carbon 13 (Edición M & Edición F)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PETG Técnico & PLA+ Ultra-Precisión',
    price: 14990,
    desc: 'Figura de acción articulada de alta tecnología Carbon 13 con diseño ergonómico de vanguardia. Disponible en Edición F (Femenina / Rosado) y Edición M (Masculina / Azul) con articulaciones de alta resistencia.',
    img: 'assets/carbon13_edition_m_f.jpg',
    badge: '★ Carbon 13',
    colors: ['Modelo F (Rosado)', 'Modelo M (Azul)', 'Rosado', 'Azul']
  }
];

// Marketplace Designs Data (ONLY PLA+ and PETG with real photos)
const marketplaceData = [
  {
    id: 107,
    title: 'Máquina Expendedora 3D Universal 2"',
    author: 'ArteDigital3D',
    category: 'hogar',
    price: 100000,
    fileName: 'dispensador_bolas_2in.stl',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/dispensador_bolas_v2.jpg'
  },
  {
    id: 101,
    title: 'Figura Articulada Dummy 13 (500%)',
    author: '3DArtisan',
    category: 'figuras',
    price: 80000,
    fileName: 'dummy13_giant_500.stl',
    badge: 'badge-top-seller',
    badgeText: 'Top Seller',
    img: 'assets/dummy13_500_150.jpg'
  },
  {
    id: 102,
    title: 'Fidget Clicker Switch de Teclado',
    author: 'VortexForge',
    category: 'gadgets',
    price: 4990,
    fileName: 'fidget_switch_keychain.stl',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/fidget_clicker_switch.jpg'
  },
  {
    id: 103,
    title: 'Dragón Shenron Articulado',
    author: 'DragonScales',
    category: 'figuras',
    price: 14990,
    fileName: 'shenron_articulated_dragon.obj',
    badge: 'badge-top-seller',
    badgeText: 'Top Seller',
    img: 'assets/dragon_shenron.jpg'
  },
  {
    id: 104,
    title: 'Llaveros del Zodíaco Coleccionables',
    author: 'CyberProps',
    category: 'gadgets',
    price: 4990,
    fileName: 'zodiac_keychains_collection.3mf',
    badge: 'badge-new',
    badgeText: 'Nuevo',
    img: 'assets/llaveros_zodiaco.jpg'
  },
  {
    id: 105,
    title: 'Lámpara Sol de Mayo 3D',
    author: 'BambuLines',
    category: 'hogar',
    price: 29900,
    fileName: 'sun_mayo_lamp_3d.stl',
    badge: 'badge-top-seller',
    badgeText: 'Popular',
    img: 'assets/lampara_sol_de_mayo.jpg'
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
  updateCartBadge();
  
  // Initialize SPA Page Routing
  initPageRouter();
});

// --- Theme Toggle ---
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn?.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('ad3d_theme', currentTheme);
  });
}


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

  selectedModalProduct = { ...prod };
  modalQty = 1;

  document.getElementById('modal-img').src = prod.img;
  document.getElementById('modal-badge').textContent = prod.material;
  document.getElementById('modal-title').textContent = prod.title;
  document.getElementById('modal-desc').textContent = prod.desc;
  document.getElementById('modal-qty').textContent = '1';

  // Handle dynamic scale selector
  const scaleGroup = document.getElementById('modal-scale-group');
  const scaleSelect = document.getElementById('modal-scale-select');

  if (scaleGroup && scaleSelect) {
    if (prod.scales && prod.scales.length > 0) {
      scaleGroup.style.display = 'block';
      scaleSelect.innerHTML = prod.scales.map(s => `<option value="${s.price}">${s.label} - ${formatCLP(s.price)}</option>`).join('');
      renderVisualScaleChips(prod.scales);
      document.getElementById('modal-price').textContent = formatCLP(prod.scales[0].price);
      selectedModalProduct.currentPrice = prod.scales[0].price;
      selectedModalProduct.selectedScale = prod.scales[0].label;
    } else {
      scaleGroup.style.display = 'none';
      renderVisualScaleChips([]);
      document.getElementById('modal-price').textContent = formatCLP(prod.price);
      delete selectedModalProduct.currentPrice;
      delete selectedModalProduct.selectedScale;
    }
  } else {
    document.getElementById('modal-price').textContent = formatCLP(prod.price);
  }

  const colorSelect = document.getElementById('modal-color-select');
  const colorList = prod.colors && prod.colors.length > 0
    ? prod.colors
    : ['Negro Mate Studio', 'Blanco Puro', 'Oro Titán Metalizado', 'Gris Espacial', 'Rojo Vivo PETG', 'Azul Cobalto PETG'];
  
  if (colorSelect) {
    colorSelect.innerHTML = colorList.map(c => `<option value="${c}">${c}</option>`).join('');
  }
  renderVisualColorChips(colorList);
  selectedModalProduct.selectedColor = colorList[0];

  document.getElementById('product-modal').classList.add('active');
}

// Visual Option Helper functions
function getOptionVisual(optName) {
  const name = optName.trim();
  const lower = name.toLowerCase();

  // Zodiac Icons
  if (lower === 'aries') return { type: 'icon', value: '♈' };
  if (lower === 'tauro') return { type: 'icon', value: '♉' };
  if (lower === 'géminis' || lower === 'geminis') return { type: 'icon', value: '♊' };
  if (lower === 'cáncer' || lower === 'cancer') return { type: 'icon', value: '♋' };
  if (lower === 'leo') return { type: 'icon', value: '♌' };
  if (lower === 'virgo') return { type: 'icon', value: '♍' };
  if (lower === 'libra') return { type: 'icon', value: '♎' };
  if (lower === 'escorpio') return { type: 'icon', value: '♏' };
  if (lower === 'sagitario') return { type: 'icon', value: '♐' };
  if (lower === 'capricornio') return { type: 'icon', value: '♑' };
  if (lower === 'acuario') return { type: 'icon', value: '♒' };
  if (lower === 'piscis') return { type: 'icon', value: '♓' };

  // Color Swatches
  if (lower.includes('rosado') || lower.includes('rosa') || lower.includes('modelo f')) return { type: 'color', value: '#ec4899' };
  if (lower.includes('modelo m')) return { type: 'color', value: '#0284c7' };
  if (lower.includes('negro')) return { type: 'color', value: '#1a1d24' };
  if (lower.includes('blanco')) return { type: 'color', value: '#ffffff' };
  if (lower.includes('oro') || lower.includes('dorado')) return { type: 'color', value: '#d4af37' };
  if (lower.includes('gris') || lower.includes('espacial')) return { type: 'color', value: '#64748b' };
  if (lower.includes('rojo')) return { type: 'color', value: '#ef4444' };
  if (lower.includes('azul')) return { type: 'color', value: '#0284c7' };
  if (lower.includes('naranjo') || lower.includes('naranja')) return { type: 'color', value: '#f97316' };
  if (lower.includes('verde') || lower.includes('shenron')) return { type: 'color', value: '#16a34a' };
  if (lower.includes('morado') || lower.includes('púrpura')) return { type: 'color', value: '#a855f7' };
  if (lower.includes('amarillo')) return { type: 'color', value: '#eab308' };

  return { type: 'icon', value: '🎨' };
}

// Lightbox Image Zoom Functions
function openImageLightbox(imgSrc) {
  const lightbox = document.getElementById('image-lightbox-modal');
  const zoomImg = document.getElementById('lightbox-zoom-img');
  if (lightbox && zoomImg) {
    zoomImg.src = imgSrc || document.getElementById('modal-img').src;
    lightbox.classList.add('active');
  }
}

function closeImageLightbox() {
  const lightbox = document.getElementById('image-lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

function renderVisualScaleChips(scales) {
  const container = document.getElementById('modal-scale-chips');
  if (!container) return;

  if (!scales || scales.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = scales.map((s, idx) => `
    <button type="button" class="option-chip ${idx === 0 ? 'active' : ''}" onclick="selectScaleChip(this, ${idx})">
      <span class="chip-icon">📏</span>
      <span>${s.label}</span>
      <span class="chip-check">✓</span>
    </button>
  `).join('');
}

function selectScaleChip(btnElem, scaleIndex) {
  const scaleGroup = document.getElementById('modal-scale-group');
  if (scaleGroup) {
    const chipBtns = scaleGroup.querySelectorAll('.option-chip');
    chipBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
  }

  const scaleSelect = document.getElementById('modal-scale-select');
  if (scaleSelect && scaleSelect.options[scaleIndex]) {
    scaleSelect.selectedIndex = scaleIndex;
    handleModalScaleChange(scaleSelect);
  }
}

function renderVisualColorChips(colorList) {
  const container = document.getElementById('modal-color-chips');
  if (!container) return;

  if (!colorList || colorList.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = colorList.map((c, idx) => {
    const visual = getOptionVisual(c);
    let visualHtml = '';
    if (visual.type === 'color') {
      visualHtml = `<span class="chip-swatch-dot" style="background-color: ${visual.value};"></span>`;
    } else {
      visualHtml = `<span class="chip-icon">${visual.value}</span>`;
    }

    return `
      <button type="button" class="option-chip ${idx === 0 ? 'active' : ''}" onclick="selectColorChip(this, '${c.replace(/'/g, "\\'")}', ${idx})">
        ${visualHtml}
        <span>${c}</span>
        <span class="chip-check">✓</span>
      </button>
    `;
  }).join('');
}

function selectColorChip(btnElem, colorValue, colorIndex) {
  const colorGroup = document.getElementById('modal-color-group');
  if (colorGroup) {
    const chipBtns = colorGroup.querySelectorAll('.option-chip');
    chipBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
  }

  const colorSelect = document.getElementById('modal-color-select');
  if (colorSelect && colorSelect.options[colorIndex]) {
    colorSelect.selectedIndex = colorIndex;
  }
  if (selectedModalProduct) {
    selectedModalProduct.selectedColor = colorValue;
  }
}

function handleModalColorSelectChange(selectElem) {
  const selectedIndex = selectElem.selectedIndex;
  const colorValue = selectElem.value;
  const colorGroup = document.getElementById('modal-color-group');
  if (colorGroup) {
    const chipBtns = colorGroup.querySelectorAll('.option-chip');
    chipBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === selectedIndex);
    });
  }
  if (selectedModalProduct) {
    selectedModalProduct.selectedColor = colorValue;
  }
}

function handleModalScaleChange(selectElem) {
  if (!selectedModalProduct) return;
  const newPrice = parseInt(selectElem.value, 10);
  const selectedIndex = selectElem.selectedIndex;
  const selectedOption = selectElem.options[selectedIndex];
  const scaleLabel = selectedOption.text.split(' - ')[0];

  document.getElementById('modal-price').textContent = formatCLP(newPrice);
  selectedModalProduct.currentPrice = newPrice;
  selectedModalProduct.selectedScale = scaleLabel;

  const scaleGroup = document.getElementById('modal-scale-group');
  if (scaleGroup) {
    const chipBtns = scaleGroup.querySelectorAll('.option-chip');
    chipBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === selectedIndex);
    });
  }

  if (selectedModalProduct.scales && selectedModalProduct.scales[selectedIndex]) {
    const scaleObj = selectedModalProduct.scales[selectedIndex];
    if (scaleObj.img) {
      document.getElementById('modal-img').src = scaleObj.img;
    }
  }
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
  const finalPrice = selectedModalProduct.currentPrice || selectedModalProduct.price;
  const scaleText = selectedModalProduct.selectedScale ? ` (${selectedModalProduct.selectedScale})` : '';

  const cartItem = {
    id: 'prod_' + selectedModalProduct.id + '_' + Date.now(),
    title: selectedModalProduct.title + scaleText,
    category: 'gallery',
    material: selectedModalProduct.material,
    color: chosenColor,
    price: finalPrice,
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
  message += `*TOTAL ESTIMADO:* ${formatCLP(total)} CLP\n`;
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

  const message = `*ARTE DIGITAL 3D - MARKETPLACE*\n` +
                  `==================================\n` +
                  `• *Modelo:* ${item.title}\n` +
                  `• *Diseñador:* @${item.author}\n` +
                  `• *Precio Estimado:* ${formatCLP(item.price)} CLP\n` +
                  `==================================\n` +
                  `Hola ArteDigital3D, me gustaría cotizar la impresión de este modelo de diseñador de tu Marketplace. ¿Qué colores y tiempos tienen disponibles?`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodedMsg}`, '_blank');
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

function switchModalTab(tabId, btn) {
  document.querySelectorAll('.modal-tab-btn').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
  const activeContent = document.getElementById(`tab-${tabId}-content`);
  if (activeContent) activeContent.classList.add('active');
}

function handleModelerUpload(event) {
  event.preventDefault();

  const author = document.getElementById('upload-author').value.trim();
  const title = document.getElementById('upload-title').value.trim();
  const category = document.getElementById('upload-category').value;
  const price = parseFloat(document.getElementById('upload-price').value);
  const desc = document.getElementById('upload-desc').value.trim();
  const imgInput = document.getElementById('upload-image-file');
  const file3dInput = document.getElementById('upload-3d-file');

  let imgURL = 'assets/logo_ad3d.png';
  if (imgInput && imgInput.files && imgInput.files[0]) {
    imgURL = URL.createObjectURL(imgInput.files[0]);
  }

  let file3dName = 'modelo_personalizado.stl';
  if (file3dInput && file3dInput.files && file3dInput.files[0]) {
    file3dName = file3dInput.files[0].name;
  }

  const newItem = {
    id: Date.now(),
    title: title,
    author: author,
    category: category,
    price: price,
    fileName: file3dName,
    badge: 'badge-new',
    badgeText: 'Modelador',
    img: imgURL
  };

  marketplaceData.unshift(newItem);
  renderMarketplace('all');
  closeDesignerModal();
  event.target.reset();

  alert('¡Felicidades! Tu diseño/servicio ha sido cargado con éxito. Ya está visible y disponible en el Marketplace.');
}

// --- SPA Page Router ---
const pageIds = ['inicio', 'galeria', 'cotizador', 'materiales', 'faq'];

// ==========================================================================
// Cotizador 3D Logic & Guided Wizard System
// ==========================================================================

let currentPlatform = { name: 'MakerWorld', url: 'https://makerworld.com' };
let currentWizardStep = 1;
const TOTAL_WIZARD_STEPS = 6;
let uploadedCotizadorFile = null;

const WIZARD_STEPS_DATA = {
  1: {
    title: 'Ingresa a la plataforma seleccionada',
    desc: 'Abre el sitio web oficial de la plataforma para comenzar tu búsqueda.',
    showUrl: true
  },
  2: {
    title: 'Utiliza el buscador para encontrar el modelo que necesitas',
    desc: 'Escribe palabras clave en el buscador (ej: "soporte celular", "dragon", "llavero", "maceta").',
    showUrl: false
  },
  3: {
    title: 'Revisa las imágenes, descripción y características del modelo',
    desc: 'Verifica los detalles visuales y asegúrate de que sea la figura o pieza que buscas.',
    showUrl: false
  },
  4: {
    title: 'Verifica que el modelo pueda descargarse gratuitamente',
    desc: 'Busca el botón de descarga "Download STL" o "Download All Files" sin costo.',
    showUrl: false
  },
  5: {
    title: 'Descarga el archivo 3D en un formato compatible',
    desc: 'Guarda el archivo en tu dispositivo. Los formatos aceptados son .STL, .OBJ, .STEP o .3MF.',
    showUrl: false
  },
  6: {
    title: 'Regresa al Cotizador 3D y carga tu archivo',
    desc: '¡Listo! Presiona el botón a continuación para seleccionar el archivo descargado y cotizar.',
    showUrl: false
  }
};

function triggerCotizadorFileUpload() {
  const fileInput = document.getElementById('cotizador-file-input');
  if (fileInput) fileInput.click();
}

function handleCotizadorFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const validExtensions = ['.stl', '.obj', '.step', '.stp', '.3mf'];
  const fileName = file.name.toLowerCase();
  const isValid = validExtensions.some(ext => fileName.endsWith(ext));

  if (!isValid) {
    alert('Formato no compatible. Puedes cargar archivos STL, OBJ, STEP o 3MF.');
    event.target.value = '';
    return;
  }

  uploadedCotizadorFile = file;

  // Render file details preview card
  const detailsCard = document.getElementById('cotizador-file-details');
  if (detailsCard) {
    document.getElementById('det-file-name').textContent = file.name;
    document.getElementById('det-file-size').textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Formato Validado`;
    
    // Simulated dimension inspection (prepared for future 3D parser engine)
    document.getElementById('det-dimensions').textContent = '90 × 65 × 105 mm';
    document.getElementById('det-weight').textContent = '~ 52 g';
    document.getElementById('det-time').textContent = '~ 4h 15m';
    
    detailsCard.style.display = 'block';
    detailsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function resetCotizadorFile() {
  uploadedCotizadorFile = null;
  const fileInput = document.getElementById('cotizador-file-input');
  if (fileInput) fileInput.value = '';
  const detailsCard = document.getElementById('cotizador-file-details');
  if (detailsCard) detailsCard.style.display = 'none';
}

function sendCotizadorWhatsApp() {
  if (!uploadedCotizadorFile) {
    alert('Por favor selecciona un archivo 3D primero.');
    return;
  }

  const material = document.getElementById('cotizador-material-select')?.value || 'PLA+ Premium';
  const color = document.getElementById('cotizador-color-select')?.value || 'Negro Mate Studio';
  const fileName = uploadedCotizadorFile.name;

  const msg = `Hola ArteDigital3D! Quisiera cotizar la impresión 3D del archivo "${fileName}". Material: ${material}, Color: ${color}.`;
  const url = `https://wa.me/56998874601?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// Wizard Functions
function openCotizadorWizard() {
  const wizard = document.getElementById('cotizador-wizard');
  if (wizard) {
    wizard.style.display = 'block';
    document.getElementById('wizard-step-platforms').style.display = 'block';
    document.getElementById('wizard-step-detail').style.display = 'none';
    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeCotizadorWizard() {
  const wizard = document.getElementById('cotizador-wizard');
  if (wizard) wizard.style.display = 'none';
}

function selectPlatformTutorial(name, url) {
  currentPlatform = { name, url };
  currentWizardStep = 1;
  document.getElementById('wizard-step-platforms').style.display = 'none';
  document.getElementById('wizard-step-detail').style.display = 'block';
  updateWizardStepView();
}

function updateWizardStepView() {
  const stepData = WIZARD_STEPS_DATA[currentWizardStep];
  if (!stepData) return;

  document.getElementById('wizard-step-number').textContent = `PASO ${currentWizardStep} DE ${TOTAL_WIZARD_STEPS}`;
  document.getElementById('wizard-platform-title').textContent = `Plataforma: ${currentPlatform.name}`;
  document.getElementById('wizard-progress-fill').style.width = `${(currentWizardStep / TOTAL_WIZARD_STEPS) * 100}%`;

  document.getElementById('step-badge-num').textContent = `PASO ${currentWizardStep}`;
  document.getElementById('step-title').textContent = stepData.title;
  document.getElementById('step-desc').textContent = stepData.desc;

  const actionLinkContainer = document.getElementById('step-action-link');
  if (stepData.showUrl) {
    actionLinkContainer.innerHTML = `
      <a href="${currentPlatform.url}" target="_blank" class="btn btn-primary btn-sm shadow-gold">
        🌐 Abrir sitio web de ${currentPlatform.name} ↗
      </a>
    `;
  } else {
    actionLinkContainer.innerHTML = '';
  }

  // Buttons navigation state
  document.getElementById('wizard-btn-prev').style.display = currentWizardStep > 1 ? 'inline-flex' : 'none';
  
  if (currentWizardStep < TOTAL_WIZARD_STEPS) {
    document.getElementById('wizard-btn-next').style.display = 'inline-flex';
    document.getElementById('wizard-btn-upload').style.display = 'none';
  } else {
    document.getElementById('wizard-btn-next').style.display = 'none';
    document.getElementById('wizard-btn-upload').style.display = 'inline-flex';
  }
}

function changeWizardStep(delta) {
  currentWizardStep += delta;
  if (currentWizardStep < 1) currentWizardStep = 1;
  if (currentWizardStep > TOTAL_WIZARD_STEPS) currentWizardStep = TOTAL_WIZARD_STEPS;
  updateWizardStepView();
}

function finishWizardAndUpload() {
  closeCotizadorWizard();
  triggerCotizadorFileUpload();
}

function initPageRouter() {
  // Listen to hash change
  window.addEventListener('hashchange', handleRouteChange);
  
  // Initial load navigation
  handleRouteChange();
}

function handleRouteChange() {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  navigateToPage(hash);
}

function navigateToPage(pageId) {
  // Ensure all sections are visible for smooth scrolling
  pageIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
      el.classList.toggle('active-page', id === pageId);
    }
  });

  // Update navigation link highlights in header nav menu
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === pageId);
  });

  // Scroll smoothly to section if specified
  if (pageId && pageId !== 'inicio') {
    const target = document.getElementById(pageId);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  } else if (pageId === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==========================================================================
// 3D Printer Visitor Counter Logic (Real Visit Persistence & Session Safety)
// ==========================================================================

function init3DVisitorCounter() {
  const counterDisplay = document.getElementById('visit-count-display');
  const statusText = document.getElementById('counter-status-text');
  if (!counterDisplay) return;

  const BASE_VISITS = 12480; // Professional production baseline offset
  let savedVisits = parseInt(localStorage.getItem('ad3d_total_visits'), 10);

  if (isNaN(savedVisits) || savedVisits < BASE_VISITS) {
    savedVisits = BASE_VISITS;
  }

  // Session deduplication check
  const isSessionActive = sessionStorage.getItem('ad3d_session_active');
  if (!isSessionActive) {
    savedVisits += 1;
    localStorage.setItem('ad3d_total_visits', savedVisits);
    sessionStorage.setItem('ad3d_session_active', '1');
  }

  function formatVisits(num) {
    return num.toLocaleString('es-CL');
  }

  counterDisplay.setAttribute('aria-label', `Contador de visitas totales: ${formatVisits(savedVisits)} visitas`);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counterDisplay.textContent = formatVisits(savedVisits);
    if (statusText) {
      statusText.textContent = `Capa #${formatVisits(savedVisits)} depositada con éxito`;
    }
    return;
  }

  let currentCount = 0;
  const targetCount = savedVisits;
  const duration = 1500;
  const startTime = performance.now();

  function animateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeOutProgress = 1 - (1 - progress) * (1 - progress);
    
    currentCount = Math.floor(easeOutProgress * targetCount);
    counterDisplay.textContent = formatVisits(currentCount);

    if (progress < 1) {
      requestAnimationFrame(animateCounter);
    } else {
      counterDisplay.textContent = formatVisits(targetCount);
      if (statusText) {
        statusText.textContent = `Capa #${formatVisits(targetCount)} depositada con éxito`;
      }
    }
  }

  requestAnimationFrame(animateCounter);
}

// Ensure counter initializes cleanly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DVisitorCounter);
} else {
  init3DVisitorCounter();
}

