import React from "react";

export default function ListHeader({ title, isOwner, onBack, onRename }) {
  return (
    <div className="detail-header">
      <button type="button" className="link-button" onClick={onBack}>
        {"< Back"}
      </button>

      <div className="detail-title-row">
        <h1 className="detail-title">Shopping List: {title}</h1>
        {isOwner && (
          <button type="button" className="text-button" onClick={onRename}>
            [Rename]
          </button>
        )}
      </div>
    </div>
  );
}
