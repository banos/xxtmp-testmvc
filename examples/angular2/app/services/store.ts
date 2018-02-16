export class Tobuy {
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

export class TobuyStore {
	tobuys: Array<Tobuy>;

	constructor() {
		let persistedTobuys = JSON.parse(localStorage.getItem('angular2-tobuys') || '[]');
		// Normalize back into classes
		this.tobuys = persistedTobuys.map( (tobuy: {_title: String, completed: Boolean}) => {
			let ret = new Tobuy(tobuy._title);
			ret.completed = tobuy.completed;
			return ret;
		});
	}

	private updateStore() {
		localStorage.setItem('angular2-tobuys', JSON.stringify(this.tobuys));
	}

	private getWithCompleted(completed: Boolean) {
		return this.tobuys.filter((tobuy: Tobuy) => tobuy.completed === completed);
	}

	allCompleted() {
		return this.tobuys.length === this.getCompleted().length;
	}

	setAllTo(completed: Boolean) {
		this.tobuys.forEach((t: Tobuy) => t.completed = completed);
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

	toggleCompletion(tobuy: Tobuy) {
		tobuy.completed = !tobuy.completed;
		this.updateStore();
	}

	remove(tobuy: Tobuy) {
		this.tobuys.splice(this.tobuys.indexOf(tobuy), 1);
		this.updateStore();
	}

	add(title: String) {
		this.tobuys.push(new Tobuy(title));
		this.updateStore();
	}
}
