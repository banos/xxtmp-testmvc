import {Component} from 'angular2/core';
import {TobuyStore, Tobuy} from './services/store';

@Component({
	selector: 'tobuy-app',
	templateUrl: 'app/app.html'
})
export default class TobuyApp {
	tobuyStore: TobuyStore;
	newTobuyText = '';

	constructor(tobuyStore: TobuyStore) {
		this.tobuyStore = tobuyStore;
	}

	stopEditing(tobuy: Tobuy, editedTitle: string) {
		tobuy.title = editedTitle;
		tobuy.editing = false;
	}

	cancelEditingTobuy(tobuy: Tobuy) {
		tobuy.editing = false;
	}

	updateEditingTobuy(tobuy: Tobuy, editedTitle: string) {
		editedTitle = editedTitle.trim();
		tobuy.editing = false;

		if (editedTitle.length === 0) {
			return this.tobuyStore.remove(tobuy);
		}

		tobuy.title = editedTitle;
	}

	editTobuy(tobuy: Tobuy) {
		tobuy.editing = true;
	}

	removeCompleted() {
		this.tobuyStore.removeCompleted();
	}

	toggleCompletion(tobuy: Tobuy) {
		this.tobuyStore.toggleCompletion(tobuy);
	}

	remove(tobuy: Tobuy){
		this.tobuyStore.remove(tobuy);
	}

	addTobuy() {
		if (this.newTobuyText.trim().length) {
			this.tobuyStore.add(this.newTobuyText);
			this.newTobuyText = '';
		}
	}
}
