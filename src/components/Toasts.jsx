/* Confirmaciones visuales al agregar productos (estilos de Toast de Bootstrap, controlados por estado) */
export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast show align-items-center text-bg-dark border-0"
          role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar notificación" onClick={() => onDismiss(toast.id)}></button>
          </div>
        </div>
      ))}
    </div>
  );
}
