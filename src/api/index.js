import { mockShoppingListApi } from "./mockShoppingListApi";

export const USE_MOCK = true;

export const api = USE_MOCK ? mockShoppingListApi : mockShoppingListApi;
