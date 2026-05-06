/**
 * ================================================
 * VELOCIA — Modelos de datos
 * Clases: Producto, Carrito
 * ================================================
 */

// =====================================================
// CLASE: Producto
// Representa un producto del catálogo
// =====================================================
export class Producto {
  constructor(id, nombre, precio, img, categoria, descripcion, specs, badge = null) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.img = img;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.specs = specs;
    this.badge = badge;
  }

  getPrecioFormateado() {
    return `$${this.precio.toLocaleString('es-CO')}`;
  }

  getCategoriaDisplay() {
    return this.categoria.charAt(0).toUpperCase() + this.categoria.slice(1);
  }
}

// =====================================================
// CLASE: Carrito
// Maneja todos los productos en el carrito de compras
// =====================================================
export class Carrito {
  constructor() {
    this.items = [];
    this.onUpdate = null;
  }

  agregarProducto(producto, cantidad = 1) {
    const existente = this.items.find(item => item.producto.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this._notificar();
  }

  eliminarProducto(id) {
    this.items = this.items.filter(item => item.producto.id !== id);
    this._notificar();
  }

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

  calcularTotal() {
    return this.items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  vaciarCarrito() {
    this.items = [];
    this._notificar();
  }

  renderizar() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooterEl = document.getElementById('cartFooter');
    const cartEmptyEl = document.getElementById('cartEmpty');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');

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

    cartItemsEl.innerHTML = '';
    this.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.setAttribute('data-id', item.producto.id);

      const imgDiv = document.createElement('div');
      imgDiv.className = 'cart-item-emoji';
      const img = document.createElement('img');
      img.src = item.producto.img;
      img.alt = item.producto.nombre;
      imgDiv.appendChild(img);

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

      div.appendChild(imgDiv);
      div.appendChild(infoDiv);
      div.appendChild(rightDiv);
      cartItemsEl.appendChild(div);
    });
  }

  _notificar() {
    this.renderizar();
    if (typeof this.onUpdate === 'function') this.onUpdate();
  }
}
