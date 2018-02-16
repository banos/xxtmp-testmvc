/* ---------------------------------------------------------------------------------------
Tobuys.ts
Microsoft grants you the right to use these script files under the Apache 2.0 license.
Microsoft reserves all other rights to the files not expressly granted by Microsoft,
whether by implication, estoppel or otherwise. The copyright notices and MIT licenses
below are for informational purposes only.

Portions Copyright © Microsoft Corporation
Apache 2.0 License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License. You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
ANY KIND, either express or implied.

See the License for the specific language governing permissions and limitations
under the License.
------------------------------------------------------------------------------------------
Provided for Informational Purposes Only
MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
--------------------------------------------------------------------------------------- */
// Tobuys.js
// https://github.com/documentcloud/backbone/blob/master/examples/tobuys/tobuys.js

// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.js)
// to persist Backbone models within your browser.

declare var $: any;

// TOBUY: Use DefinitelyTyped rather than ad-hoc definition here
declare module Backbone {
	export class Model {
		constructor (attr? , opts? );
		get(name: string): any;
		set(name: string, val: any): void;
		set(obj: any): void;
		save(attr? , opts? ): void;
		destroy(): void;
		bind(ev: string, f: Function, ctx?: any): void;
		toJSON(): any;
		trigger(eventName: string, ...args: any[]): any;
	}
	export class Collection {
		constructor (models? , opts? );
		bind(ev: string, f: Function, ctx?: any): void;
		collection: Model;
		length: number;
		create(attrs, opts? ): Collection;
		each(f: (elem: any) => void ): void;
		fetch(opts?: any): void;
		last(): any;
		last(n: number): any[];
		filter(f: (elem: any) => any): Collection;
		without(...values: any[]): Collection;
		trigger(eventName: string, ...args: any[]): any;
	}
	export class View {
		constructor (options? );
		$(selector: string): any;
		el: HTMLElement;
		$el: any;
		model: Model;
		remove(): void;
		delegateEvents: any;
		make(tagName: string, attrs? , opts? ): View;
		setElement(element: HTMLElement, delegate?: boolean): void;
		tagName: string;
		events: any;

		static extend: any;
	}
	export class Router {
		constructor (routes?: any );
		routes: any;
	}
	export class History {
		start(options?: any);
		navigate(fragment: string, options: any);
		pushState();
	}
	export var history: History;
}
declare var _: any;
declare var Store: any;


// Tobuy Model
// ----------

// Our basic **Tobuy** model has `title`, `order`, and `completed` attributes.
class Tobuy extends Backbone.Model {

	// Default attributes for the tobuy.
	defaults() {
		return {
			title: '',
			completed: false
		}
	}

	// Ensure that each tobuy created has `title`.
	initialize() {
		if (!this.get('title')) {
			this.set({ 'title': this.defaults().title });
		}
	}

	// Toggle the `completed` state of this tobuy item.
	toggle() {
		this.save({ completed: !this.get('completed') });
	}

	// Remove this Tobuy from *localStorage* and delete its view.
	clear() {
		this.destroy();
	}

}

// Tobuy Collection
// ---------------

// The collection of tobuys is backed by *localStorage* instead of a remote
// server.
class TobuyList extends Backbone.Collection {

	// Reference to this collection's model.
	model = Tobuy;

	// Save all of the tobuy items under the `'tobuys'` namespace.
	localStorage = new Store('tobuys-typescript-backbone');

	// Filter down the list of all tobuy items that are completed.
	completed() {
		return this.filter((tobuy: Tobuy) => tobuy.get('completed'));
	}

	// Filter down the list to only tobuy items that are still not completed.
	remaining() {
		return this.without.apply(this, this.completed());
	}

	// We keep the Tobuys in sequential order, despite being saved by unordered
	// GUID in the database. This generates the next order number for new items.
	nextOrder() {
		if (!length) return 1;
		return this.last().get('order') + 1;
	}

	// Tobuys are sorted by their original insertion order.
	comparator(tobuy: Tobuy) {
		return tobuy.get('order');
	}

}

// Create our global collection of **Tobuys**.
const Tobuys = new TobuyList();
var taskFilter;

// Tobuy Item View
// --------------

// The DOM element for a tobuy item...
class TobuyView extends Backbone.View {

	// The TobuyView listens for changes to its model, re-rendering. Since there's
	// a one-to-one correspondence between a **Tobuy** and a **TobuyView** in this
	// app, we set a direct reference on the model for convenience.
	template: (data: any) => string;

	// A TobuyView model must be a Tobuy, redeclare with specific type
	model: Tobuy;
	input: any;

	static ENTER_KEY:number = 13;
	static ESC_KEY:number = 27;

	constructor(options? ) {
		//... is a list tag.
		this.tagName = 'li';

		// The DOM events specific to an item.
		this.events = {
			'click .check': 'toggleDone',
			'dblclick label.tobuy-content': 'edit',
			'click button.destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close'
		};

		super(options);

		// Cache the template function for a single item.
		this.template = _.template($('#item-template').html());

		_.bindAll(this, 'render', 'close', 'remove', 'toggleVisible');
		this.model.bind('change', this.render);
		this.model.bind('destroy', this.remove);
		this.model.bind('visible', this.toggleVisible);
	}

	// Re-render the contents of the tobuy item.
	render() {
		this.$el
			.html(this.template(this.model.toJSON()))
			.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();
		this.input = this.$('.tobuy-input');
		return this;
	}

	// Toggle the `completed` state of the model.
	toggleDone() {
		this.model.toggle();
	}

	toggleVisible() {
		var completed =  this.model.get('completed');
		var hidden =
			(taskFilter === 'completed' && !completed) ||
			(taskFilter === 'active' && completed);
		this.$el.toggleClass('hidden', hidden);
	}

	// Switch this view into `'editing'` mode, displaying the input field.
	edit() {
		this.$el.addClass('editing');
		this.input.focus();
	}

	// Close the `'editing'` mode, saving changes to the tobuy.
	close() {
		var trimmedValue = this.input.val().trim();

		if (trimmedValue) {
			this.model.save({ title: trimmedValue });
		} else {
			this.clear();
		}

		this.$el.removeClass('editing');
	}

	// If you hit `enter`, we're through editing the item.
	updateOnEnter(e) {
		if (e.which === TobuyView.ENTER_KEY) this.close();
	}

	// If you're pressing `escape` we revert your change by simply leaving
	// the `editing` state.
	revertOnEscape(e) {
		if (e.which === TobuyView.ESC_KEY) {
			this.$el.removeClass('editing');
			// Also reset the hidden input back to the original value.
			this.input.val(this.model.get('title'));
		}
	}

	// Remove the item, destroy the model.
	clear() {
		this.model.clear();
	}

}

// Tobuy Router
// -----------

class TobuyRouter extends Backbone.Router {

	routes = {
		'*filter': 'setFilter'
	};

	constructor() {
		super();
		(<any>this)._bindRoutes();
	}

	setFilter(param: string = '') {
		// Trigger a collection filter event, causing hiding/unhiding
		// of Tobuy view items
		Tobuys.trigger('filter', param);
	}
}


// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
class AppView extends Backbone.View {

	// Delegated events for creating new items, and clearing completed ones.
	events = {
		'keypress .new-tobuy': 'createOnEnter',
		'click .tobuy-clear button': 'clearCompleted',
		'click .toggle-all': 'toggleAllComplete'
	};

	input: any;
	allCheckbox: HTMLInputElement;
	mainElement: HTMLElement;
	footerElement: HTMLElement;
	statsTemplate: (params: any) => string;

	constructor() {
		super();
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		this.setElement($('.tobuyapp'), true);

		// At initialization we bind to the relevant events on the `Tobuys`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting tobuys that might be saved in *localStorage*.
		_.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete', 'filter');

		this.input = this.$('.new-tobuy');
		this.allCheckbox = this.$('.toggle-all')[0];
		this.mainElement = this.$('.main')[0];
		this.footerElement = this.$('.footer')[0];
		this.statsTemplate = _.template($('#stats-template').html());

		Tobuys.bind('add', this.addOne);
		Tobuys.bind('reset', this.addAll);
		Tobuys.bind('all', this.render);
		Tobuys.bind('change:completed', this.filterOne);
		Tobuys.bind('filter', this.filter);
		Tobuys.fetch();

		// Initialize the router, showing the selected view
		const tobuyRouter = new TobuyRouter();
		Backbone.history.start();
	}

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render() {
		var completed = Tobuys.completed().length;
		var remaining = Tobuys.remaining().length;

		if (Tobuys.length) {
			this.mainElement.style.display = 'block';
			this.footerElement.style.display = 'block';

			this.$('.tobuy-stats').html(this.statsTemplate({
				total: Tobuys.length,
				completed: completed,
				remaining: remaining
			}));

			this.$('.filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (taskFilter || '') + '"]')
				.addClass('selected');

		} else {
			this.mainElement.style.display = 'none';
			this.footerElement.style.display = 'none';
		}

		this.allCheckbox.checked = !remaining;
	}

	// Add a single tobuy item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne(tobuy: Tobuy) {
		var view = new TobuyView({ model: tobuy });
		this.$('.tobuy-list').append(view.render().el);
	}

	// Add all items in the **Tobuys** collection at once.
	addAll() {
		Tobuys.each(this.addOne);
	}

	// Filter out completed/remaining tasks
	filter(criteria: string) {
		taskFilter = criteria;
		this.filterAll();
	}

	filterOne(tobuy: Tobuy) {
		tobuy.trigger('visible');
	}

	filterAll() {
		Tobuys.each(this.filterOne);
	}

	// Generate the attributes for a new Tobuy item.
	newAttributes() {
		return {
			title: this.input.val().trim(),
			order: Tobuys.nextOrder(),
			completed: false
		};
	}

	// If you hit return in the main input field, create new **Tobuy** model,
	// persisting it to *localStorage*.
	createOnEnter(e) {
		if (e.which === TobuyView.ENTER_KEY && this.input.val().trim()) {
			Tobuys.create(this.newAttributes());
			this.input.val('');
		}
	}

	// Clear all completed tobuy items, destroying their models.
	clearCompleted() {
		_.each(Tobuys.completed(), (tobuy: Tobuy) => tobuy.clear());
		return false;
	}

	toggleAllComplete() {
		var completed = this.allCheckbox.checked;
		Tobuys.each((tobuy: Tobuy) => tobuy.save({ 'completed': completed }));
	}

}

// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
	// Finally, we kick things off by creating the **App**.
	new AppView();
});
