import { useState } from 'react';
import { CATEGORY_LABELS } from '../utils.js';

const CATEGORIES = [
  { value: 'todos', label: 'Todos' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
];

export default function Header({ cartCount, activeCategory, onCategoryChange, searchTerm, onSearch }) {
  const [query, setQuery] = useState(searchTerm);

  /* Submit: filtra el catálogo sin recargar la página */
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand fw-semibold" href="#inicio">
            <span className="brand-mark" aria-hidden="true">OS</span>
            Office Store
          </a>

          {/* Carrito y toggler visibles siempre, incluso en móviles */}
          <div className="d-flex align-items-center order-lg-last ms-auto gap-2">
            <button
              className="btn btn-outline-brand position-relative"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartPanel"
              aria-controls="cartPanel">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>
              </svg>
              <span className="d-none d-sm-inline ms-1">Carrito</span>
              {cartCount > 0 && (
                <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
              <span className="visually-hidden">Abrir el carrito de compras</span>
            </button>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
              aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú de navegación">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {CATEGORIES.map((category) => {
                const isActive = category.value === activeCategory;
                return (
                  <li className="nav-item" key={category.value}>
                    <a
                      className={`nav-link${isActive ? ' active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      href="#productos"
                      onClick={() => onCategoryChange(category.value)}>
                      {category.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <form className="d-flex my-2 my-lg-0" role="search" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="searchInput">Buscar productos</label>
              <div className="input-group">
                <input className="form-control" id="searchInput" type="search" name="search"
                  placeholder="Buscar productos..." autoComplete="off"
                  value={query} onChange={(event) => setQuery(event.target.value)} />
                <button className="btn btn-brand" type="submit">Buscar</button>
              </div>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
