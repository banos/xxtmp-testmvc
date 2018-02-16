import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/tobuy-store.service';
import template from './tobuy-footer.template.html';

@Component({
	selector: 'tobuy-footer',
	template: template
})
export class TodoFooterComponent {
	constructor(tobuyStore:TodoStoreService, route:ActivatedRoute) {
		this._tobuyStore = tobuyStore;
		this._route = route;
		this.currentStatus = '';
	}

	ngOnInit() {
		this._route.params
			.map(params => params.status)
			.subscribe((status) => {
				this.currentStatus = status || '';
			});
	}

	removeCompleted() {
		this._tobuyStore.removeCompleted();
	}

	getCount() {
		return this._tobuyStore.tobuys.length;
	}

	getRemainingCount() {
		return this._tobuyStore.getRemaining().length;
	}

	hasCompleted() {
		return this._tobuyStore.getCompleted().length > 0;
	}
}
