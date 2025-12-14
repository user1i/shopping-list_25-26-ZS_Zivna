import React from "react";

export default function ItemsSection({
  visibleItems,
  showCompleted,
  onToggleItemDone,
  onDeleteItem,
  onToggleShowCompleted,
  onAddItem,
}) {
  return (
    <div className="detail-column detail-items">
      <div className="detail-section-header">
        <div className="detail-section-title">
          Items
          <button
            type="button"
            className="primary-button inline-add-button"
            onClick={onAddItem}
          >
            + Add item
          </button>
        </div>
      </div>

      <ul className="detail-items-list">
        {visibleItems.map((item) => (
          <li key={item.id} className="detail-item-row">
            <span className="detail-checkbox">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggleItemDone(item.id)}
              />
            </span>

            <span
              className={
                item.done
                  ? "detail-item-text detail-item-text-done"
                  : "detail-item-text"
              }
            >
              {item.name}
            </span>

            <button
              type="button"
              className="text-button"
              onClick={() => onDeleteItem(item.id)}
            >
              [Delete]
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="link-button"
        onClick={onToggleShowCompleted}
      >
        {showCompleted ? "[Hide completed]" : "[Show completed]"}
      </button>
    </div>
  );
}
