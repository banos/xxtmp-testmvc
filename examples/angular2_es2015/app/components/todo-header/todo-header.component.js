import { Component } from '@angular/core';

import { TodoStoreService } from '../../services/tobuy-store.service';
import template from './tobuy-header.template.html';

@Component({
	selector: 'tobuy-header',
	template: template
})
export class TodoHeaderComponent {
	newTodo = '';

	constructor(tobuyStore:TodoStoreService) {
		this._tobuyStore = tobuyStore;
	}

	addTodo() {
		if (this.newTodo.trim().length) {
			this._tobuyStore.add(this.newTodo);
			this.newTodo = '';
		}
	}
}
