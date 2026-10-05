/* Office Store - estado de la tienda: catálogo, filtros, búsqueda y carrito */
import { useEffect, useState } from 'react';

import Header from './components/Header.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import Footer from './components/Footer.jsx';
import Toasts from './components/Toasts.jsx';
import { CATEGORY_LABELS, assetUrl, isValidCart, readStorage, writeStorage } from './utils.js';

const PRODUCTS_URL = assetUrl('data/products.json');

const STORAGE_KEYS = {
  cart: 'officeStore.cart',
  category: 'officeStore.category',
  search: 'officeStore.search'
};

const TOAST_DELAY = 2500;

function isValidCategory(value) {
  return value === 'todos' || Object.hasOwn(CATEGORY_LABELS, value);
}

function isString(value) {
  return typeof value === 'string';
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Estado inicial recuperado desde localStorage (arreglo vacío si no existe o está corrupto)
  const [cart, setCart] = useState(() => readStorage(STORAGE_KEYS.cart, [], isValidCart));
  const [activeCategory, setActiveCategory] = useState(() => readStorage(STORAGE_KEYS.category, 'todos', isValidCategory));
  const [searchTerm, setSearchTerm] = useState(() => readStorage(STORAGE_KEYS.search, '', isString));
  const [toasts, setToasts] = useState([]);

  /* Carga de productos desde el JSON local con Fetch API */
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Respuesta HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Formato de datos inesperado');
        }

        setProducts(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error al cargar productos:', err);
        setError(err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    // Limpieza: cancela la petición si el componente se desmonta o se reintenta
    return () => controller.abort();
  }, [reloadKey]);

  /* Persistencia local: guarda el carrito cada vez que cambia */
  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.category, activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.search, searchTerm);
  }, [searchTerm]);

  /* Filtra por categoría y término de búsqueda */
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function showToast(message) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => dismissToast(id), TOAST_DELAY);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function handleSearch(term) {
    setSearchTerm(term.trim().toLowerCase());
  }

  function addToCart(product) {
    setCart((current) => {
      const exists = current.some((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });

    showToast(`${product.name} se agregó al carrito.`);
  }

  /* Cambia la cantidad de un ítem y lo elimina si llega a cero */
  function updateQuantity(productId, delta) {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
    showToast('El carrito quedó vacío.');
  }

  return (
    <>
      <a className="visually-hidden-focusable skip-link" href="#productos">Saltar al catálogo</a>

      <Header
        cartCount={cartCount}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearch={handleSearch}
      />

      <main>
        <section className="hero border-bottom" id="inicio">
          <div className="container py-5">
            <div className="row justify-content-center text-center">
              <div className="col-lg-7">
                <h1 className="h2 fw-semibold mb-3">Equipa tu oficina con lo esencial</h1>
                <p className="text-secondary mb-0">
                  Tecnología y accesorios seleccionados para trabajar cómodo. Envío gratis sobre $50.000.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ProductList
          products={filteredProducts}
          loading={loading}
          error={error}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          onAddToCart={addToCart}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </main>

      <Footer />

      <Cart
        items={cart}
        total={cartTotal}
        onIncrease={(id) => updateQuantity(id, 1)}
        onDecrease={(id) => updateQuantity(id, -1)}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
