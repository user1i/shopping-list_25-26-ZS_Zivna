import { MOCK_SHOPPING_LISTS } from "../mockData/shoppingLists";

let lists = structuredClone(MOCK_SHOPPING_LISTS);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const deepClone = (value) => structuredClone(value);

const nextId = () => (lists.length ? Math.max(...lists.map((l) => l.id)) + 1 : 1);

export const mockShoppingListApi = {
  async getLists() {
    //throw new Error("Test error");    //<-- error test při refreshi stranky
    await delay(300);
    return deepClone(lists);
  },

  async createList(title) {
    await delay(250);
    const id = nextId();
    const newList = {
      id,
      title,
      role: "Owner",
      archived: false,
      items: [],
      members: [{ id: 1, name: "You", role: "Owner", isCurrentUser: true }],
    };
    lists = [...lists, newList];
    return deepClone(newList);
  },

  async updateList(id, patch) {
    await delay(200);
    lists = lists.map((l) => (l.id === id ? { ...l, ...patch } : l));
    const updated = lists.find((l) => l.id === id);
    if (!updated) throw new Error("List not found");
    return deepClone(updated);
  },

  async deleteList(id) {
    await delay(200);
    lists = lists.filter((l) => l.id !== id);
    return true;
  },

  async leaveList(id) {
    await delay(200);
    // pro naši app logiku: leave = remove list from visible lists
    lists = lists.filter((l) => l.id !== id);
    return true;
  },
};
