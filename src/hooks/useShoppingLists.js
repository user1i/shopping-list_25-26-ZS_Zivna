import { useEffect, useState } from "react";
import { api } from "../api";

export function useShoppingLists() {
  const [lists, setLists] = useState([]);
  const [status, setStatus] = useState("pending"); // pending | ready | error
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setStatus("pending");
      setError(null);
      const data = await api.getLists();
      setLists(data);
      setStatus("ready");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createList = async (title) => {
    try {
      setError(null);
      const created = await api.createList(title);
      setLists((prev) => [...prev, created]);
    } catch (e) {
      setError(e);
    }
  };

  const archiveToggle = async (id) => {
    const current = lists.find((l) => l.id === id);
    if (!current) return;
    try {
      setError(null);
      const updated = await api.updateList(id, { archived: !current.archived });
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (e) {
      setError(e);
    }
  };

  const deleteList = async (id) => {
    try {
      setError(null);
      await api.deleteList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      setError(e);
    }
  };

  const leaveList = async (id) => {
    try {
      setError(null);
      await api.leaveList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      setError(e);
    }
  };

  const renameList = async (id, title) => {
    try {
      setError(null);
      const updated = await api.updateList(id, { title });
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (e) {
      setError(e);
    }
  };

  const updateItems = async (id, items) => {
    try {
      setError(null);
      const updated = await api.updateList(id, { items });
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (e) {
      setError(e);
    }
  };

  const updateMembers = async (id, members) => {
    try {
      setError(null);
      const updated = await api.updateList(id, { members });
      setLists((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (e) {
      setError(e);
    }
  };

  return {
    lists,
    status,
    error,
    reload: load,
    createList,
    archiveToggle,
    deleteList,
    leaveList,
    renameList,
    updateItems,
    updateMembers,
  };
}
