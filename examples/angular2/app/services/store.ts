export class Todo {
	completed: Boolean;
	editing: Boolean;

	private _title: String;
	get title() {
		return this._title;
	}
	set title(value: String) {
		this._title = value.trim();
	}

	constructor(title: String) {
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
	}
}

export class TodoStore {
	tobuys: Array<Todo>;

	constructor() {
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-tobuys') || '[]');
		// Normalize back into classes
		this.tobuys = persistedTodos.map( (tobuy: {_title: String, completed: Boolean}) => {
			let ret = new Todo(tobuy._title);
			ret.completed = tobuy.completed;
			return ret;
		});
	}

	private updateStore() {
		localStorage.setItem('angular2-tobuys', JSON.stringify(this.tobuys));
	}

	private getWithCompleted(completed: Boolean) {
		return this.tobuys.filter((tobuy: Todo) => tobuy.completed === completed);
	}

	allCompleted() {
		return this.tobuys.length === this.getCompleted().length;
	}

	setAllTo(completed: Boolean) {
		this.tobuys.forEach((t: Todo) => t.completed = completed);
		this.updateStore();
	}

	removeCompleted() {
		this.tobuys = this.getWithCompleted(false);
		this.updateStore();
	}

	getRemaining() {
		return this.getWithCompleted(false);
	}

	getCompleted() {
		return this.getWithCompleted(true);
	}

	toggleCompletion(tobuy: Todo) {
		tobuy.completed = !tobuy.completed;
		this.updateStore();
	}

	remove(tobuy: Todo) {
		this.tobuys.splice(this.tobuys.indexOf(tobuy), 1);
		this.updateStore();
	}

	add(title: String) {
		this.tobuys.push(new Todo(title));
		this.updateStore();
	}
}
