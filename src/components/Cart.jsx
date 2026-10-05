import { assetUrl, formatPrice } from '../utils.js';

function CartRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <li className="list-group-item px-0">
      <div className="d-flex align-items-center gap-3">
        <img className="cart-thumb" src={assetUrl(item.image)} alt="" />
        <div className="flex-grow-1">
          <p className="mb-1 small fw-semibold">{item.name}</p>
          <p className="mb-2 small text-secondary">
            {`${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`}
          </p>
          <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${item.name}`}>
            <button type="button" className="btn btn-outline-secondary"
              aria-label={`Quitar una unidad de ${item.name}`} onClick={() => onDecrease(item.id)}>
              −
            </button>
            <span className="btn btn-outline-secondary disabled" aria-hidden="true">{item.quantity}</span>
            <button type="button" className="btn btn-outline-secondary"
              aria-label={`Agregar una unidad de ${item.name}`} onClick={() => onIncrease(item.id)}>
              +
            </button>
            <button type="button" className="btn btn-outline-secondary"
              aria-label={`Eliminar ${item.name} del carrito`} onClick={() => onRemove(item.id)}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/* Carrito como panel lateral (offcanvas de Bootstrap) */
export default function Cart({ items, total, onIncrease, onDecrease, onRemove, onClear }) {
  const isEmpty = items.length === 0;

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartPanel" aria-labelledby="cartPanelTitle">
      <div className="offcanvas-header border-bottom">
        <h2 className="offcanvas-title h5" id="cartPanelTitle">Tu carrito</h2>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar el carrito"></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        <div className="flex-grow-1">
          {isEmpty ? (
            <p className="text-secondary small mb-0">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {items.map((item) => (
                <CartRow key={item.id} item={item}
                  onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} />
              ))}
            </ul>
          )}
        </div>
        <div className="border-top pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold">Total</span>
            <span className="fw-semibold h5 mb-0">{formatPrice(total)}</span>
          </div>
          <button className="btn btn-outline-secondary w-100" type="button" disabled={isEmpty} onClick={onClear}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
