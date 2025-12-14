import React from "react";
import Modal from "./Modal";

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title}>
      <div style={{ marginBottom: 12 }}>{message}</div>

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          {cancelText}
        </button>
        <button type="button" className="primary-button" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
