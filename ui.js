/**
 * ================================================
 * VELOCIA — UI y eventos
 * Clase Tienda, funciones UI, eventos del DOM
 * ================================================
 */

import { Carrito } from './models.js';
import { catalogoProductos } from './data.js';

// =====================================================
// CLASE: Tienda
// Controla el catálogo, filtros y lógica principal
// =====================================================
class Tienda {
  constructor(productos, carrito) {
    this.catalogo = productos;
    this.carrito = carrito;
    this.categoriaActual = 'todos';
    this.busqueda = '';
  }

  getProductosFiltrados() {
    return this.catalogo.filter(p => {
      const coincideCategoria = this.categoriaActual === 'todos' || p.categoria === this.categoriaActual;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }

  filtrarPorCategoria(cat) {
    this.categoriaActual = cat;
    this.renderizarCatalogo();
  }

  buscar(termino) {
    this.busqueda = termino;
    this.renderizarCatalogo();
  }

  renderizarCatalogo() {
    const grid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');
    const productos = this.getProductosFiltrados();

    resultCount.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;

    grid.innerHTML = '';

    if (productos.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:60px 20px;color:#6B7280;font-size:16px;';
      empty.innerHTML = '<span style="font-size:3rem">🔍</span><br><br>No encontramos bicicletas con esos filtros.<br>Intenta con otra categoría.';
      grid.appendChild(empty);
      return;
    }

    productos.forEach((producto, idx) => {
      const card = this._crearTarjetaProducto(producto, idx);
      grid.appendChild(card);
    });
  }

  _crearTarjetaProducto(producto, idx) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${idx * 60}ms`;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img-wrap';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = producto.img;
    img.alt = producto.nombre;
    imgWrap.appendChild(img);

    if (producto.badge) {
      const badge = document.createElement('span');
      badge.className = `card-badge${producto.badge === 'Nuevo' ? ' new' : ''}`;
      badge.textContent = producto.badge;
      imgWrap.appendChild(badge);
    }

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

    card.addEventListener('click', () => abrirModal(producto));

    return card;
  }
}

// =====================================================
// INICIALIZACIÓN
// =====================================================
const carrito = new Carrito();
const tienda = document.getElementById('productGrid')
  ? new Tienda(catalogoProductos, carrito)
  : null;

// =====================================================
// FUNCIONES DE UI
// =====================================================

function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function abrirModal(producto) {
  const modal = document.getElementById('productModal');
  const box = document.getElementById('modalBox');
  if (!modal || !box) return;

  box.innerHTML = '';

  const imgEl = document.createElement('img');
  imgEl.className = 'modal-img';
  imgEl.src = producto.img;
  imgEl.alt = producto.nombre;

  const catEl = document.createElement('p');
  catEl.className = 'modal-cat';
  catEl.textContent = producto.getCategoriaDisplay();

  const nameEl = document.createElement('h2');
  nameEl.className = 'modal-name';
  nameEl.textContent = producto.nombre;

  const descEl = document.createElement('p');
  descEl.className = 'modal-desc';
  descEl.textContent = producto.descripcion;

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

  // Catálogo (solo en páginas que tengan el grid)
  if (tienda) {
    tienda.renderizarCatalogo();
  }

  // Carrito (en todas las páginas)
  carrito.renderizar();

  // Categorías (solo si existe)
  const catsGrid = document.querySelector('.cats-grid');
  if (catsGrid) {
    catsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-card');
      if (!btn) return;

      document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tienda) {
        tienda.filtrarPorCategoria(btn.dataset.cat);
      }
    });
  }

  // Búsqueda (solo si existe)
  const searchInput = document.getElementById('searchInput');
  if (searchInput && tienda) {
    searchInput.addEventListener('input', (e) => {
      tienda.buscar(e.target.value);
    });
  }

  // Carrito sidebar (en todas las páginas)
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  if (cartToggle && cartSidebar && cartOverlay) {
    function abrirCarrito() {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('open');
    }
    function cerrarCarrito() {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
    }

    cartToggle.addEventListener('click', abrirCarrito);
    if (cartClose) cartClose.addEventListener('click', cerrarCarrito);
    cartOverlay.addEventListener('click', cerrarCarrito);
  }

  // Vaciar carrito
  const btnVaciar = document.getElementById('btnVaciar');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
      carrito.vaciarCarrito();
      mostrarToast('🗑️ Carrito vaciado');
    });
  }

  // Finalizar compra
  const btnComprar = document.getElementById('btnComprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      if (carrito.items.length === 0) return;
      const total = carrito.calcularTotal().toLocaleString('es-CO');
      if (cartSidebar) cartSidebar.classList.remove('open');
      if (cartOverlay) cartOverlay.classList.remove('open');
      carrito.vaciarCarrito();
      mostrarToast(`🎉 ¡Compra de $${total} realizada con éxito!`);
    });
  }

  // Cerrar modal
  const productModal = document.getElementById('productModal');
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) cerrarModal();
    });
  }

  // Navbar shadow
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
});
