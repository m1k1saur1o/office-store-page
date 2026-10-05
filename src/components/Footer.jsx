export default function Footer() {
  return (
    <footer className="footer border-top mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h6 fw-semibold">Office Store</h2>
            <p className="text-secondary small mb-0">
              Tienda demostrativa creada con React, Vite y Bootstrap 5.
            </p>
          </div>
          <div className="col-6 col-md-4">
            <h3 className="h6 fw-semibold">Contacto</h3>
            <address className="text-secondary small mb-0">
              Av. Siempre Viva 742, Santiago<br />
              <a href="mailto:contacto@officestore.cl">contacto@officestore.cl</a><br />
              <a href="tel:+56900000000">+56 9 0000 0000</a>
            </address>
          </div>
          <div className="col-6 col-md-4">
            <h3 className="h6 fw-semibold">Síguenos</h3>
            <ul className="list-unstyled small mb-0">
              <li><a href="#inicio">Instagram</a></li>
              <li><a href="#inicio">Facebook</a></li>
              <li><a href="#inicio">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <p className="text-secondary small text-center mb-0">
          &copy; {new Date().getFullYear()} Office Store. Sitio ficticio con fines académicos.
        </p>
      </div>
    </footer>
  );
}
