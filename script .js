/**
 * ================================================
 * VELOCIA — Tienda Virtual de Bicicletas
 * Arquitectura: Programación Orientada a Objetos (POO)
 * Clases: Producto, Carrito, Tienda
 * DOM: Selección, creación dinámica, eventos
 * ================================================
 */

// =====================================================
// CLASE: Producto
// Representa un producto del catálogo
// =====================================================
class Producto {
  constructor(id, nombre, precio, emoji, categoria, descripcion, specs, badge = null) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.emoji = emoji;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.specs = specs; // { talla, material, velocidades, peso }
    this.badge = badge; // "Nuevo", "Oferta", etc.
  }

  // Formatea el precio en formato COP
  getPrecioFormateado() {
    return `$${this.precio.toLocaleString('es-CO')}`;
  }

  // Retorna la categoría con mayúscula inicial
  getCategoriaDisplay() {
    return this.categoria.charAt(0).toUpperCase() + this.categoria.slice(1);
  }
}

// =====================================================
// CLASE: Carrito
// Maneja todos los productos en el carrito de compras
// =====================================================
class Carrito {
  constructor() {
    this.items = []; // Array de { producto: Producto, cantidad: Number }
    this.onUpdate = null; // Callback al actualizar
  }

  // Agrega un producto o incrementa su cantidad
  agregarProducto(producto, cantidad = 1) {
    const existente = this.items.find(item => item.producto.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this._notificar();
  }

  // Elimina un producto completamente
  eliminarProducto(id) {
    this.items = this.items.filter(item => item.producto.id !== id);
    this._notificar();
  }

  // Cambia la cantidad de un producto (mínimo 1)
  cambiarCantidad(id, delta) {
    const item = this.items.find(i => i.producto.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      this.eliminarProducto(id);
      return;
    }
    this._notificar();
  }

  // Calcula el total de la compra
  calcularTotal() {
    return this.items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }

  // Retorna el número total de unidades en el carrito
  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  // Vacía todo el carrito
  vaciarCarrito() {
    this.items = [];
    this._notificar();
  }

  // Renderiza el carrito en el DOM
  renderizar() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooterEl = document.getElementById('cartFooter');
    const cartEmptyEl = document.getElementById('cartEmpty');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');

    // Actualizar contador en el icono
    const total = this.getTotalItems();
    cartCountEl.textContent = total;
    if (total > 0) {
      cartCountEl.classList.add('visible');
    } else {
      cartCountEl.classList.remove('visible');
    }

    if (this.items.length === 0) {
      cartItemsEl.innerHTML = '';
      cartFooterEl.style.display = 'none';
      cartEmptyEl.style.display = 'flex';
      return;
    }

    cartEmptyEl.style.display = 'none';
    cartFooterEl.style.display = 'flex';
    cartTotalEl.textContent = `$${this.calcularTotal().toLocaleString('es-CO')}`;

    // Crear elementos dinámicamente con createElement
    cartItemsEl.innerHTML = '';
    this.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.setAttribute('data-id', item.producto.id);

      const emojiDiv = document.createElement('div');
      emojiDiv.className = 'cart-item-emoji';
      emojiDiv.textContent = item.producto.emoji;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'cart-item-info';

      const nameP = document.createElement('p');
      nameP.className = 'cart-item-name';
      nameP.textContent = item.producto.nombre;

      const priceP = document.createElement('p');
      priceP.className = 'cart-item-price';
      priceP.textContent = item.producto.getPrecioFormateado();

      infoDiv.appendChild(nameP);
      infoDiv.appendChild(priceP);

      const rightDiv = document.createElement('div');
      rightDiv.className = 'cart-item-right';

      const qtyDiv = document.createElement('div');
      qtyDiv.className = 'qty-ctrl';

      const btnMinus = document.createElement('button');
      btnMinus.className = 'qty-btn';
      btnMinus.textContent = '−';
      btnMinus.addEventListener('click', () => this.cambiarCantidad(item.producto.id, -1));

      const qtyNum = document.createElement('span');
      qtyNum.className = 'qty-num';
      qtyNum.textContent = item.cantidad;

      const btnPlus = document.createElement('button');
      btnPlus.className = 'qty-btn';
      btnPlus.textContent = '+';
      btnPlus.addEventListener('click', () => this.cambiarCantidad(item.producto.id, 1));

      qtyDiv.appendChild(btnMinus);
      qtyDiv.appendChild(qtyNum);
      qtyDiv.appendChild(btnPlus);

      const btnRemove = document.createElement('button');
      btnRemove.className = 'btn-remove';
      btnRemove.textContent = 'Eliminar';
      btnRemove.addEventListener('click', () => this.eliminarProducto(item.producto.id));

      rightDiv.appendChild(qtyDiv);
      rightDiv.appendChild(btnRemove);

      div.appendChild(emojiDiv);
      div.appendChild(infoDiv);
      div.appendChild(rightDiv);
      cartItemsEl.appendChild(div);
    });
  }

  // Notifica el callback de actualización y re-renderiza
  _notificar() {
    this.renderizar();
    if (typeof this.onUpdate === 'function') this.onUpdate();
  }
}

// =====================================================
// CLASE: Tienda
// Controla el catálogo, filtros y lógica principal
// =====================================================
class Tienda {
  constructor(productos, carrito) {
    this.catalogo = productos;       // Todos los productos
    this.carrito = carrito;          // Instancia de Carrito
    this.categoriaActual = 'todos';  // Filtro activo
    this.busqueda = '';              // Texto de búsqueda
  }

  // Devuelve los productos filtrados según categoría y búsqueda
  getProductosFiltrados() {
    return this.catalogo.filter(p => {
      const coincideCategoria = this.categoriaActual === 'todos' || p.categoria === this.categoriaActual;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }

  // Cambia el filtro de categoría
  filtrarPorCategoria(cat) {
    this.categoriaActual = cat;
    this.renderizarCatalogo();
  }

  // Actualiza el término de búsqueda
  buscar(termino) {
    this.busqueda = termino;
    this.renderizarCatalogo();
  }

  // Renderiza las tarjetas de producto en el DOM
  renderizarCatalogo() {
    const grid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');
    const productos = this.getProductosFiltrados();

    resultCount.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;

    // Limpiar el grid
    grid.innerHTML = '';

    if (productos.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:60px 20px;color:#6B7280;font-size:16px;';
      empty.innerHTML = '<span style="font-size:3rem">🔍</span><br><br>No encontramos bicicletas con esos filtros.<br>Intenta con otra categoría.';
      grid.appendChild(empty);
      return;
    }

    // Crear cada tarjeta con createElement
    productos.forEach((producto, idx) => {
      const card = this._crearTarjetaProducto(producto, idx);
      grid.appendChild(card);
    });
  }

  // Crea y retorna el elemento DOM de una tarjeta de producto
  _crearTarjetaProducto(producto, idx) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${idx * 60}ms`;

    // Imagen / emoji
    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img-wrap';

    const emoji = document.createElement('span');
    emoji.className = 'card-emoji';
    emoji.textContent = producto.emoji;
    imgWrap.appendChild(emoji);

    if (producto.badge) {
      const badge = document.createElement('span');
      badge.className = `card-badge${producto.badge === 'Nuevo' ? ' new' : ''}`;
      badge.textContent = producto.badge;
      imgWrap.appendChild(badge);
    }

    // Cuerpo de la tarjeta
    const body = document.createElement('div');
    body.className = 'card-body';

    const cat = document.createElement('p');
    cat.className = 'card-cat';
    cat.textContent = producto.getCategoriaDisplay();

    const nombre = document.createElement('h3');
    nombre.className = 'card-name';
    nombre.textContent = producto.nombre;

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = producto.descripcion;

    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const priceWrap = document.createElement('div');
    const price = document.createElement('p');
    price.className = 'card-price';
    price.textContent = producto.getPrecioFormateado();
    const priceSub = document.createElement('small');
    priceSub.textContent = 'COP · Precio final';
    priceWrap.appendChild(price);
    priceWrap.appendChild(priceSub);

    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn-add';
    btnAdd.innerHTML = '<span>🛒</span> Agregar';
    btnAdd.addEventListener('click', (e) => {
      e.stopPropagation();
      this.carrito.agregarProducto(producto);
      mostrarToast(`✅ ${producto.nombre} agregado al carrito`);
    });

    footer.appendChild(priceWrap);
    footer.appendChild(btnAdd);

    body.appendChild(cat);
    body.appendChild(nombre);
    body.appendChild(desc);
    body.appendChild(footer);

    card.appendChild(imgWrap);
    card.appendChild(body);

    // Click en la tarjeta abre el modal de detalle
    card.addEventListener('click', () => abrirModal(producto));

    return card;
  }
}

// =====================================================
// DATOS: Catálogo de productos (instancias de Producto)
// =====================================================
const catalogoProductos = [
  new Producto(1, 'Trek Marlin 7', 2800000, '🚵', 'montana',
    'La bicicleta de montaña perfecta para iniciarte en el trail. Suspensión delantera de 100mm, frenos hidráulicos y cambios Shimano Deore.',
    { Talla: 'S / M / L / XL', Material: 'Aluminio Alpha', Velocidades: '1×12', Peso: '13.8 kg' }, 'Nuevo'),

  new Producto(2, 'Specialized Stumpjumper', 8500000, '🏔️', 'montana',
    'Full suspension de alto rendimiento. Ideal para descensos técnicos y trails exigentes. Marco de carbono ultraligero.',
    { Talla: 'S / M / L', Material: 'Carbono FACT 11m', Velocidades: '1×12 SRAM', Peso: '11.2 kg' }, 'Top'),

  new Producto(3, 'Cannondale Synapse', 4200000, '🏁', 'ruta',
    'Diseñada para cubrir grandes distancias con comodidad. Geometría endurance y componentes Shimano 105 de 11 velocidades.',
    { Talla: '48 / 51 / 54 / 58', Material: 'Aluminio SmartForm', Velocidades: '2×11 Shimano', Peso: '9.5 kg' }),

  new Producto(4, 'Giant TCR Advanced', 9800000, '⚡', 'ruta',
    'Marco de carbono Composite de alta modularidad. La elección de ciclistas de alto rendimiento y competición.',
    { Talla: 'XS / S / M / ML', Material: 'Carbono Composite', Velocidades: '2×12 Shimano', Peso: '7.3 kg' }, 'Pro'),

  new Producto(5, 'Bianchi C-Sport', 1850000, '🏙️', 'urbana',
    'Elegante y práctica para el día a día en la ciudad. 7 velocidades, guardabarros integrado y portaequipaje trasero.',
    { Talla: 'S / M / L', Material: 'Acero Cromoly', Velocidades: '1×7', Peso: '14.5 kg' }, 'Nuevo'),

  new Producto(6, 'Marin Larkspur 2', 1350000, '🚲', 'urbana',
    'La compañera perfecta para tus trayectos urbanos. Ligera, cómoda y con excelente relación calidad-precio.',
    { Talla: 'XS / S / M / L', Material: 'Aluminio Series 6', Velocidades: '1×8', Peso: '12.8 kg' }),

  new Producto(7, 'Trek Verve+ 3', 7200000, '⚡', 'electrica',
    'Bicicleta eléctrica urbana con motor Bosch Performance de 250W. Hasta 120 km de autonomía. Ideal para el trabajo.',
    { Talla: 'S / M / L', Material: 'Aluminio Alpha Platinum', Motor: 'Bosch 250W', Autonomía: '~120 km' }, 'Eléctrica'),

  new Producto(8, 'Specialized Turbo Vado', 11500000, '⚡', 'electrica',
    'La e-bike más avanzada para uso diario. Motor SL 1.1 con 240W y batería de 320Wh integrada en el tubo inferior.',
    { Talla: 'M / L / XL', Material: 'Aluminio E5', Motor: 'Specialized SL 1.1 240W', Autonomía: '~150 km' }, 'Top'),

  new Producto(9, 'Giant ARX 24', 850000, '🧒', 'infantil',
    'Diseñada para niños de 7 a 10 años. Ligera, con frenos de fácil accionamiento y componentes dimensionados a su tamaño.',
    { Talla: '24 pulgadas', Material: 'Aluminio', Velocidades: '1×6', Peso: '9.2 kg' }),

  new Producto(10, 'Trek Precaliber 20', 780000, '🧒', 'infantil',
    'La primera bicicleta real para pequeños aventureros. Con ruedas de entrenamiento opcionales y frenos seguros.',
    { Talla: '20 pulgadas', Material: 'Acero', Velocidades: '1×6', Peso: '8.5 kg' }, 'Nuevo'),

  new Producto(11, 'Scott Scale 940', 3600000, '⛰️', 'montana',
    'Hardtail de trail con componentes de nivel medio-alto. Horquilla RockShox Judy Gold y frenos Shimano MT400.',
    { Talla: 'XS / S / M / L / XL', Material: 'Aluminio 6061', Velocidades: '1×12', Peso: '12.7 kg' }),

  new Producto(12, 'Orbea Gain M30', 6500000, '⚡', 'electrica',
    'E-road bike ligera con motor integrado casi invisible. La mejor opción para ciclistas de ruta que quieren un empujón.',
    { Talla: '47 / 51 / 55', Material: 'Aluminio Hydroformed', Motor: 'Mahle X35+ 250W', Autonomía: '~100 km' }),
];

// =====================================================
// INICIALIZACIÓN
// =====================================================
const carrito = new Carrito();
const tienda = new Tienda(catalogoProductos, carrito);

// =====================================================
// FUNCIONES DE UI
// =====================================================

// Muestra un toast de notificación
function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Abre el modal con detalles del producto
function abrirModal(producto) {
  const modal = document.getElementById('productModal');
  const box = document.getElementById('modalBox');

  // Construir contenido del modal con createElement
  box.innerHTML = '';

  const emojiEl = document.createElement('span');
  emojiEl.className = 'modal-emoji';
  emojiEl.textContent = producto.emoji;

  const catEl = document.createElement('p');
  catEl.className = 'modal-cat';
  catEl.textContent = producto.getCategoriaDisplay();

  const nameEl = document.createElement('h2');
  nameEl.className = 'modal-name';
  nameEl.textContent = producto.nombre;

  const descEl = document.createElement('p');
  descEl.className = 'modal-desc';
  descEl.textContent = producto.descripcion;

  // Specs
  const specsWrap = document.createElement('div');
  specsWrap.className = 'modal-specs';
  const specsTitle = document.createElement('h4');
  specsTitle.textContent = 'Especificaciones';
  specsWrap.appendChild(specsTitle);

  Object.entries(producto.specs).forEach(([key, val]) => {
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `<span>${key}</span><span>${val}</span>`;
    specsWrap.appendChild(row);
  });

  // Footer del modal
  const footerEl = document.createElement('div');
  footerEl.className = 'modal-footer';

  const priceEl = document.createElement('p');
  priceEl.className = 'modal-price';
  priceEl.textContent = producto.getPrecioFormateado();

  const actionsEl = document.createElement('div');
  actionsEl.className = 'modal-actions';

  const btnClose = document.createElement('button');
  btnClose.className = 'btn-modal-close';
  btnClose.textContent = 'Cerrar';
  btnClose.addEventListener('click', cerrarModal);

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn-add btn-modal-add';
  btnAdd.innerHTML = '🛒 Agregar al carrito';
  btnAdd.addEventListener('click', () => {
    carrito.agregarProducto(producto);
    mostrarToast(`✅ ${producto.nombre} agregado al carrito`);
    cerrarModal();
  });

  actionsEl.appendChild(btnClose);
  actionsEl.appendChild(btnAdd);
  footerEl.appendChild(priceEl);
  footerEl.appendChild(actionsEl);

  box.appendChild(emojiEl);
  box.appendChild(catEl);
  box.appendChild(nameEl);
  box.appendChild(descEl);
  box.appendChild(specsWrap);
  box.appendChild(footerEl);

  modal.classList.add('open');
}

function cerrarModal() {
  document.getElementById('productModal').classList.remove('open');
}

// =====================================================
// EVENTOS DEL DOM
// =====================================================
document.addEventListener('DOMContentLoaded', () => {

  // Renderizar catálogo inicial
  tienda.renderizarCatalogo();
  carrito.renderizar();

  // Filtro por categoría — Event Delegation en el contenedor
  document.querySelector('.cats-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-card');
    if (!btn) return;

    document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tienda.filtrarPorCategoria(btn.dataset.cat);
  });

  // Búsqueda en tiempo real
  document.getElementById('searchInput').addEventListener('input', (e) => {
    tienda.buscar(e.target.value);
  });

  // Abrir/cerrar carrito
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  function abrirCarrito() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  }
  function cerrarCarrito() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  cartToggle.addEventListener('click', abrirCarrito);
  cartClose.addEventListener('click', cerrarCarrito);
  cartOverlay.addEventListener('click', cerrarCarrito);

  // Vaciar carrito
  document.getElementById('btnVaciar').addEventListener('click', () => {
    carrito.vaciarCarrito();
    mostrarToast('🗑️ Carrito vaciado');
  });

  // Finalizar compra (simulado)
  document.getElementById('btnComprar').addEventListener('click', () => {
    if (carrito.items.length === 0) return;
    const total = carrito.calcularTotal().toLocaleString('es-CO');
    cerrarCarrito();
    carrito.vaciarCarrito();
    mostrarToast(`🎉 ¡Compra de $${total} realizada con éxito!`);
  });

  // Cerrar modal al hacer clic fuera
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) cerrarModal();
  });

  // Navbar shadow al hacer scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
});
