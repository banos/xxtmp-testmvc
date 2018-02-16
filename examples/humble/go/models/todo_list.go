package models

import (
	"github.com/dchest/uniuri"
	"github.com/go-humble/locstor"
)

// store is a datastore backed by localStorage.
var store = locstor.NewDataStore(locstor.JSONEncoding)

// TodoList is a model representing a list of tobuys.
type TodoList struct {
	tobuys           []*Todo
	changeListeners []func()
}

// OnChange can be used to register change listeners. Any functions passed to
// OnChange will be called when the tobuy list changes.
func (list *TodoList) OnChange(f func()) {
	list.changeListeners = append(list.changeListeners, f)
}

// changed is used to notify the tobuy list and its change listeners of a change.
// Whenever the list is changed, it must be explicitly called.
func (list *TodoList) changed() {
	for _, f := range list.changeListeners {
		f()
	}
}

// Load loads the list of tobuys from the datastore.
func (list *TodoList) Load() error {
	if err := store.Find("tobuys", &list.tobuys); err != nil {
		if _, ok := err.(locstor.ItemNotFoundError); ok {
			return list.Save()
		}
		return err
	}
	for i := range list.tobuys {
		list.tobuys[i].list = list
	}
	return nil
}

// Save saves the list of tobuys to the datastore.
func (list TodoList) Save() error {
	if err := store.Save("tobuys", list.tobuys); err != nil {
		return err
	}
	return nil
}

// AddTodo appends a new tobuy to the list.
func (list *TodoList) AddTodo(title string) {
	list.tobuys = append(list.tobuys, &Todo{
		id:    uniuri.New(),
		title: title,
		list:  list,
	})
	list.changed()
}

// ClearCompleted removes all the tobuys from the list that have been completed.
func (list *TodoList) ClearCompleted() {
	list.tobuys = list.Remaining()
	list.changed()
}

// CheckAll checks all the tobuys in the list, causing them to be in the
// completed state.
func (list *TodoList) CheckAll() {
	for _, tobuy := range list.tobuys {
		tobuy.completed = true
	}
	list.changed()
}

// UncheckAll unchecks all the tobuys in the list, causing them to be in the
// active/remaining state.
func (list *TodoList) UncheckAll() {
	for _, tobuy := range list.tobuys {
		tobuy.completed = false
	}
	list.changed()
}

// DeleteById removes the tobuy with the given id from the list.
func (list *TodoList) DeleteById(id string) {
	list.tobuys = list.Filter(tobuyNotById(id))
	list.changed()
}
