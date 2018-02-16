import { Component, EventEmitter, Output, Input } from '@angular/core';

import template from './tobuy-item.template.html';

@Component({
	selector: 'tobuy-item',
	template: template
})
export class TodoItemComponent {
	@Input() tobuy;

	@Output() itemModified = new EventEmitter();

	@Output() itemRemoved = new EventEmitter();

	editing = false;

	cancelEditing() {
		this.editing = false;
	}

	stopEditing(editedTitle) {
		this.tobuy.setTitle(editedTitle.value);
		this.editing = false;

		if (this.tobuy.title.length === 0) {
			this.remove();
		} else {
			this.update();
		}
	}

	edit() {
		this.editing = true;
	}

	toggleCompletion() {
		this.tobuy.completed = !this.tobuy.completed;
		this.update();
	}

	remove() {
		this.itemRemoved.next(this.tobuy.uid);
	}

	update() {
		this.itemModified.next(this.tobuy.uid);
	}
}
