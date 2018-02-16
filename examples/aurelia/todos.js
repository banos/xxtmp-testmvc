import {ObserverLocator} from 'aurelia-binding';
import {TodoItem} from './tobuy-item';
import _ from 'underscore';

const STORAGE_NAME = 'tobuymvc-aurelia';
const ENTER_KEY = 13;

export class Todos {
	static inject() { return [ObserverLocator]; }
	constructor(observerLocator, storage = null) {
		this.items = [];
		this.filteredItems = [];
		this.filter = '';
		this.newTodoTitle = null;
		this.areAllChecked = false;

		this.observerLocator = observerLocator;
		this.storage = storage || localStorage;
		this.load();
	}

	activate(params) {
		this.updateFilteredItems(params.filter);
	}

	onKeyUp(ev) {
		if (ev.keyCode === ENTER_KEY) {
			this.addNewTodo(this.newTodoTitle);
		}
	}

	addNewTodo(title = this.newTodoTitle) {
		if (title == undefined) { return; }

		title = title.trim();
		if (title.length === 0) { return; }

		const newTodoItem = new TodoItem(title);
		this.observeItem(newTodoItem);
		this.items.push(newTodoItem);
		this.newTodoTitle = null;
		this.updateAreAllCheckedState();
		this.updateFilteredItems(this.filter);
		this.save();
	}

	observeItem(tobuyItem) {
		this.observerLocator
			.getObserver(tobuyItem, 'title')
			.subscribe((o, n) => this.onTitleChanged(tobuyItem));

		this.observerLocator
			.getObserver(tobuyItem, 'isCompleted')
			.subscribe(() => this.onIsCompletedChanged());
	}

	onTitleChanged(tobuyItem) {
		if (tobuyItem.title === '') {
			this.deleteTodo(tobuyItem);
			this.updateAreAllCheckedState();
		}

		this.save();
	}

	onIsCompletedChanged() {
		this.updateAreAllCheckedState();
		this.updateFilteredItems(this.filter);

		this.save();
	}

	deleteTodo(tobuyItem) {
		this.items = _(this.items).without(tobuyItem);
		this.updateAreAllCheckedState();
		this.updateFilteredItems(this.filter);
		this.save();
	}

	onToggleAllChanged() {
		this.items = _.map(this.items, item => {
			item.isCompleted = this.areAllChecked;
			return item;
		});

		this.updateFilteredItems(this.filter);
	}

	clearCompletedTodos() {
		this.items = _(this.items).filter(i => !i.isCompleted);
		this.areAllChecked = false;
		this.updateFilteredItems(this.filter);
		this.save();
	}

	get countTodosLeft() {
		return _(this.items).filter(i => !i.isCompleted).length;
	}

	updateAreAllCheckedState() {
		this.areAllChecked = _(this.items).all(i => i.isCompleted);
	}

	updateFilteredItems(filter) {
		this.filter = filter || '!';

		switch (filter) {
			case 'active':
				this.filteredItems = _(this.items).filter(i => !i.isCompleted);
				break;
			case 'completed':
				this.filteredItems = _(this.items).filter(i =>	i.isCompleted);
				break;
			default:
				this.filteredItems = this.items;
				break;
		}
	}

	load() {
		const storageContent = this.storage.getItem(STORAGE_NAME);
		if (storageContent == undefined) { return; }

		const simpleItems = JSON.parse(storageContent);
		this.items = _.map(simpleItems, item => {
			const tobuyItem = new TodoItem(item.title);
			tobuyItem.isCompleted = item.completed;

			this.observeItem(tobuyItem);

			return tobuyItem;
		});
		this.updateAreAllCheckedState();
	}

	save() {
		const simpleItems = _.map(this.items, item => { return {
			title: item.title,
			completed: item.isCompleted
		}});

		this.storage.setItem(STORAGE_NAME, JSON.stringify(simpleItems));
	}
}
