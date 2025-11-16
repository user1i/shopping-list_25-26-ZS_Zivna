// src/ShoppingListDetailPage.js
import React, { useState } from "react";
import "./App.css";

const INITIAL_ITEMS = [
  { id: 1, name: "Mléko", done: false },
  { id: 2, name: "Chleba", done: true },
  { id: 3, name: "Sušenky", done: true },
];

// podle role na listu vrátíme, jestli jsi Owner nebo Member
function getInitialMembers(listRole) {
  if (listRole === "Owner") {
    return [
      { id: 1, name: "You", role: "Owner", isCurrentUser: true },
      { id: 2, name: "Anežka", role: "Member", isCurrentUser: false },
      { id: 3, name: "Bert", role: "Member", isCurrentUser: false },
    ];
  }

  // varianta, kdy jsi na listu Member
  return [
    { id: 1, name: "Anežka", role: "Owner", isCurrentUser: false },
    { id: 2, name: "You", role: "Member", isCurrentUser: true },
    { id: 3, name: "Bert", role: "Member", isCurrentUser: false },
  ];
}

function ShoppingListDetailPage({ list, onBack }) {
  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showCompleted, setShowCompleted] = useState(true);
  const [members, setMembers] = useState(getInitialMembers(list.role));

  const currentUser = members.find((m) => m.isCurrentUser);
  const isOwner = currentUser?.role === "Owner";

  // --- handlers ---

  const handleRename = () => {
    if (!isOwner) return;

    const newTitle = window.prompt("New list name:", title);
    if (!newTitle) return;

    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setTitle(trimmed);
    // Pozn.: název se mění v detailu; pokud ho chceš měnit i v přehledu,
    // museli bychom LISTS zvednout do useState v App.js.
  };

  const handleToggleItemDone = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const name = window.prompt("New item:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    setItems((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1;
      return [...prev, { id: nextId, name: trimmed, done: false }];
    });
  };

  const handleToggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleAddMember = () => {
    if (!isOwner) return;

    const name = window.prompt("New member name:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    setMembers((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((m) => m.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          name: trimmed,
          role: "Member",
          isCurrentUser: false,
        },
      ];
    });
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLeave = () => {
    // jednoduchá varianta: smažeme aktuálního usera a vrátíme se na přehled
    setMembers((prev) => prev.filter((m) => !m.isCurrentUser));
    onBack();
  };

  const visibleItems = items.filter(
    (item) => showCompleted || !item.done
  );

  // --- render ---

  return (
    <div className="detail-page">
      {/* horní část – Back + název + Rename */}
      <div className="detail-header">
        <button
          type="button"
          className="link-button"
          onClick={onBack}
        >
          {"< Back"}
        </button>

        <div className="detail-title-row">
          <h1 className="detail-title">Shopping List: {title}</h1>
          {isOwner && (
            <button
              type="button"
              className="link-button"
              onClick={handleRename}
            >
              [Rename]
            </button>
          )}
        </div>
      </div>

      {/* dvě kolony vedle sebe – Items | Members */}
      <div className="detail-columns">
        {/* ITEMS LEVÁ STRANA */}
        <div className="detail-column detail-items">
          <div className="detail-section-title">Items</div>
          <ul className="detail-items-list">
            {visibleItems.map((item) => (
              <li key={item.id} className="detail-item-row">
                <span
                  className="detail-checkbox"
                  onClick={() => handleToggleItemDone(item.id)}
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
                  onClick={() => handleDeleteItem(item.id)}
                >
                  [Delete]
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="link-button"
            onClick={handleToggleShowCompleted}
          >
            {showCompleted ? "[Hide completed]" : "[Show completed]"}
          </button>
        </div>

        {/* MEMBERS PRAVÁ STRANA */}
        <div className="detail-column detail-members">
          <div className="detail-section-title">
            Members (Owner + invited users)
            {isOwner && (
              <button
                type="button"
                className="link-button"
                style={{ marginLeft: 8 }}
                onClick={handleAddMember}
              >
                [Add member]
              </button>
            )}
          </div>

          <ul className="detail-members-list">
            {members.map((member) => (
              <li key={member.id} className="detail-member-row">
                <span className="detail-member-text">
                  {member.name} ({member.role})
                </span>

                {/* Owner: může mazat ostatní členy */}
                {isOwner && !member.isCurrentUser && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    [Remove]
                  </button>
                )}

                {/* Member: může odejít */}
                {!isOwner && member.isCurrentUser && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={handleLeave}
                  >
                    [Leave]
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* plusko dole – přidává položku */}
      <button className="fab" type="button" onClick={handleAddItem}>
        +
      </button>
    </div>
  );
}

export default ShoppingListDetailPage;
