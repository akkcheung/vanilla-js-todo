import { logic } from "./logic.js";

function listItems() {
  return logic.listItems();
}

function createItem(item) {
  return logic.createItem(item);
}

function readItem(id) {
  return logic.readItem(id);
}

function updateItem(id, item) {
  return logic.updateItem(id, item);
}

function deleteItem(id) {
  return logic.deleteItem(id);
}

export const api = {
  listItems,
  createItem,
  readItem,
  updateItem,
  deleteItem,
};
