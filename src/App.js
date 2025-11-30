// src/App.js
import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ShoppingListDetailPage from "./ShoppingListDetailPage";

const INITIAL_LISTS = [
  {
    id: 1,
    title: "Kaufland",
    role: "Owner",
    archived: false,
    items: [
      { id: 1, name: "Mléko", done: false },
      { id: 2, name: "Chleba", done: true },
      { id: 3, name: "Sušenky", done: true },
    ],
    members: [
      { id: 1, name: "You", role: "Owner", isCurrentUser: true },
      { id: 2, name: "Anežka", role: "Member", isCurrentUser: false },
      { id: 3, name: "Bert", role: "Member", isCurrentUser: false },
    ],
  },
  {
    id: 2,
    title: "Billa",
    role: "Member",
    archived: false,
    items: [
      { id: 1, name: "Těstoviny", done: false },
      { id: 2, name: "Sýr", done: false },
    ],
    members: [
      { id: 1, name: "Petr", role: "Owner", isCurrentUser: false },
      { id: 2, name: "You", role: "Member", isCurrentUser: true },
      { id: 3, name: "Lenka", role: "Member", isCurrentUser: false },
    ],
  },
  {
    id: 3,
    title: "DM drogerie",
    role: "Owner",
    archived: true,
    items: [
      { id: 1, name: "Šampon", done: true },
      { id: 2, name: "Kondicionér", done: true },
    ],
    members: [
      { id: 1, name: "You", role: "Owner", isCurrentUser: true },
      { id: 2, name: "Anežka", role: "Member", isCurrentUser: false },
    ],
  },
];

function ShoppingListsPage({
  lists,
  onCreateList,
  onArchiveToggle,
  onDeleteList,
  onLeaveList,
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const visibleLists = lists.filter(
    (list) => showArchived || !list.archived
  );

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

  const handleDeleteClick = (list) => {
    const ok = window.confirm(
      `Opravdu chceš smazat nákupní seznam "${list.title}"?`
    );
    if (!ok) return;

    onDeleteList(list.id);
  };

  const handleLeaveClick = (list) => {
    const ok = window.confirm(
      `Opravdu chceš opustit nákupní seznam "${list.title}"?`
    );
    if (!ok) return;

    onLeaveList(list.id);
  };

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
                {list.archived && (
                  <div className="list-line">[Archived]</div>
                )}

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
                        onClick={() => handleDeleteClick(list)}
                      >
                        [Delete]
                      </button>
                    </>
                  )}

                  {list.role === "Member" && (
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => handleLeaveClick(list)}
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
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Create new shopping list</h2>
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
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingListDetailRoute({
  lists,
  onRenameList,
  onUpdateItems,
  onUpdateMembers,
  onLeaveList,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
  const list = lists.find((l) => l.id === numericId);

  if (!list) {
    return <Navigate to="/" replace />;
  }

  const handleLeaveFromDetail = () => {
    onLeaveList(list.id);
    navigate("/");
  };

  return (
    <div className="App">
      <ShoppingListDetailPage
        list={list}
        onBack={() => navigate("/")}
        onRename={(newTitle) => onRenameList(list.id, newTitle)}
        onItemsChange={(newItems) => onUpdateItems(list.id, newItems)}
        onMembersChange={(newMembers) => onUpdateMembers(list.id, newMembers)}
        onLeave={handleLeaveFromDetail}
      />
    </div>
  );
}

function App() {
  const [lists, setLists] = useState(INITIAL_LISTS);

  const updateListById = (id, updater) => {
    setLists((prev) =>
      prev.map((list) => (list.id === id ? updater(list) : list))
    );
  };

  const handleCreateList = (title) => {
    setLists((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          title,
          role: "Owner",
          archived: false,
          items: [],
          members: [
            { id: 1, name: "You", role: "Owner", isCurrentUser: true },
          ],
        },
      ];
    });
  };

  const handleArchiveToggle = (id) => {
    updateListById(id, (list) => ({ ...list, archived: !list.archived }));
  };

  const handleDeleteList = (id) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleLeaveList = (id) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleRenameList = (id, newTitle) => {
    updateListById(id, (list) => ({ ...list, title: newTitle }));
  };

  const handleUpdateItems = (id, newItems) => {
    updateListById(id, (list) => ({ ...list, items: newItems }));
  };

  const handleUpdateMembers = (id, newMembers) => {
    updateListById(id, (list) => ({ ...list, members: newMembers }));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ShoppingListsPage
            lists={lists}
            onCreateList={handleCreateList}
            onArchiveToggle={handleArchiveToggle}
            onDeleteList={handleDeleteList}
            onLeaveList={handleLeaveList}
          />
        }
      />
      <Route
        path="/lists/:id"
        element={
          <ShoppingListDetailRoute
            lists={lists}
            onRenameList={handleRenameList}
            onUpdateItems={handleUpdateItems}
            onUpdateMembers={handleUpdateMembers}
            onLeaveList={handleLeaveList}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
