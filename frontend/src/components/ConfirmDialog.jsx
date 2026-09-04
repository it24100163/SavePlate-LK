import { useEffect, useRef } from "react";

export default function ConfirmDialog({ open, title, message, confirmText = "Confirm", variant = "primary", busy = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <div className="dialog-icon" aria-hidden="true">?</div>
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-description">{message}</p>
        <div className="dialog-actions">
          <button ref={cancelRef} className="button button-secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className={`button ${variant === "danger" ? "button-danger" : "button-primary"}`} type="button" onClick={onConfirm} disabled={busy}>
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
