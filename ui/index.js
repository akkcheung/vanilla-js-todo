import { api as data } from "../data/index.js";
import { parseHTML } from "./helpers.js";

//console.log({ api })

//var items = data.listItems()
var items;

console.log({ items });

renderList();
attachEventListeners();

function renderList() {
  const listEl = document.querySelector(".list");
  listEl.innerHTML = "";

  data.listItems().forEach((item) => {
    listEl.append(
      parseHTML(`
			<div class="list-item" data-id="${item.id}">
				<div class-"description">${item.description}</div>
				<div class="datetime">${item.datetime}</div>
			</div>
		`)
    );

    items = data;
  });
}

function attachEventListeners() {
  document.getElementById("add-new-button").onclick = function () {
    document.getElementById("create-item-dialog").show();
  };

  document.addEventListener("click", function (e) {
    //console.log(e)

    if (e.target.classList.contains("dialog-close")) {
      e.preventDefault();
      e.target.closest("dialog").close();
      return false;
    }

    if (e.target.closest(".list-item")) {
      e.preventDefault();

      var dialog = document.getElementById("read-item-dialog");
      dialog.show();

      var itemId = e.target.closest(".list-item").dataset.id;
      //console.log(itemId)

      var itemData = data.readItem(itemId);
      console.log(itemData);

      dialog.querySelector(".description").innerHTML = itemData.description;
      dialog.querySelector(".datetime").innerHTML = itemData.datetime;
      document.querySelector("#read-item-dialog [name=item-id]").value =
        itemData.id;

      return false;
    }
  });

  // submit new item
  document.getElementById("create-item").onclick = function () {
    var item = {
      //description: document.getElementById("description").value,
      //datetime : document.getElementById("datetime").value,
      //
      description: document.querySelector(
        "#create-item-dialog [name=description"
      ).value,
      datetime: document.querySelector("#create-item-dialog [name=datetime")
        .value,
    };

    console.log(item);

    //console.log(typeof item)

    try {
      data.createItem(item);
    } catch (error) {
      alert(error);
    }

    document.querySelector("#create-item-dialog [name=description").value = "";
    document.querySelector("#create-item-dialog [name=datetime").value = "";

    renderList();
    document.getElementById("create-item-dialog").close();
  };

  // open edit-item-dialog
  document.getElementById("edit-item").onclick = function () {
    document.getElementById("read-item-dialog").close();
    var itemId = document.querySelector(
      "#read-item-dialog [name=item-id]"
    ).value;

    //console.log("itemId " + itemId)

    var itemData = data.readItem(itemId);

    document.querySelector("#edit-item-dialog [name=description]").value =
      itemData.description;
    document.querySelector("#edit-item-dialog [name=datetime]").value =
      itemData.datetime;

    document.getElementById("edit-item-dialog").show();
  };

  // edit item
  document.getElementById("update-item").onclick = function () {
    var item = {
      //
      description: document.querySelector("#edit-item-dialog [name=description")
        .value,
      datetime: document.querySelector("#edit-item-dialog [name=datetime")
        .value,
    };

    var itemId = document.querySelector(
      "#read-item-dialog [name=item-id]"
    ).value;

    //console.log(item)
    //console.log(itemId)

    try {
      data.updateItem(itemId, item);
    } catch (error) {
      //console.log(error)
      alert(error);
    }

    document.querySelector("#edit-item-dialog [name=description").value = "";
    document.querySelector("#edit-item-dialog [name=datetime").value = "";

    renderList();
    document.getElementById("edit-item-dialog").close();
  };

  // delete item
  document.getElementById("delete-item").onclick = function () {
    var itemId = document.querySelector(
      "#read-item-dialog [name=item-id]"
    ).value;

    try {
      data.deleteItem(itemId);
    } catch (error) {
      console.log(error);
      //alert(error)
    }

    renderList();
    document.getElementById("read-item-dialog").close();
  };
}
