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



// Gallery Products Data
const productsData = [
  {
    id: 1,
    title: 'Figura Articulada Dummy 13 (500% y 150%)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA Pro Naranja & Negro',
    price: 14990,
    desc: 'Figura de acción articulada impresa en 3D en múltiples escalas (500% Gigante y 150% Básica). Ensamble de precisión con articulaciones ultra resistentes.',
    img: 'assets/dummy13_500_150.jpg',
    badge: '★ Destacado',
    scales: [
      { label: 'Escala 150%', price: 14990 },
      { label: 'Escala 500% (Gigante)', price: 80000 }
    ]
  },

  {
    id: 3,
    title: 'Fidget Clicker Switch de Teclado',
    category: 'clickers',
    categoryName: 'Clickers & Fidgets',
    material: 'PLA Pro & Switch Táctil',
    price: 4990,
    desc: 'Llavero fidget clicker con switch mecánico premium. Sonido altamente satisfactorio ideal para aliviar el estrés.',
    img: 'assets/logo_ad3d.png',
    badge: 'Anti-Estrés'
  },
  {
    id: 4,
    title: 'Clicker Mecánico de Engranajes',
    category: 'clickers',
    categoryName: 'Clickers & Fidgets',
    material: 'PETG Técnico Metálico',
    price: 8900,
    desc: 'Juguete clicker de bolsillo con engranajes planetarios que giran de forma fluida produciendo clicks mecánicos.',
    img: 'assets/logo_ad3d.png',
    badge: 'Giroscópico'
  },
  {
    id: 5,
    title: 'Lámpara de Luna Llena 3D LED',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA Pro Ivory Transparente',
    price: 29900,
    desc: 'Lámpara decorativa con relieve fotográfico preciso de la superficie lunar. Incluye base de madera fina y luz LED cálida.',
    img: 'assets/logo_ad3d.png',
    badge: 'Estilo & Luz'
  },
  {
    id: 6,
    title: 'Lámpara Litofanía Personalizada',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA Pro Premium Blanco',
    price: 34900,
    desc: 'Lámpara cúbica con 4 caras personalizables a partir de tus fotos familiares. Revela las imágenes con alto detalle al encenderse.',
    img: 'assets/lampara_litofania.png',
    badge: '100% Personalizado'
  },
  {
    id: 8,
    title: 'Juego de Lámparas para Velas de Té – Colección Geométrica Moderna',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA Pro Ivory Transparente',
    price: 12990,
    desc: 'Set de lámparas decorativas con diseños geométricos modernos para velas de té. Excelente translucidez que proyecta hermosas figuras y sombras cálidas.',
    img: 'assets/lamparas_velas_te.jpg',
    badge: 'Colección'
  },
  {
    id: 7,
    title: 'Dispensador de Bolas 2" Pulgadas',
    category: 'modelos-virales',
    categoryName: 'Modelos Virales',
    material: 'A Pedido / Color a Elección',
    price: 179990,
    desc: 'Dispensador modular interactivo para cápsulas o bolas de 2 pulgadas. Producto a pedido, color a elegir. Estructura de panal resistente y funcional.',
    img: 'assets/dispensador_bolas.jpg',
    badge: '★ Nuevo'
  },
  {
    id: 9,
    title: 'Organizador de Escritorio Paramétrico',
    category: 'oficina-trabajo',
    categoryName: 'Oficina y Trabajo',
    material: 'PLA Pro Premium Gris',
    price: 15900,
    desc: 'Organizador de escritorio modular con compartimentos para bolígrafos, tarjetas, notas y teléfono móvil. Diseño minimalista y elegante.',
    img: 'assets/logo_ad3d.png',
    badge: 'Organización'
  },
  {
    id: 10,
    title: 'Soporte de Notebook Ajustable FDM',
    category: 'oficina-trabajo',
    categoryName: 'Oficina y Trabajo',
    material: 'PETG Técnico Negro',
    price: 19900,
    desc: 'Soporte ergonómico plegable para notebook. Mejora la postura y la ventilación del equipo. Fabricado en PETG reforzado.',
    img: 'assets/logo_ad3d.png',
    badge: 'Ergonomía'
  },
  {
    id: 11,
    title: 'Porta Lápices Espiral de Diseño',
    category: 'oficina-trabajo',
    categoryName: 'Oficina y Trabajo',
    material: 'PLA Pro Seda Oro',
    price: 7900,
    desc: 'Porta lápices con diseño helicoidal y estructura dinámica. Ideal para dar un toque artístico a tu escritorio de oficina.',
    img: 'assets/logo_ad3d.png',
    badge: 'Estilo Studio'
  },
  {
    id: 12,
    title: 'Florero Paramétrico Origami',
    category: 'floreros-macetas',
    categoryName: 'Floreros y Macetas',
    material: 'PLA Pro Mate Blanco',
    price: 18500,
    desc: 'Jarrón de diseño geométrico vanguardista. Estructura liviana de alta definición visual tratada para impermeabilidad.',
    img: 'assets/logo_ad3d.png',
    badge: 'Diseño Exclusivo'
  },
  {
    id: 13,
    title: 'Maceta Auto-Riego Inteligente',
    category: 'floreros-macetas',
    categoryName: 'Floreros y Macetas',
    material: 'PLA Pro Verde Oliva',
    price: 14900,
    desc: 'Maceta funcional de dos piezas con sistema de auto-riego por capilaridad. Perfecta para plantas de interior.',
    img: 'assets/logo_ad3d.png',
    badge: 'Auto-Riego'
  },
  {
    id: 14,
    title: 'Macetero Hexagonal en Cascada',
    category: 'floreros-macetas',
    categoryName: 'Floreros y Macetas',
    material: 'PLA Pro Seda Cobre',
    price: 12500,
    desc: 'Soporte modular de macetas hexagonales en cascada para suculentas. Ideal para repisas o decoración vertical.',
    img: 'assets/logo_ad3d.png',
    badge: 'Sustentable'
  },
  {
    id: 15,
    title: 'Fidget Clicker Patita de Gato',
    category: 'modelos-virales',
    categoryName: 'Modelos Virales',
    material: 'PLA Pro Rosa & Blanco',
    price: 3990,
    desc: 'Fidget toy viral de TikTok con forma de patita de gato. Incluye switch mecánico táctil y silicona suave al tacto.',
    img: 'assets/logo_ad3d.png',
    badge: 'TikTok Viral'
  },
  {
    id: 16,
    title: 'Maceta Calavera Low-Poly',
    category: 'modelos-virales',
    categoryName: 'Modelos Virales',
    material: 'PLA Pro Blanco Mate',
    price: 8900,
    desc: 'Maceta de calavera en estilo low-poly. Muy popular en redes para suculentas o plantas pequeñas de escritorio.',
    img: 'assets/logo_ad3d.png',
    badge: 'Trending'
  },
  {
    id: 17,
    title: 'Babosa Articulada Fidget Slug',
    category: 'modelos-virales',
    categoryName: 'Modelos Virales',
    material: 'PLA Pro Multicolor Seda',
    price: 5900,
    desc: 'La clásica babosa articulada antiestrés. Sonido crujiente y movimiento extremadamente fluido que encanta a todos.',
    img: 'assets/logo_ad3d.png',
    badge: 'Más Vendido'
  },
  {
    id: 18,
    title: 'Lámpara Sol de Mayo',
    category: 'lamparas',
    categoryName: 'Lámparas 3D',
    material: 'PLA Pro Terracota / Transparente',
    price: 29900,
    desc: 'Lámpara escultórica impresa en 3D inspirada en formas tradicionales japonesas y en formas solares radiantes.',
    img: 'assets/lampara_sol_de_mayo.jpg',
    badge: 'Escultórico'
  },
  {
    id: 19,
    title: 'Dragón Shenron Articulado',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA Pro Verde & Bronce',
    price: 14990,
    desc: 'Figura mítica de dragón Shenron con articulaciones completas impresas en 3D. Excelente nivel de detalle en escamas y cuernos.',
    img: 'assets/dragon_shenron.jpg',
    badge: 'Mítico',
    colors: ['Clásico Shenron', 'Variante']
  },
  {
    id: 20,
    title: 'Figura Dummy 13 (150% Versión Básica)',
    category: 'figuras-articuladas',
    categoryName: 'Figuras Articuladas',
    material: 'PLA Pro (Variedad de Colores)',
    price: 14990,
    desc: 'Dummy 150% Variedad de Colores Version Basica',
    img: 'assets/dummy13_colors_150.jpg',
    badge: '★ 150% Básica',
    colors: ['Naranjo', 'Blanco', 'Verde', 'Morado', 'Rojo', 'Amarillo']
  }
];

// Marketplace Designs Data (ONLY PLA Pro and PETG)
const marketplaceData = [
  {
    id: 107,
    title: 'Dispensador de Bolas 2" Pulgadas',
    author: 'ArteDigital3D',
    category: 'hogar',
    price: 179990,
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
  updateCartBadge();
  
  // Initialize Marketplace
  renderMarketplace('all');
  renderDesignersRanking();
  setupMarketplaceSearchAndFilters();
  
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
      document.getElementById('modal-price').textContent = formatCLP(prod.scales[0].price);
      selectedModalProduct.currentPrice = prod.scales[0].price;
      selectedModalProduct.selectedScale = prod.scales[0].label;
    } else {
      scaleGroup.style.display = 'none';
      document.getElementById('modal-price').textContent = formatCLP(prod.price);
      delete selectedModalProduct.currentPrice;
      delete selectedModalProduct.selectedScale;
    }
  } else {
    document.getElementById('modal-price').textContent = formatCLP(prod.price);
  }

  const colorSelect = document.getElementById('modal-color-select');
  if (colorSelect) {
    const colorList = prod.colors && prod.colors.length > 0
      ? prod.colors
      : ['Negro Mate Studio', 'Blanco Puro', 'Oro Titán Metalizado', 'Gris Espacial', 'Rojo Vivo PETG', 'Azul Cobalto PETG'];
    
    colorSelect.innerHTML = colorList.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  document.getElementById('product-modal').classList.add('active');
}

function handleModalScaleChange(selectElem) {
  if (!selectedModalProduct) return;
  const newPrice = parseInt(selectElem.value, 10);
  const selectedOption = selectElem.options[selectElem.selectedIndex];
  const scaleLabel = selectedOption.text.split(' - ')[0];

  document.getElementById('modal-price').textContent = formatCLP(newPrice);
  selectedModalProduct.currentPrice = newPrice;
  selectedModalProduct.selectedScale = scaleLabel;
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
const pageIds = ['inicio', 'galeria', 'marketplace', 'materiales', 'faq'];

function initPageRouter() {
  // Listen to hash change
  window.addEventListener('hashchange', handleRouteChange);
  
  // Initial load navigation
  handleRouteChange();
}

function handleRouteChange() {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  
  if (pageIds.includes(hash)) {
    navigateToPage(hash);
  }
}

function navigateToPage(pageId) {
  // Hide all sections
  pageIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      el.classList.remove('active-page');
    }
  });

  // Show active section
  const activeEl = document.getElementById(pageId);
  if (activeEl) {
    activeEl.style.display = 'block';
    activeEl.classList.add('active-page');
  }

  // Update navigation link highlights in header nav menu
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === pageId);
  });

  // Scroll smoothly to top of page
  window.scrollTo({ top: 0, behavior: 'instant' });
}

