package main

import (
	"fmt"
	"time"
	"log"
	"strconv"
	"os"

	"net/http"
	"encoding/json"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/gorilla/mux"
)

var (
	DB *gorm.DB
	err error
)

type Todo struct {
	Id int32 					 `json:"id" gorm:"primaryKey;autoincrement:true"`
	Description string `json:"description"`
	Datetime time.Time `json:"datetime" gorm:"type:timestamp"`
	IsDelete bool			 `json:"isDelete"`
}

type TodoJson struct {
	Id int32 						`json:"id"`
	Description string  `json:"description"`	
	Datetime string 		`json:"datetime"`	
	IsDelete bool				`json:"isDelete"`
}

func main(){

	//fmt.Println("program start")

	setupDB()
	initData()

	handleRequests()
}

func handler(w http.ResponseWriter, r *http.Request){
	//fmt.Fprintf(w, "Path : %s", r.URL.Path)	
	http.ServeFile(w, r, "index.html")
}

func todosGetHandler(w http.ResponseWriter, r *http.Request){

	var (
		todos []Todo
	)

	result := DB.Debug().Where("is_delete = ?", 0).Find(&todos)
	err = result.Error

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(todos)
}

func todoGetHandler(w http.ResponseWriter, r *http.Request){
		vars := mux.Vars(r)
		var todo Todo

		id, err := strconv.ParseUint(vars["id"], 10, 64)
		if err != nil {
			log.Println(err.Error())
		}

		DB.Find(&todo, id)
		json.NewEncoder(w).Encode(todo)
}

func todoPostHandler(w http.ResponseWriter, r *http.Request){

		RFC3339dateLayout := "2006-01-02T15:04"

		var (
			todoJson TodoJson
		 	dbTodo Todo

			id uint64
			err error
		)

		vars := mux.Vars(r)

		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()

		err = decoder.Decode(&todoJson)
		if err != nil {
			log.Println(err.Error())
		}

		log.Println(todoJson)
		dateTime, _ := time.Parse(RFC3339dateLayout, todoJson.Datetime)

		if vars["id"] == "" {
			dbTodo.Description = todoJson.Description
			dbTodo.Datetime  = dateTime 
			dbTodo.IsDelete = false

		} else {
			id, err = strconv.ParseUint(vars["id"], 10, 64)
			if err != nil {
				log.Println(err.Error())
			}

			DB.Find(&dbTodo, id)

			dbTodo.Description = todoJson.Description
			dbTodo.Datetime = dateTime
		}

		DB.Save(&dbTodo)

		json.NewEncoder(w).Encode(&dbTodo)
}

func todoDeleteHandler(w http.ResponseWriter, r *http.Request){
		vars := mux.Vars(r)

		var dbTodo Todo

		id, err := strconv.ParseUint(vars["id"], 10, 64)
		if err != nil {
			log.Println(err.Error())
		}

		DB.Find(&dbTodo, id)
		dbTodo.IsDelete = true 

		DB.Save(&dbTodo)
		json.NewEncoder(w).Encode(&dbTodo)
}

func handleRequests(){

	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/", handler)

	router.PathPrefix("/ui/").Handler(http.StripPrefix("/ui", http.FileServer(http.Dir("./ui"))))

 	router.PathPrefix("/data/").Handler(http.StripPrefix("/data", http.FileServer(http.Dir("./data"))))

	router.PathPrefix("/ui-sqlite/").Handler(http.StripPrefix("/ui-sqlite", http.FileServer(http.Dir("./ui-sqlite"))))

	router.PathPrefix("/data-sqlite/").Handler(http.StripPrefix("/data-sqlite", http.FileServer(http.Dir("./data-sqlite"))))

	router.HandleFunc("/todos", todosGetHandler).Methods("GET")
	router.HandleFunc("/todos/{id}", todoGetHandler).Methods("GET")

	router.HandleFunc("/todos/", todoPostHandler).Methods("POST")
	router.HandleFunc("/todos/{id}", todoPostHandler).Methods("POST")

	router.HandleFunc("/todos/{id}", todoDeleteHandler).Methods("DELETE")

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, router)
}

func setupDB(){
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	//db, err := gorm.Open(sqlite.Open("my-todo.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	DB = db
	db.AutoMigrate(&Todo{})
}

func initData(){

	DB.Exec("delete from todos")

	todo := Todo{
		Description: "cook",
		//Datetime: time.Date(2000, time.January, 1, 1, 0, 0, 0, time.UTC),
		Datetime: time.Now(),
	}

	if DB.Create(&todo).Error != nil {
		fmt.Println(err)
	}

	todo = Todo{
		Description: "read",
		Datetime: time.Now(),
	}

	if DB.Create(&todo).Error != nil {
		fmt.Println(err)
	}
}
