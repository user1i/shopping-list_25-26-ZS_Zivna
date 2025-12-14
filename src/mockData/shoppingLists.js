export const MOCK_SHOPPING_LISTS = [
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
