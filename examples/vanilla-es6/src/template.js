import {ItemList} from './item';

import {escapeForHTML} from './helpers';

export default class Template {
	/**
	 * Format the contents of a tobuy list.
	 *
	 * @param {ItemList} items Object containing keys you want to find in the template to replace.
	 * @returns {!string} Contents for a tobuy list
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: false,
	 * })
	 */
	itemList(items) {
		return items.reduce((a, item) => a + `
<li data-id="${item.id}"${item.completed ? ' class="completed"' : ''}>
	<input class="toggle" type="checkbox" ${item.completed ? 'checked' : ''}>
	<label>${escapeForHTML(item.title)}</label>
	<button class="destroy"></button>
</li>`, '');
	}

	/**
	 * Format the contents of an "items left" indicator.
	 *
	 * @param {number} activeTobuys Number of active tobuys
	 *
	 * @returns {!string} Contents for an "items left" indicator
	 */
	itemCounter(activeTobuys) {
		return `${activeTobuys} item${activeTobuys !== 1 ? 's' : ''} left`;
	}
}
