import db from './db.js'

var id = 1;

function loadTestData(){
	[
		{
			description: 'Chores',
			datetime: '2022-09-20T18:30',
			isDelete: false,
		},
		{
			description: 'Exercise',
			datetime: '2022-09-20T18:31',
			isDelete: false,
		},
	].forEach(createItem)		
}

loadTestData()

function isObject(variable){
	return typeof variable === 'object'
}

function generateId(){
	return ++id
}

function listItems(){
	//return JSON.parse(JSON.stringify(db)
	return JSON.parse(JSON.stringify(db.filter(item => item.isDelete == false)))

}

function createItem(item){

	if (!isObject(item) || !item?.description || !item?.datetime){
		throw new Error("Item is invalid.")
	}

	item.id = generateId()
	item.isDelete = false
	db.push(item)

	return item
}

function readItem(id){

	var item = db.find(item => item.id == id)
	return JSON.parse(JSON.stringify(item))

}

function updateItem(id, item){

	if (!isObject(item) || !item?.description || !id){
		throw new Error("Item is invalid.")
	}

	var dbItem = db.find(item => item.id == id)

	dbItem.description = item.description
	dbItem.datetime= item.datetime

	console.log("dbItem " + dbItem)

	return item
}

function deleteItem(id){

	var dbItem = db.find(item => item.id == id)
	dbItem.isDelete = true 

	console.log(dbItem)
}

export const logic = {
	listItems,
	createItem,
	readItem,
	updateItem,
	deleteItem,
}
