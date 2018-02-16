goog.provide('tobuymvc.model.ToDoItemStore');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('tobuymvc.model.ToDoItem');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
tobuymvc.model.ToDoItemStore = function() {
    goog.events.EventTarget.call(this);

    var mechanism = goog.storage.mechanism.mechanismfactory
            .createHTML5LocalStorage();
    /**
     * @type {goog.storage.Storage}
     * @private
     */
    this.storage_ = mechanism ? new goog.storage.Storage(mechanism) : null;

    /**
     * @type {!Array.<tobuymvc.model.ToDoItem>}
     * @private
     */
    this.items_ = [];

    /**
     * Fundamentally flawed approach to ID-ing but fine for demo
     * @type {!number}
     * @private
     */
    this.maxId_ = 0;
};
goog.inherits(tobuymvc.model.ToDoItemStore, goog.events.EventTarget);

/**
 * Load item list from storage
 */
tobuymvc.model.ToDoItemStore.prototype.load = function() {
    if (!this.storage_) {
        this.notify_(false);
        return; // no storage = no loading!
    }
    goog.array.clear(this.items_);
    /**
     * @type {Array.<*>}
     */
    var serializedItems = /** @type {Array.<*>} */
        (this.storage_.get('tobuys-closure'));
    if (!serializedItems) {
        this.notify_(false);
        return; // nothing in storage
    }
    goog.array.forEach(serializedItems, function(serializedItem) {
        var item = new tobuymvc.model.ToDoItem(serializedItem['title'],
                serializedItem['completed'], serializedItem['id']);
        if (item.getId() > this.maxId_) {
            this.maxId_ = item.getId();
        }
        this.items_.push(item);
    }, this);
    this.notify_(false);
};

/**
 * @param {!tobuymvc.model.ToDoItem} updatedItem A prototype model to update.
 */
tobuymvc.model.ToDoItemStore.prototype.addOrUpdate = function(updatedItem) {
    var idx = goog.array.findIndex(this.items_, function(item) {
        return updatedItem.getId() === item.getId();
    });
    if (idx === -1) {
        if (updatedItem.getId() === 0) {
            updatedItem.setId(++this.maxId_);
        }
        this.items_.push(updatedItem);
    } else {
        this.items_[idx] = updatedItem;
    }
    this.notify_();
};

/**
 * @param {!tobuymvc.model.ToDoItem} itemToRemove A prototype model to remove.
 */
tobuymvc.model.ToDoItemStore.prototype.remove = function(itemToRemove) {
    goog.array.removeIf(this.items_, function(item) {
        return itemToRemove.getId() === item.getId();
    });
    this.notify_();
};

/**
 * @param {boolean=} opt_save whether to save to storage, defaults to true.
 * @private
 */
tobuymvc.model.ToDoItemStore.prototype.notify_ = function(opt_save) {
    // TODO delay until all changes have been made
    if (!goog.isDef(opt_save) || opt_save) {
        this.save_();
    }
    this.dispatchEvent(new tobuymvc.model.ToDoItemStore.ChangeEvent(this));
};

/**
 * @return {Array.<tobuymvc.model.ToDoItem>} All of the stored items.
 */
tobuymvc.model.ToDoItemStore.prototype.getAll = function() {
    return this.items_;
};

/**
 * @private
 */
tobuymvc.model.ToDoItemStore.prototype.save_ = function() {
    if (!this.storage_) {
        return; // no storage = no saving!
    }
    /**
     * @type {Array.<*>}
     */
    var serializedItems = [];
    goog.array.forEach(this.items_, function(item) {
        serializedItems.push({
            'completed' : item.isDone(),
            'title': item.getNote(),
            'id' : item.getId()
        });
    });
    this.storage_.set('tobuys-closure', serializedItems);
};

/**
 * @const
 */
tobuymvc.model.ToDoItemStore.ChangeEventType = 'change';

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {tobuymvc.model.ToDoItemStore} target The item store.
 */
tobuymvc.model.ToDoItemStore.ChangeEvent = function(target) {
    goog.events.Event.call(this,
        tobuymvc.model.ToDoItemStore.ChangeEventType, target);
};
goog.inherits(tobuymvc.model.ToDoItemStore.ChangeEvent, goog.events.Event);
