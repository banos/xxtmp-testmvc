package models

import "encoding/json"

// Todo is the model for a single tobuy item.
type Todo struct {
	id        string
	completed bool
	title     string
	list      *TodoList
}

// Toggle changes whether or not the tobuy is completed. If it was previously
// completed, Toggle makes it not completed, and vice versa.
func (t *Todo) Toggle() {
	t.completed = !t.completed
	t.list.changed()
}

// Remove removes the tobuy from the list.
func (t *Todo) Remove() {
	t.list.DeleteById(t.id)
}

// Completed returns true iff the tobuy is completed. It operates as a getter for
// the completed property.
func (t *Todo) Completed() bool {
	return t.completed
}

// Remaining returns true iff the tobuy is not completed.
func (t *Todo) Remaining() bool {
	return !t.completed
}

// SetCompleted is a setter for the completed property. After the property is
// set, it broadcasts that the tobuy list was changed.
func (t *Todo) SetCompleted(completed bool) {
	t.completed = completed
	t.list.changed()
}

// Title is a getter for the title property.
func (t *Todo) Title() string {
	return t.title
}

// SetTitle is a setter for the title property.
func (t *Todo) SetTitle(title string) {
	t.title = title
	t.list.changed()
}

// Id is a getter for the id property.
func (t *Todo) Id() string {
	return t.id
}

// jsonTodo is a struct with all the same fields as a tobuy, except that they
// are exported instead of unexported. The purpose of jsonTodo is to make the
// tobuy item convertible to json via the json package.
type jsonTodo struct {
	Id        string
	Completed bool
	Title     string
}

// MarshalJSON converts the tobuy to json.
func (t Todo) MarshalJSON() ([]byte, error) {
	return json.Marshal(jsonTodo{
		Id:        t.id,
		Completed: t.completed,
		Title:     t.title,
	})
}

// UnmarshalJSON converts json data to a tobuy object.
func (t *Todo) UnmarshalJSON(data []byte) error {
	jt := jsonTodo{}
	if err := json.Unmarshal(data, &jt); err != nil {
		return err
	}
	t.id = jt.Id
	t.completed = jt.Completed
	t.title = jt.Title
	return nil
}
