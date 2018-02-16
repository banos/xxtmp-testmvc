import { Injectable } from '@angular/core';

import { TodoModel } from '../models/tobuy.model';

@Injectable()
export class TodoStoreService {
	tobuys = [];

	constructor() {
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-tobuys')) || [];

		this.tobuys = persistedTodos.map((tobuy) => {
			let ret = new TodoModel(tobuy.title);
			ret.completed = tobuy.completed;
			ret.uid = tobuy.uid;
			return ret;
		});
	}

	get(state) {
		return this.tobuys.filter((tobuy) => tobuy.completed === state.completed);
	}

	allCompleted() {
		return this.tobuys.length === this.getCompleted().length;
	}

	setAllTo(completed) {
		this.tobuys.forEach((tobuy) => tobuy.completed = completed);
		this.persist();
	}

	removeCompleted() {
		this.tobuys = this.get({ completed: false });
		this.persist();
	}

	getRemaining() {
		if (!this.remainingTodos) {
			this.remainingTodos = this.get({ completed: false });
		}

		return this.remainingTodos;
	}

	getCompleted() {
		if (!this.completedTodos) {
			this.completedTodos = this.get({ completed: true });
		}

		return this.completedTodos;
	}

	toggleCompletion(uid) {
		let tobuy = this._findByUid(uid);

		if (tobuy) {
			tobuy.completed = !tobuy.completed;
			this.persist();
		}
	}

	remove(uid) {
		let tobuy = this._findByUid(uid);

		if (tobuy) {
			this.tobuys.splice(this.tobuys.indexOf(tobuy), 1);
			this.persist();
		}
	}

	add(title) {
		this.tobuys.push(new TodoModel(title));
		this.persist();
	}

	persist() {
		this._clearCache();
		localStorage.setItem('angular2-tobuys', JSON.stringify(this.tobuys));
	}

	_findByUid(uid) {
		return this.tobuys.find((tobuy) => tobuy.uid == uid);
	}

	_clearCache() {
		this.completedTodos = null;
		this.remainingTodos = null;
	}
}
