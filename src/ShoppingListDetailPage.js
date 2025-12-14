import React, { useMemo, useState } from "react";
import "./App.css";

import ListHeader from "./components/detail/ListHeader";
import ItemsSection from "./components/detail/ItemsSection";
import MembersSection from "./components/detail/MembersSection";
import Modal from "./components/detail/Modal";

export default function ShoppingListDetailPage({
  list,
  onBack,
  onRename,
  onItemsChange,
  onMembersChange,
  onLeave,
}) {
  const isOwner = list.role === "Owner";

  const [showCompleted, setShowCompleted] = useState(false);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const items = list.items;
  const members = list.members;

  const visibleItems = useMemo(() => {
    return showCompleted ? items : items.filter((item) => !item.done);
  }, [items, showCompleted]);

  // ---------- Rename ----------
  const openRenameModal = () => {
    setRenameTitle(list.title);
    setIsRenameOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameOpen(false);
    setRenameTitle("");
  };

  const handleRenameSubmit = (event) => {
    event.preventDefault();
    const trimmed = renameTitle.trim();
    if (!trimmed) return;
    onRename(trimmed);
    closeRenameModal();
  };

  // ---------- Items ----------
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

  // ---------- Members ----------
  const openAddMemberModal = () => {
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
      { id: nextId, name: trimmed, role: "Member", isCurrentUser: false },
    ];

    onMembersChange(nextMembers);
    closeAddMemberModal();
  };

  const handleRemoveMember = (memberId) => {
    const nextMembers = members.filter((m) => m.id !== memberId);
    onMembersChange(nextMembers);
  };

  return (
    <div className="detail-page">
      <ListHeader
        title={list.title}
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
          onToggleShowCompleted={() => setShowCompleted((prev) => !prev)}
          onAddItem={openAddItemModal}
        />

        <MembersSection
          members={members}
          isOwner={isOwner}
          onAddMember={openAddMemberModal}
          onRemoveMember={handleRemoveMember}
          onLeave={onLeave}
        />
      </div>

      {isRenameOpen && (
        <Modal title="Rename shopping list">
          <form onSubmit={handleRenameSubmit}>
            <label className="modal-field">
              New list name
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
                Rename
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isAddItemOpen && (
        <Modal title="Add item">
          <form onSubmit={handleAddItemSubmit}>
            <label className="modal-field">
              Item name
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Milk, Bread..."
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
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isAddMemberOpen && (
        <Modal title="Add member">
          <form onSubmit={handleAddMemberSubmit}>
            <label className="modal-field">
              Member name
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="e.g. Petr..."
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
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
