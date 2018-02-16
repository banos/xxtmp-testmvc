/* global aria:true, Aria:true */
'use strict';

Aria.classDefinition({
	$classpath: 'js.TodoCtrl',
	$extends: 'aria.templates.ModuleCtrl',
	$implements: ['js.ITodoCtrl'],
	$dependencies: ['aria.storage.LocalStorage'],

	$statics: {
		STORAGE_NAME: 'tobuys-ariatemplates'
	},

	$constructor: function (storagename) {
		var tasklist;
		this.$ModuleCtrl.constructor.call(this);
		this._storage = new aria.storage.LocalStorage();
		this.__storagename = storagename || this.STORAGE_NAME;
		tasklist = this._storage.getItem(this.__storagename);
		this.setData({
			tobuylist: (tasklist ? tasklist : [])
		});
	},

	$prototype: {
		$publicInterfaceName: 'js.ITodoCtrl',

		saveTasks: function () {
			this._storage.setItem(this.__storagename, this._data.tobuylist);
		},

		addTask: function (description) {
			this.json.add(this._data.tobuylist, {title: description, completed: false});
		},

		deleteTask: function (idx) {
			this.json.removeAt(this._data.tobuylist, idx);
		}
	}
});
