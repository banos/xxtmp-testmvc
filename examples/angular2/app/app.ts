import {Component} from 'angular2/core';
import {TodoStore, Todo} from './services/store';

@Component({
	selector: 'tobuy-app',
	templateUrl: 'app/app.html'
})
export default class TodoApp {
	tobuyStore: TodoStore;
	newTodoText = '';

	constructor(tobuyStore: TodoStore) {
		this.tobuyStore = tobuyStore;
	}

	stopEditing(tobuy: Todo, editedTitle: string) {
		tobuy.title = editedTitle;
		tobuy.editing = false;
	}

	cancelEditingTodo(tobuy: Todo) {
		tobuy.editing = false;
	}

	updateEditingTodo(tobuy: Todo, editedTitle: string) {
		editedTitle = editedTitle.trim();
		tobuy.editing = false;

		if (editedTitle.length === 0) {
			return this.tobuyStore.remove(tobuy);
		}

		tobuy.title = editedTitle;
	}

	editTodo(tobuy: Todo) {
		tobuy.editing = true;
	}

	removeCompleted() {
		this.tobuyStore.removeCompleted();
	}

	toggleCompletion(tobuy: Todo) {
		this.tobuyStore.toggleCompletion(tobuy);
	}

	remove(tobuy: Todo){
		this.tobuyStore.remove(tobuy);
	}

	addTodo() {
		if (this.newTodoText.trim().length) {
			this.tobuyStore.add(this.newTodoText);
			this.newTodoText = '';
		}
	}
}
