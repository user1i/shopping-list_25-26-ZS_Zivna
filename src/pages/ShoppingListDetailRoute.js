import React from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import "../App.css";
import ShoppingListDetailPage from "../ShoppingListDetailPage";

export default function ShoppingListDetailRoute({
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
