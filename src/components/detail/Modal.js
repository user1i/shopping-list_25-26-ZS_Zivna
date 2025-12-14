import React from "react";

export default function Modal({ title, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
