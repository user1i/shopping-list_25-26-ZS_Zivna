// src/ShoppingListDetailPage.js
import React, { useState } from "react";
import "./App.css";

function ListHeader({ title, isOwner, onBack, onRename }) {
  return (
    <div className="detail-header">
      <button type="button" className="link-button" onClick={onBack}>
        {"< Back"}
      </button>

      <div className="detail-title-row">
        <h1 className="detail-title">Shopping List: {title}</h1>
        {isOwner && (
          <button
            type="button"
            className="link-button"
            onClick={onRename}
          >
            [Rename]
          </button>
        )}
      </div>
    </div>
  );
}

function ItemsSection({
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
            <span
              className="detail-checkbox"
              onClick={() => onToggleItemDone(item.id)}
              style={{ cursor: "pointer" }}
            >
              [{item.done ? "✓" : " "}]
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

function MembersSection({
  members,
  isOwner,
  onAddMember,
  onRemoveMember,
  onLeave,
}) {
  return (
    <div className="detail-column detail-members">
      <div className="detail-section-header">
        <div className="detail-section-title">
          Members (Owner + invited users)
          {isOwner && (
            <button
              type="button"
              className="primary-button inline-add-button"
              onClick={onAddMember}
            >
              + Add member
            </button>
          )}
        </div>
      </div>

      <ul className="detail-members-list">
        {members.map((member) => (
          <li key={member.id} className="detail-member-row">
            <span className="detail-member-text">
              {member.name} ({member.role})
            </span>

            {isOwner && !member.isCurrentUser && (
              <button
                type="button"
                className="text-button"
                onClick={() => onRemoveMember(member.id)}
              >
                [Remove]
              </button>
            )}

            {!isOwner && member.isCurrentUser && (
              <button
                type="button"
                className="text-button"
                onClick={onLeave}
              >
                [Leave]
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShoppingListDetailPage({
  list,
  onBack,
  onRename,
  onItemsChange,
  onMembersChange,
  onLeave,
}) {
  const { title, items, members } = list;
  const [showCompleted, setShowCompleted] = useState(true);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState(title);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const currentUser = members.find((m) => m.isCurrentUser);
  const isOwner = currentUser?.role === "Owner";

  const openRenameModal = () => {
    setRenameTitle(title);
    setIsRenameOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameOpen(false);
  };

  const handleRenameSubmit = (event) => {
    event.preventDefault();
    const trimmed = renameTitle.trim();
    if (!trimmed || trimmed === title) {
      closeRenameModal();
      return;
    }
    onRename(trimmed);
    closeRenameModal();
  };

  const handleToggleItemDone = (id) => {
    const nextItems = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onItemsChange(nextItems);
  };

  const handleDeleteItem = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    onItemsChange(nextItems);
  };

  const openAddItemModal = () => {
    setNewItemName("");
    setIsAddItemOpen(true);
  };

  const closeAddItemModal = () => {
    setIsAddItemOpen(false);
    setNewItemName("");
  };

  const handleAddItemSubmit = (event) => {
    event.preventDefault();
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const nextItems = [...items, { id: nextId, name: trimmed, done: false }];
    onItemsChange(nextItems);
    closeAddItemModal();
  };

  const handleToggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const openAddMemberModal = () => {
    if (!isOwner) return;
    setNewMemberName("");
    setIsAddMemberOpen(true);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberOpen(false);
    setNewMemberName("");
  };

  const handleAddMemberSubmit = (event) => {
    event.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    const nextId = members.length
      ? Math.max(...members.map((m) => m.id)) + 1
      : 1;

    const nextMembers = [
      ...members,
      {
        id: nextId,
        name: trimmed,
        role: "Member",
        isCurrentUser: false,
      },
    ];
    onMembersChange(nextMembers);
    closeAddMemberModal();
  };

  const handleRemoveMember = (id) => {
    const nextMembers = members.filter((m) => m.id !== id);
    onMembersChange(nextMembers);
  };

  const handleLeave = () => {
    const nextMembers = members.filter((m) => !m.isCurrentUser);
    onMembersChange(nextMembers);

    if (onLeave) {
      onLeave();
    } else {
      onBack();
    }
  };

  const visibleItems = items.filter(
    (item) => showCompleted || !item.done
  );

  return (
    <div className="detail-page">
      <ListHeader
        title={title}
        isOwner={isOwner}
        onBack={onBack}
        onRename={openRenameModal}
      />

      <div className="detail-columns">
        <ItemsSection
          visibleItems={visibleItems}
          showCompleted={showCompleted}
          onToggleItemDone={handleToggleItemDone}
          onDeleteItem={handleDeleteItem}
          onToggleShowCompleted={handleToggleShowCompleted}
          onAddItem={openAddItemModal}
        />

        <MembersSection
          members={members}
          isOwner={isOwner}
          onAddMember={openAddMemberModal}
          onRemoveMember={handleRemoveMember}
          onLeave={handleLeave}
        />
      </div>

      {isAddItemOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Create new item</h2>
            <form onSubmit={handleAddItemSubmit}>
              <label className="modal-field">
                Item name
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Banány, Máslo..."
                  autoFocus
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeAddItemModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRenameOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Rename shopping list</h2>
            <form onSubmit={handleRenameSubmit}>
              <label className="modal-field">
                New name
                <input
                  type="text"
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  autoFocus
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeRenameModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddMemberOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Add member</h2>
            <form onSubmit={handleAddMemberSubmit}>
              <label className="modal-field">
                Member name
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Jana..."
                  autoFocus
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeAddMemberModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListDetailPage;
