import { parseHTML, parseDateTime } from './helpers.js'
import {logic} from '../data-sqlite/logic.js'

var items

renderList()

attachEventListeners()

function renderList(){
	const listEl = document.querySelector('.list')
	listEl.innerHTML = ""

	logic.loadData()
		.then(data => { 
			data.forEach( item => {
		listEl.append(parseHTML(`
			<div class="list-item" data-id="${item.id}">
				<div class-"description">
					${item.description}
				</div>
				<div class="datetime">
					${parseDateTime(item.datetime)}
				</div>
			</div>
		`))
	})

		}
	)
}

function attachEventListeners(){

		document.getElementById("add-new-button").onclick = function (){
			document.getElementById("create-item-dialog").show()
		}
	
		document.addEventListener('click', function(e){
			//console.log(e)
			
			if (e.target.classList.contains('dialog-close')){
					e.preventDefault()
					e.target.closest('dialog').close()
					return false
			}

			if (e.target.closest('.list-item')){
					e.preventDefault()
					
					var dialog = document.getElementById("read-item-dialog")
					dialog.show()

					var itemId = e.target.closest('.list-item').dataset.id

				  logic.readItem(itemId).then(data => {
						const itemData = data
						//console.log(itemData)

						dialog.querySelector('.description').innerHTML = itemData.description		
						dialog.querySelector('.datetime').innerHTML = parseDateTime(itemData.datetime)
						document.querySelector("#read-item-dialog [name=item-id]").value = itemData.id
					})

					return false
			}
		})

	  // submit new item
		document.getElementById("create-item").onclick = function (){
			var item = {
					description: document.querySelector("#create-item-dialog [name=description").value,
					datetime: document.querySelector("#create-item-dialog [name=datetime").value,
					isDelete: false,
			}

			console.log(item)

			try {
				logic.createItem(item).then(data => 
					{
					console.log(data)
					renderList()
					}
				)
			} catch (error) {
				alert(error)
			}

			document.querySelector("#create-item-dialog [name=description").value = ""
			document.querySelector("#create-item-dialog [name=datetime").value = ""

			//renderList()
			document.getElementById("create-item-dialog").close()
		}
	
		// open edit-item-dialog
		document.getElementById("edit-item").onclick = function(){

				document.getElementById("read-item-dialog").close()
				var itemId = document.querySelector("#read-item-dialog [name=item-id]").value

				logic.readItem(itemId).then(data => {
					const itemData = data

				document.querySelector("#edit-item-dialog [name=description]").value = itemData.description
				document.querySelector("#edit-item-dialog [name=datetime]").value = parseDateTime(itemData.datetime)
				})

				document.getElementById("edit-item-dialog").show()
		}
		
		// edit item
		document.getElementById("update-item").onclick = function (){
			var itemId = document.querySelector("#read-item-dialog [name=item-id]").value

			var item = {
					id: parseInt(itemId),
					description: document.querySelector("#edit-item-dialog [name=description").value,
					datetime: document.querySelector("#edit-item-dialog [name=datetime").value,
					isDelete: false,
			}

			try {
				logic.updateItem(itemId, item).then(data => 
					{
					console.log(data)
					renderList()
					}
				)
			} catch (error) {
				alert(error)
			}

			document.querySelector("#edit-item-dialog [name=description").value = ""
			document.querySelector("#edit-item-dialog [name=datetime").value = ""

			document.getElementById("edit-item-dialog").close()
		}

		// delete item
		document.getElementById("delete-item").onclick = function (){

			var itemId = document.querySelector("#read-item-dialog [name=item-id]").value

			try {
				logic.deleteItem(itemId).then(data =>
				{
					console.log(data)
					renderList()
				})
			} catch (error) {
				console.log(error)
			}

			//renderList()
			document.getElementById("read-item-dialog").close()
		}
}
