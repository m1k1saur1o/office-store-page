import ProductCard from './ProductCard.jsx';
import { CATEGORY_LABELS } from '../utils.js';

function getSummary({ loading, error, count, activeCategory, searchTerm }) {
  if (loading) return 'Cargando productos...';
  if (error) return 'Catálogo no disponible';

  const categoryName = activeCategory === 'todos' ? 'todas las categorías' : CATEGORY_LABELS[activeCategory];
  const base = `${count} ${count === 1 ? 'producto' : 'productos'} en ${categoryName}`;
  return searchTerm ? `${base} para "${searchTerm}"` : base;
}

export default function ProductList({ products, loading, error, activeCategory, searchTerm, onAddToCart, onRetry }) {
  const summary = getSummary({ loading, error, count: products.length, activeCategory, searchTerm });

  return (
    <section className="container py-5" id="productos" aria-labelledby="productosTitulo">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
        <div>
          <h2 className="h4 mb-1" id="productosTitulo">Catálogo</h2>
          <p className="text-secondary small mb-0" aria-live="polite">{summary}</p>
        </div>
      </div>

      {/* Mensajes de estado: carga, error o sin resultados */}
      <div role="status" aria-live="polite">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status"></div>
            <p className="text-secondary small mt-3 mb-0">Cargando productos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-3" role="alert">
            <span>No pudimos cargar los productos. Intenta nuevamente más tarde.</span>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onRetry}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="alert alert-light border text-center" role="alert">
            No encontramos productos que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
