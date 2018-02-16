import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/tobuy-store.service';
import template from './tobuy-list.template.html';

@Component({
	selector: 'tobuy-list',
	template: template
})
export class TodoListComponent {
	constructor(tobuyStore: TodoStoreService, route: ActivatedRoute) {
		this._tobuyStore = tobuyStore;
		this._route = route;
		this._currentStatus = '';
	}

	ngOnInit() {
		this._route.params
			.map(params => params.status)
			.subscribe((status) => {
				this._currentStatus = status;
			});
	}

	remove(uid) {
		this._tobuyStore.remove(uid);
	}

	update() {
		this._tobuyStore.persist();
	}

	getTodos() {
		if (this._currentStatus == 'completed') {
			return this._tobuyStore.getCompleted();
		} else if (this._currentStatus == 'active') {
			return this._tobuyStore.getRemaining();
		} else {
			return this._tobuyStore.tobuys;
		}
	}

	allCompleted() {
		return this._tobuyStore.allCompleted();
	}

	setAllTo(toggleAll) {
		this._tobuyStore.setAllTo(toggleAll.checked);
	}
}
