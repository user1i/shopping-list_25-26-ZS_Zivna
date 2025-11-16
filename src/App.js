// src/App.js
import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import "./App.css";
import ShoppingListDetailPage from "./ShoppingListDetailPage";

// Základní seznamy – jen přehled (Items/Done/Role)
const INITIAL_LISTS = [
  {
    id: 1,
    title: "Kaufland",
    items: 8,
    done: 2,
    role: "Owner",
    archived: false,
  },
  {
    id: 2,
    title: "Billa",
    items: 12,
    done: 3,
    role: "Member",
    archived: false,
  },
];

// Přehled nákupních seznamů (ShoppingLists)
function ShoppingListsPage({ lists }) {
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();

  const visibleLists = lists.filter(
    (list) => showArchived || !list.archived
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">ShoppingLists</h1>
        <button
          className="link-button"
          type="button"
          onClick={() => setShowArchived((prev) => !prev)}
        >
          {showArchived ? "Hide archived" : "Show archived"}
        </button>
      </header>

      <main className="app-content">
        <div className="lists-grid">
          {visibleLists.map((list) => (
            <div className="list-card" key={list.id}>
              <div className="list-title">{list.title}</div>
              <div className="list-line">Items: {list.items}</div>
              <div className="list-line">Done: {list.done}</div>
              <div className="list-line">Role: {list.role}</div>

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
                    <button className="text-button" type="button">
                      [Archive]
                    </button>
                    <button className="text-button" type="button">
                      [Delete]
                    </button>
                  </>
                )}

                {list.role === "Member" && (
                  <button className="text-button" type="button">
                    [Leave]
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="fab" type="button">
          +
        </button>
      </main>
    </div>
  );
}

// Wrapper pro route s detailem – vytáhne :id z URL a předá ho do detailu
function ShoppingListDetailRoute({ lists }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const numericId = Number(id);
  const list = lists.find((l) => l.id === numericId);

  // Když id neexistuje → přesměruj zpět na přehled
  if (!list) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="App">
      <ShoppingListDetailPage
        list={list}
        onBack={() => navigate("/")}
      />
    </div>
  );
}

function App() {
  // Zatím jen stav pro seznamy – připravené na budoucí business logiku
  const [lists] = useState(INITIAL_LISTS);

  return (
    <Routes>
      <Route path="/" element={<ShoppingListsPage lists={lists} />} />
      <Route path="/lists/:id" element={<ShoppingListDetailRoute lists={lists} />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
