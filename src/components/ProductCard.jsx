import { CATEGORY_LABELS, assetUrl, formatPrice } from '../utils.js';

/* Tarjeta de un producto del catálogo */
export default function ProductCard({ product, onAdd }) {
  return (
    <div className="col">
      <article className="card h-100 product-card">
        <img
          className="card-img-top product-img"
          src={assetUrl(product.image)}
          alt={product.alt || product.name}
          loading="lazy"
        />
        <div className="card-body d-flex flex-column">
          <span className="badge text-bg-light align-self-start mb-2">
            {CATEGORY_LABELS[product.category] || 'General'}
          </span>
          <h3 className="h6 card-title">{product.name}</h3>
          <p className="card-text small text-secondary flex-grow-1">{product.description}</p>
          <p className="h5 product-price mb-3">{formatPrice(product.price)}</p>
          <button
            className="btn btn-brand w-100"
            type="button"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={() => onAdd(product)}>
            Agregar al carrito
          </button>
        </div>
      </article>
    </div>
  );
}
