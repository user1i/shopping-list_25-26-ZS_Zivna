import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import ShoppingListsPage from "./pages/ShoppingListsPage";
import ShoppingListDetailRoute from "./pages/ShoppingListDetailRoute";
import { useShoppingLists } from "./hooks/useShoppingLists";

function App() {
  const {
    lists,
    status,
    error,
    reload,
    createList,
    archiveToggle,
    deleteList,
    leaveList,
    renameList,
    updateItems,
    updateMembers,
  } = useShoppingLists();

  if (status === "pending") {
    return (
      <div className="App">
        <div className="app-content">Loading...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="App">
        <div className="app-content">
          <div>Failed to load data.</div>
          <button className="primary-button" onClick={reload}>
            Retry
          </button>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(error?.message || error)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ShoppingListsPage
            lists={lists}
            onCreateList={createList}
            onArchiveToggle={archiveToggle}
            onDeleteList={deleteList}
            onLeaveList={leaveList}
          />
        }
      />
      <Route
        path="/lists/:id"
        element={
          <ShoppingListDetailRoute
            lists={lists}
            onRenameList={renameList}
            onUpdateItems={updateItems}
            onUpdateMembers={updateMembers}
            onLeaveList={leaveList}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
