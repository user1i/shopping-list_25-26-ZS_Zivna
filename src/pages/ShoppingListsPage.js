import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import Modal from "../components/detail/Modal";
import ConfirmModal from "../components/detail/ConfirmModal";

export default function ShoppingListsPage({
  lists,
  onCreateList,
  onArchiveToggle,
  onDeleteList,
  onLeaveList,
}) {
  const [showArchived, setShowArchived] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const [confirmAction, setConfirmAction] = useState(null); // "delete" | "leave" | null
  const [selectedList, setSelectedList] = useState(null);

  const navigate = useNavigate();

  const visibleLists = lists.filter((list) => showArchived || !list.archived);

  // --- Create modal ---
  const handleOpenCreate = () => {
    setNewTitle("");
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewTitle("");
  };

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    onCreateList(trimmed);
    handleCloseCreate();
  };

  // --- Confirm modal (Delete / Leave) ---
  const openConfirm = (action, list) => {
    setConfirmAction(action);
    setSelectedList(list);
  };

  const closeConfirm = () => {
    setConfirmAction(null);
    setSelectedList(null);
  };

  const handleConfirm = () => {
    if (!selectedList || !confirmAction) return;

    if (confirmAction === "delete") {
      onDeleteList(selectedList.id);
    } else if (confirmAction === "leave") {
      onLeaveList(selectedList.id);
    }

    closeConfirm();
  };

  const confirmTitle =
    confirmAction === "delete"
      ? "Delete shopping list"
      : "Leave shopping list";

  const confirmMessage =
    confirmAction === "delete"
      ? `Do you really want to delete "${selectedList?.title}"?`
      : `Do you really want to leave "${selectedList?.title}"?`;

  const confirmButtonText = confirmAction === "delete" ? "Delete" : "Leave";

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">ShoppingLists</h1>
      </header>

      <div className="list-toolbar">
        <button
          className="link-button"
          type="button"
          onClick={() => setShowArchived((prev) => !prev)}
        >
          {showArchived ? "[Hide archived]" : "[Show archived]"}
        </button>

        <button
          className="primary-button"
          type="button"
          onClick={handleOpenCreate}
        >
          + Add list
        </button>
      </div>

      <main className="app-content">
        <div className="lists-grid">
          {visibleLists.map((list) => {
            const itemsCount = list.items.length;
            const doneCount = list.items.filter((i) => i.done).length;

            return (
              <div className="list-card" key={list.id}>
                <div className="list-title">{list.title}</div>
                <div className="list-line">Items: {itemsCount}</div>
                <div className="list-line">Done: {doneCount}</div>
                <div className="list-line">Role: {list.role}</div>
                {list.archived && <div className="list-line">[Archived]</div>}

                <div className="list-actions">
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => navigate(`/lists/${list.id}`)}
                  >
                    [Open]
                  </button>

                  {list.role === "Owner" && (
                    <>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => onArchiveToggle(list.id)}
                      >
                        {list.archived ? "[Unarchive]" : "[Archive]"}
                      </button>

                      <button
                        className="text-button"
                        type="button"
                        onClick={() => openConfirm("delete", list)}
                      >
                        [Delete]
                      </button>
                    </>
                  )}

                  {list.role === "Member" && (
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => openConfirm("leave", list)}
                    >
                      [Leave]
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {isCreateOpen && (
        <Modal title="Create new shopping list">
          <form onSubmit={handleCreateSubmit}>
            <label className="modal-field">
              List name
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Tesco, Weekend shopping..."
                autoFocus
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleCloseCreate}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmAction && selectedList && (
        <ConfirmModal
          title={confirmTitle}
          message={confirmMessage}
          confirmText={confirmButtonText}
          cancelText="Cancel"
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}
