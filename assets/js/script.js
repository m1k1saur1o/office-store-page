/* Office Store - lógica de catálogo, búsqueda y carrito con JavaScript vanilla */

const PRODUCTS_URL = 'assets/data/products.json';

const CATEGORY_LABELS = {
  electronica: 'Electrónica',
  accesorios: 'Accesorios'
};

// Estado de la aplicación en memoria
let products = [];
let cart = [];
let activeCategory = 'todos';
let searchTerm = '';

const dom = {};

document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheDom();
  bindEvents();
  dom.currentYear.textContent = new Date().getFullYear();
  loadProducts();
}

function cacheDom() {
  dom.grid = document.getElementById('productsGrid');
  dom.status = document.getElementById('statusArea');
  dom.summary = document.getElementById('resultsSummary');
  dom.searchForm = document.getElementById('searchForm');
  dom.searchInput = document.getElementById('searchInput');
  dom.categoryNav = document.getElementById('categoryNav');
  dom.cartItems = document.getElementById('cartItems');
  dom.cartTotal = document.getElementById('cartTotal');
  dom.cartCount = document.getElementById('cartCount');
  dom.clearCartBtn = document.getElementById('clearCartBtn');
  dom.toastContainer = document.getElementById('toastContainer');
  dom.currentYear = document.getElementById('currentYear');
}

function bindEvents() {
  dom.searchForm.addEventListener('submit', handleSearch);
  dom.categoryNav.addEventListener('click', handleCategoryClick);
  dom.grid.addEventListener('click', handleGridClick);
  dom.cartItems.addEventListener('click', handleCartClick);
  dom.clearCartBtn.addEventListener('click', clearCart);
}

/* Carga de productos desde el JSON local con Fetch API */
async function loadProducts() {
  showLoading();

  try {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
      throw new Error(`Respuesta HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Formato de datos inesperado');
    }

    products = data;
    renderCart();
    applyFilters();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    showError();
  }
}

/* Filtra por categoría y término de búsqueda antes de dibujar */
function applyFilters() {
  const filtered = products.filter(function (product) {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
  updateSummary(filtered.length);
}

function renderProducts(list) {
  clearStatus();
  dom.grid.innerHTML = '';

  if (list.length === 0) {
    showEmptyResults();
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach(function (product) {
    fragment.appendChild(createProductCard(product));
  });
  dom.grid.appendChild(fragment);
}

/* Construye la tarjeta de un producto mediante manipulación del DOM */
function createProductCard(product) {
  const col = document.createElement('div');
  col.className = 'col';

  const card = document.createElement('article');
  card.className = 'card h-100 product-card';

  const image = document.createElement('img');
  image.className = 'card-img-top product-img';
  image.src = product.image;
  image.alt = product.alt || product.name;
  image.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'card-body d-flex flex-column';

  const badge = document.createElement('span');
  badge.className = 'badge text-bg-light align-self-start mb-2';
  badge.textContent = CATEGORY_LABELS[product.category] || 'General';

  const title = document.createElement('h3');
  title.className = 'h6 card-title';
  title.textContent = product.name;

  const description = document.createElement('p');
  description.className = 'card-text small text-secondary flex-grow-1';
  description.textContent = product.description;

  const price = document.createElement('p');
  price.className = 'h5 product-price mb-3';
  price.textContent = formatPrice(product.price);

  const button = document.createElement('button');
  button.className = 'btn btn-brand w-100';
  button.type = 'button';
  button.textContent = 'Agregar al carrito';
  button.dataset.action = 'add';
  button.dataset.id = product.id;
  button.setAttribute('aria-label', `Agregar ${product.name} al carrito`);

  body.append(badge, title, description, price, button);
  card.append(image, body);
  col.appendChild(card);

  return col;
}

/* Evento click delegado: detecta el botón "Agregar al carrito" */
function handleGridClick(event) {
  const button = event.target.closest('[data-action="add"]');
  if (!button) return;

  addToCart(Number(button.dataset.id));
}

/* Evento submit: filtra el catálogo sin recargar la página */
function handleSearch(event) {
  event.preventDefault();
  searchTerm = dom.searchInput.value.trim().toLowerCase();
  applyFilters();
}

function handleCategoryClick(event) {
  const link = event.target.closest('[data-category]');
  if (!link) return;

  activeCategory = link.dataset.category;
  setActiveCategoryLink(link);
  applyFilters();
}

function setActiveCategoryLink(activeLink) {
  dom.categoryNav.querySelectorAll('[data-category]').forEach(function (link) {
    link.classList.toggle('active', link === activeLink);
    if (link === activeLink) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function addToCart(productId) {
  const product = products.find(function (item) {
    return item.id === productId;
  });
  if (!product) return;

  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} se agregó al carrito.`);
}

/* Cambia la cantidad de un ítem y lo elimina si llega a cero */
function updateQuantity(productId, delta) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });
  if (!cartItem) return;

  cartItem.quantity += delta;

  if (cartItem.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
  showToast('El carrito quedó vacío.');
}

function handleCartClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'increase') updateQuantity(productId, 1);
  if (action === 'decrease') updateQuantity(productId, -1);
  if (action === 'remove') removeFromCart(productId);
}

/* Dibuja el resumen del carrito, el total y el contador */
function renderCart() {
  dom.cartItems.innerHTML = '';

  if (cart.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-secondary small mb-0';
    empty.textContent = 'Tu carrito está vacío. Agrega productos desde el catálogo.';
    dom.cartItems.appendChild(empty);
  } else {
    const list = document.createElement('ul');
    list.className = 'list-group list-group-flush';

    cart.forEach(function (item) {
      list.appendChild(createCartRow(item));
    });

    dom.cartItems.appendChild(list);
  }

  dom.cartTotal.textContent = formatPrice(calculateTotal());
  dom.clearCartBtn.disabled = cart.length === 0;
  updateCartCount();
}

function createCartRow(item) {
  const row = document.createElement('li');
  row.className = 'list-group-item px-0';

  const layout = document.createElement('div');
  layout.className = 'd-flex align-items-center gap-3';

  const thumb = document.createElement('img');
  thumb.className = 'cart-thumb';
  thumb.src = item.image;
  thumb.alt = '';

  const info = document.createElement('div');
  info.className = 'flex-grow-1';

  const name = document.createElement('p');
  name.className = 'mb-1 small fw-semibold';
  name.textContent = item.name;

  const subtotal = document.createElement('p');
  subtotal.className = 'mb-2 small text-secondary';
  subtotal.textContent = `${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`;

  const controls = document.createElement('div');
  controls.className = 'btn-group btn-group-sm';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', `Cantidad de ${item.name}`);

  controls.append(
    createCartButton('−', 'decrease', item.id, `Quitar una unidad de ${item.name}`),
    createQuantityLabel(item.quantity),
    createCartButton('+', 'increase', item.id, `Agregar una unidad de ${item.name}`),
    createCartButton('Eliminar', 'remove', item.id, `Eliminar ${item.name} del carrito`)
  );

  info.append(name, subtotal, controls);
  layout.append(thumb, info);
  row.appendChild(layout);

  return row;
}

function createCartButton(label, action, id, ariaLabel) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-outline-secondary';
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

function createQuantityLabel(quantity) {
  const label = document.createElement('span');
  label.className = 'btn btn-outline-secondary disabled';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = quantity;
  return label;
}

function calculateTotal() {
  return cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
}

function updateCartCount() {
  const units = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  dom.cartCount.textContent = units;
  dom.cartCount.classList.toggle('d-none', units === 0);
}

function updateSummary(count) {
  const categoryName = activeCategory === 'todos' ? 'todas las categorías' : CATEGORY_LABELS[activeCategory];
  const base = `${count} ${count === 1 ? 'producto' : 'productos'} en ${categoryName}`;
  dom.summary.textContent = searchTerm ? `${base} para "${searchTerm}"` : base;
}

function showLoading() {
  dom.grid.innerHTML = '';
  dom.status.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'text-center py-5';
  wrapper.innerHTML = '<div class="spinner-border text-secondary" role="status"></div>' +
    '<p class="text-secondary small mt-3 mb-0">Cargando productos...</p>';

  dom.status.appendChild(wrapper);
}

/* Mensaje amigable cuando falla la carga del JSON */
function showError() {
  dom.grid.innerHTML = '';
  dom.status.innerHTML = '';
  dom.summary.textContent = 'Catálogo no disponible';

  const alert = document.createElement('div');
  alert.className = 'alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-3';
  alert.setAttribute('role', 'alert');

  const message = document.createElement('span');
  message.textContent = 'No pudimos cargar los productos. Intenta nuevamente más tarde.';

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'btn btn-sm btn-outline-secondary';
  retry.textContent = 'Reintentar';
  retry.addEventListener('click', loadProducts);

  alert.append(message, retry);
  dom.status.appendChild(alert);
}

function showEmptyResults() {
  const alert = document.createElement('div');
  alert.className = 'alert alert-light border text-center';
  alert.setAttribute('role', 'alert');
  alert.textContent = 'No encontramos productos que coincidan con tu búsqueda.';
  dom.status.appendChild(alert);
}

function clearStatus() {
  dom.status.innerHTML = '';
}

/* Notificación breve usando el componente Toast de Bootstrap */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-dark border-0';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const body = document.createElement('div');
  body.className = 'toast-body';
  body.textContent = message;

  const wrapper = document.createElement('div');
  wrapper.className = 'd-flex';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'btn-close btn-close-white me-2 m-auto';
  close.setAttribute('data-bs-dismiss', 'toast');
  close.setAttribute('aria-label', 'Cerrar notificación');

  wrapper.append(body, close);
  toast.appendChild(wrapper);
  dom.toastContainer.appendChild(toast);

  const instance = new bootstrap.Toast(toast, { delay: 2500 });
  toast.addEventListener('hidden.bs.toast', function () {
    toast.remove();
  });
  instance.show();
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}
