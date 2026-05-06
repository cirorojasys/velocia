# VELOCIA — Refactorización

## Paso 1: Separar `script.js` en múltiples archivos

### Contexto
Todo el código JavaScript está en un solo archivo `script.js` (~550 líneas) que contiene:
- Clase `Producto`
- Clase `Carrito`
- Clase `Tienda`
- Array `catalogoProductos` (datos)
- Funciones de UI (`mostrarToast`, `abrirModal`, `cerrarModal`)
- Eventos del DOM (`DOMContentLoaded`)

### Instrucción
Dividir `script.js` en **3 archivos** sin agregar ni quitar funcionalidad:

1. **`models.js`** → Clases `Producto` y `Carrito` (modelo de datos)
2. **`data.js`** → Array `catalogoProductos` (datos del catálogo)
3. **`ui.js`** → Clase `Tienda`, funciones UI, eventos del DOM

En `index.html` cambiar `<script src="script .js">` a módulos ES:

```html
<script type="module">
  import './models.js';
  import './data.js';
  import './ui.js';
</script>
```

**Import/export:**
- `models.js` → `export class Producto`, `export class Carrito`
- `data.js` → `import { Producto } from './models.js'` → `export const catalogoProductos`
- `ui.js` → `import { Carrito } from './models.js'`, `import { catalogoProductos } from './data.js'`

Eliminar el archivo original `script.js`.

---

## Paso 2: Separar `index.html` en múltiples páginas (multi-page)

### Contexto
El `index.html` contiene todas las secciones: Navbar, Promo Bar, Hero, Categorías, Catálogo, Nosotros y Footer.

### Instrucción
Crear **3 páginas HTML** que compartan el mismo `styles.css`:

1. **`index.html`** → Navbar + Hero + Categorías + Footer
2. **`catalogo.html`** → Navbar + Categorías + Catálogo + Footer
3. **`nosotros.html`** → Navbar + Nosotros + Footer

**Actualizar los links del navbar** para que apunten a las páginas reales en vez de anclas:

```html
<a href="catalogo.html" class="nav-link">Catálogo</a>
<a href="index.html" class="nav-link">Categorías</a>
<a href="nosotros.html" class="nav-link">Nosotros</a>
```

**Actualizar los botones del Hero:**
- "Ver Catálogo" → `catalogo.html`
- "Nuestra historia" → `nosotros.html`

**Cada página importa solo el JS que necesita:**
- `index.html` → `models.js` + `ui.js`
- `catalogo.html` → `models.js` + `data.js` + `ui.js`
- `nosotros.html` → `models.js` + `ui.js`

**Agregar guards en `ui.js`** para que no falle en páginas que no tengan ciertos elementos:

```js
const carrito = new Carrito();
const tienda = document.getElementById('productGrid')
  ? new Tienda(catalogoProductos, carrito)
  : null;
```

---

## Paso 3: Reemplazar emojis por imágenes desde `img/`

### Contexto
Los productos usan emojis (🚵, 🏔️, 🏁, etc.) para representar las bicicletas. Las categorías también usan emojis.

### Instrucción

#### 3.1 Crear carpeta `img/`

Crear la carpeta `pagina/img/` para almacenar imágenes de productos e iconos de categorías.

#### 3.2 Actualizar clase `Producto`

Cambiar el parámetro `emoji` a `img` en el constructor:

```js
// Antes
constructor(id, nombre, precio, emoji, categoria, descripcion, specs, badge = null)
  this.emoji = emoji;

// Después
constructor(id, nombre, precio, img, categoria, descripcion, specs, badge = null)
  this.img = img;
```

#### 3.3 Actualizar `data.js`

Reemplazar todos los emojis por rutas de imágenes:

```js
// Antes
new Producto(1, 'Trek Marlin 7', 2800000, '🚵', 'montana', ...)

// Después
new Producto(1, 'Trek Marlin 7', 2800000, 'img/trek-marlin-7.jpg', 'montana', ...)
```

#### 3.4 Actualizar `models.js` (Carrito)

En el método `renderizar()`, reemplazar el emoji por una etiqueta `<img>`:

```js
// Antes
const emojiDiv = document.createElement('div');
emojiDiv.className = 'cart-item-emoji';
emojiDiv.textContent = item.producto.emoji;

// Después
const imgDiv = document.createElement('div');
imgDiv.className = 'cart-item-emoji';
const img = document.createElement('img');
img.src = item.producto.img;
img.alt = item.producto.nombre;
imgDiv.appendChild(img);
```

#### 3.5 Actualizar `ui.js` (Tarjetas y Modal)

En `_crearTarjetaProducto()`:

```js
// Antes
const emoji = document.createElement('span');
emoji.className = 'card-emoji';
emoji.textContent = producto.emoji;

// Después
const img = document.createElement('img');
img.className = 'card-img';
img.src = producto.img;
img.alt = producto.nombre;
```

En `abrirModal()`:

```js
// Antes
const emojiEl = document.createElement('span');
emojiEl.className = 'modal-emoji';
emojiEl.textContent = producto.emoji;

// Después
const imgEl = document.createElement('img');
imgEl.className = 'modal-img';
imgEl.src = producto.img;
imgEl.alt = producto.nombre;
```

#### 3.6 Actualizar categorías en HTML

Reemplazar emojis por imágenes SVG en `index.html` y `catalogo.html`:

```html
<!-- Antes -->
<button class="cat-card active" data-cat="todos">
  <span class="cat-icon">🚲</span>
  <span>Todas</span>
</button>

<!-- Después -->
<button class="cat-card active" data-cat="todos">
  <img class="cat-icon" src="img/cat-todas.svg" alt="Todas">
  <span>Todas</span>
</button>
```

#### 3.7 Actualizar `styles.css`

Reemplazar estilos de emojis por estilos de imágenes:

```css
/* Antes */
.card-emoji { font-size: 90px; line-height: 1; }
.product-card:hover .card-emoji { transform: scale(1.1) rotate(-5deg); }
.cart-item-emoji { font-size: 36px; }
.modal-emoji { font-size: 80px; text-align: center; display: block; margin-bottom: 20px; }
.cat-icon { font-size: 28px; }

/* Después */
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.product-card:hover .card-img { transform: scale(1.08); }
.cart-item-emoji { width: 50px; height: 50px; flex-shrink: 0; }
.cart-item-emoji img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
.modal-img { width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
.cat-icon { width: 32px; height: 32px; }
```

---

## Resultado Final

```
pagina/
├── index.html            → Hero + Categorías + Footer
├── catalogo.html         → Categorías + Catálogo + Footer
├── nosotros.html         → Nosotros + Footer
├── styles.css            → Estilos (sin cambios de estructura)
├── models.js             → export Producto, export Carrito
├── data.js               → import Producto → export catalogoProductos
├── ui.js                 → import Carrito, catalogoProductos → Tienda, UI, eventos
└── img/
    ├── cat-todas.svg
    ├── cat-montana.svg
    ├── cat-ruta.svg
    ├── cat-urbana.svg
    ├── cat-electrica.svg
    ├── cat-infantil.svg
    └── [imagenes-de-productos].jpg
```
