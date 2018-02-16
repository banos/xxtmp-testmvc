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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Tobuy Model
// ----------
// Our basic **Tobuy** model has `title`, `order`, and `completed` attributes.
var Tobuy = (function (_super) {
    __extends(Tobuy, _super);
    function Tobuy() {
        _super.apply(this, arguments);
    }
    // Default attributes for the tobuy.
    Tobuy.prototype.defaults = function () {
        return {
            title: '',
            completed: false
        };
    };
    // Ensure that each tobuy created has `title`.
    Tobuy.prototype.initialize = function () {
        if (!this.get('title')) {
            this.set({ 'title': this.defaults().title });
        }
    };
    // Toggle the `completed` state of this tobuy item.
    Tobuy.prototype.toggle = function () {
        this.save({ completed: !this.get('completed') });
    };
    // Remove this Tobuy from *localStorage* and delete its view.
    Tobuy.prototype.clear = function () {
        this.destroy();
    };
    return Tobuy;
})(Backbone.Model);
// Tobuy Collection
// ---------------
// The collection of tobuys is backed by *localStorage* instead of a remote
// server.
var TobuyList = (function (_super) {
    __extends(TobuyList, _super);
    function TobuyList() {
        _super.apply(this, arguments);
        // Reference to this collection's model.
        this.model = Tobuy;
        // Save all of the tobuy items under the `'tobuys'` namespace.
        this.localStorage = new Store('tobuys-typescript-backbone');
    }
    // Filter down the list of all tobuy items that are completed.
    TobuyList.prototype.completed = function () {
        return this.filter(function (tobuy) { return tobuy.get('completed'); });
    };
    // Filter down the list to only tobuy items that are still not completed.
    TobuyList.prototype.remaining = function () {
        return this.without.apply(this, this.completed());
    };
    // We keep the Tobuys in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    TobuyList.prototype.nextOrder = function () {
        if (!length)
            return 1;
        return this.last().get('order') + 1;
    };
    // Tobuys are sorted by their original insertion order.
    TobuyList.prototype.comparator = function (tobuy) {
        return tobuy.get('order');
    };
    return TobuyList;
})(Backbone.Collection);
// Create our global collection of **Tobuys**.
var Tobuys = new TobuyList();
var taskFilter;
// Tobuy Item View
// --------------
// The DOM element for a tobuy item...
var TobuyView = (function (_super) {
    __extends(TobuyView, _super);
    function TobuyView(options) {
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
        _super.call(this, options);
        // Cache the template function for a single item.
        this.template = _.template($('#item-template').html());
        _.bindAll(this, 'render', 'close', 'remove', 'toggleVisible');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
        this.model.bind('visible', this.toggleVisible);
    }
    // Re-render the contents of the tobuy item.
    TobuyView.prototype.render = function () {
        this.$el
            .html(this.template(this.model.toJSON()))
            .toggleClass('completed', this.model.get('completed'));
        this.toggleVisible();
        this.input = this.$('.tobuy-input');
        return this;
    };
    // Toggle the `completed` state of the model.
    TobuyView.prototype.toggleDone = function () {
        this.model.toggle();
    };
    TobuyView.prototype.toggleVisible = function () {
        var completed = this.model.get('completed');
        var hidden = (taskFilter === 'completed' && !completed) ||
            (taskFilter === 'active' && completed);
        this.$el.toggleClass('hidden', hidden);
    };
    // Switch this view into `'editing'` mode, displaying the input field.
    TobuyView.prototype.edit = function () {
        this.$el.addClass('editing');
        this.input.focus();
    };
    // Close the `'editing'` mode, saving changes to the tobuy.
    TobuyView.prototype.close = function () {
        var trimmedValue = this.input.val().trim();
        if (trimmedValue) {
            this.model.save({ title: trimmedValue });
        }
        else {
            this.clear();
        }
        this.$el.removeClass('editing');
    };
    // If you hit `enter`, we're through editing the item.
    TobuyView.prototype.updateOnEnter = function (e) {
        if (e.which === TobuyView.ENTER_KEY)
            this.close();
    };
    // If you're pressing `escape` we revert your change by simply leaving
    // the `editing` state.
    TobuyView.prototype.revertOnEscape = function (e) {
        if (e.which === TobuyView.ESC_KEY) {
            this.$el.removeClass('editing');
            // Also reset the hidden input back to the original value.
            this.input.val(this.model.get('title'));
        }
    };
    // Remove the item, destroy the model.
    TobuyView.prototype.clear = function () {
        this.model.clear();
    };
    TobuyView.ENTER_KEY = 13;
    TobuyView.ESC_KEY = 27;
    return TobuyView;
})(Backbone.View);
// Tobuy Router
// -----------
var TobuyRouter = (function (_super) {
    __extends(TobuyRouter, _super);
    function TobuyRouter() {
        _super.call(this);
        this.routes = {
            '*filter': 'setFilter'
        };
        this._bindRoutes();
    }
    TobuyRouter.prototype.setFilter = function (param) {
        if (param === void 0) { param = ''; }
        // Trigger a collection filter event, causing hiding/unhiding
        // of Tobuy view items
        Tobuys.trigger('filter', param);
    };
    return TobuyRouter;
})(Backbone.Router);
// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView() {
        _super.call(this);
        // Delegated events for creating new items, and clearing completed ones.
        this.events = {
            'keypress .new-tobuy': 'createOnEnter',
            'click .tobuy-clear button': 'clearCompleted',
            'click .toggle-all': 'toggleAllComplete'
        };
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
        var tobuyRouter = new TobuyRouter();
        Backbone.history.start();
    }
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    AppView.prototype.render = function () {
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
        }
        else {
            this.mainElement.style.display = 'none';
            this.footerElement.style.display = 'none';
        }
        this.allCheckbox.checked = !remaining;
    };
    // Add a single tobuy item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    AppView.prototype.addOne = function (tobuy) {
        var view = new TobuyView({ model: tobuy });
        this.$('.tobuy-list').append(view.render().el);
    };
    // Add all items in the **Tobuys** collection at once.
    AppView.prototype.addAll = function () {
        Tobuys.each(this.addOne);
    };
    // Filter out completed/remaining tasks
    AppView.prototype.filter = function (criteria) {
        taskFilter = criteria;
        this.filterAll();
    };
    AppView.prototype.filterOne = function (tobuy) {
        tobuy.trigger('visible');
    };
    AppView.prototype.filterAll = function () {
        Tobuys.each(this.filterOne);
    };
    // Generate the attributes for a new Tobuy item.
    AppView.prototype.newAttributes = function () {
        return {
            title: this.input.val().trim(),
            order: Tobuys.nextOrder(),
            completed: false
        };
    };
    // If you hit return in the main input field, create new **Tobuy** model,
    // persisting it to *localStorage*.
    AppView.prototype.createOnEnter = function (e) {
        if (e.which === TobuyView.ENTER_KEY && this.input.val().trim()) {
            Tobuys.create(this.newAttributes());
            this.input.val('');
        }
    };
    // Clear all completed tobuy items, destroying their models.
    AppView.prototype.clearCompleted = function () {
        _.each(Tobuys.completed(), function (tobuy) { return tobuy.clear(); });
        return false;
    };
    AppView.prototype.toggleAllComplete = function () {
        var completed = this.allCheckbox.checked;
        Tobuys.each(function (tobuy) { return tobuy.save({ 'completed': completed }); });
    };
    return AppView;
})(Backbone.View);
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    // Finally, we kick things off by creating the **App**.
    new AppView();
});
