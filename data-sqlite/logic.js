import db from './db.js'

//var id = 1;

//function loadTestData(){
//	[
//		{
//			description: 'Chores',
//			datetime: '2022-09-20T18:30',
//			isDelete: false,
//		},
//		{
//			description: 'Exercise',
//			datetime: '2022-09-20T18:31',
//			isDelete: false,
//		},
//	].forEach(createItem)		
//}


async function loadData(){

	const resp = await fetch('/todos')
	const data = await resp.json()

	console.log("loadData()")
	console.log(data)
	return data

//	data.forEach(obj => {
//		console.log(obj)
//		createItem(obj)
//	})

}

function isObject(variable){
	return typeof variable === 'object'
}

//function generateId(){
//	return ++id
//}

async function listItems(){
	//return JSON.parse(JSON.stringify(db)
	//return JSON.parse(JSON.stringify(db.filter(item => item.isDelete == false)))

	loadData().then(data => {
			console.log("listItems()")
			console.log(data)
			return data
	})
}

async function createItem(item){

	if (!isObject(item) || !item?.description || !item?.datetime){
		throw new Error("Item is invalid.")
	}

	//item.id = generateId()
	//item.isDelete = false

	//db.push(item)
	
	let dbItem
	
	const resp = await fetch('/todos/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			description: item.description,
			datetime: item.datetime,
		})
	})

	dbItem = await resp.json()
	console.log("dbItem " + dbItem)
}

async function readItem(id){

	//var item = db.find(item => item.id == id)
	const resp = await fetch('/todos/' + id)
	const data = await resp.json()
	 
	console.log('readItem()')
	console.log(data)

	return JSON.parse(JSON.stringify(data))

}

async function updateItem(id, item){

	if (!isObject(item) || !item?.description || !id){
		throw new Error("Item is invalid.")
	}

	//var dbItem = db.find(item => item.id == id)
	let dbItem
	
	//dbItem.description = item.description
	//dbItem.datetime= item.datetime
	//
		const resp = await fetch('/todos/' + id, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: item.id,
			description: item.description,
			datetime: item.datetime
		})
	})

	dbItem = await resp.json()
	console.log("dbItem " + dbItem)

	//return item
}

async function deleteItem(id){

	//var dbItem = db.find(item => item.id == id)
	//dbItem.isDelete = true 

	const resp = await fetch('/todos/' + id, {
		method: 'DELETE',
	})

	const data = await resp.json()
	//console.log("data:" + data)

}

export const logic = {
	listItems,
	createItem,
	readItem,
	updateItem,
	deleteItem,
	loadData,
}
