/*global define */
define({
	// The root node where all the views will be inserted
	root: { $ref: 'dom!tobuyapp' },

	// Render and insert the create view
	createView: {
		render: {
			template: { module: 'text!app/create/template.html' },
			replace: { module: 'i18n!app/create/strings' }
		},
		insert: { first: 'root' }
	},

	// Hook up the form to auto-reset whenever a new tobuy is added
	createForm: {
		element: { $ref: 'dom.first!form', at: 'createView' },
		connect: { 'tobuys.onAdd': 'reset' }
	},

	// Render and insert the list of tobuys, linking it to the
	// data and mapping data fields to the DOM
	listView: {
		render: {
			template: { module: 'text!app/list/template.html' },
			replace: { module: 'i18n!app/list/strings' },
			css: { module: 'css!app/list/structure.css' }
		},
		insert: { after: 'createView' },
		bind: {
			to: { $ref: 'tobuys' },
			comparator: 'dateCreated',
			bindings: {
				text: 'label, .edit',
				complete: [
					'.toggle',
					{ attr: 'classList', handler: { module: 'app/list/setCompletedClass' } }
				]
			}
		}
	},

	// Render and insert the "controls" view--this has the tobuy count,
	// filters, and clear completed button.
	controlsView: {
		render: {
			template: { module: 'text!app/controls/template.html' },
			replace: { module: 'i18n!app/controls/strings' },
			css: { module: 'css!app/controls/structure.css' }
		},
		insert: { after: 'listView' }
	},

	// Render and insert the footer.  This is mainly static text, but
	// is still fully internationalized.
	footerView: {
		render: {
			template: { module: 'text!app/footer/template.html' },
			replace: { module: 'i18n!app/footer/strings' }
		},
		insert: { after: 'root' }
	},

	// Create a localStorage adapter that will use the storage
	// key 'tobuys-cujo' for storing tobuys.  This is also linked,
	// creating a two-way linkage between the listView and the
	// data storage.
	tobuyStore: {
		create: {
			module: 'cola/adapter/LocalStorage',
			args: 'tobuys-cujo'
		},
		bind: {
			to: { $ref: 'tobuys' }
		}
	},

	tobuys: {
		create: {
			module: 'cola/Collection',
			args: {
				strategyOptions: {
					validator: { module: 'app/create/validateTobuy' }
				}
			}
		},
		before: {
			add: 'cleanTobuy | generateMetadata',
			update: 'cleanTobuy'
		}
	},

	// The main controller, which is acting more like a mediator in this
	// application by reacting to events in multiple views.
	// Typically, cujo-based apps will have several (or many) smaller
	// view controllers. Since this is a relatively simple application,
	// a single controller fits well.
	tobuyController: {
		create: 'app/controller',
		properties: {
			tobuys: { $ref: 'tobuys' },

			createTobuy: { compose: 'form.getValues | tobuys.add' },
			removeTobuy: { compose: 'tobuys.remove' },
			updateTobuy: { compose: 'tobuys.update' },

			querySelector: { $ref: 'dom.first!' },

			masterCheckbox: { $ref: 'dom.first!#toggle-all', at: 'listView' },
			countNode: { $ref: 'dom.first!.count', at: 'controlsView' },
			remainingNodes: { $ref: 'dom.all!#tobuy-count strong', at: 'controlsView' }
		},
		on: {
			createView: {
				'submit:form': 'createTobuy'
			},
			listView: {
				'click:.destroy': 'removeTobuy',
				'change:.toggle': 'updateTobuy',
				'click:#toggle-all': 'toggleAll',
				'dblclick:label': 'tobuys.edit',
				'change,focusout:.edit': 'tobuys.submit',
				'submit:form': 'tobuys.submit'
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		connect: {
			updateTotalCount: 'setTobuysTotalState',
			updateRemainingCount: 'setTobuysRemainingState',
			updateCompletedCount: 'setTobuysCompletedState',
			'tobuys.onChange': 'updateCount',
			'tobuys.onEdit': 'tobuys.findNode | toggleEditingState.add | beginEditTobuy',
			'tobuys.onSubmit': 'tobuys.findNode | toggleEditingState.remove | tobuys.findItem | endEditTobuy'
		}
	},

	form: { module: 'cola/dom/form' },
	cleanTobuy: { module: 'app/create/cleanTobuy' },
	generateMetadata: { module: 'app/create/generateMetadata' },

	toggleEditingState: {
		create: {
			module: 'wire/dom/transform/toggleClasses',
			args: {
				classes: 'editing'
			}
		}
	},

	setTobuysTotalState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'tobuys' }
		}
	},

	setTobuysRemainingState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'remaining' }
		}
	},

	setTobuysCompletedState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'completed' }
		}
	},

	plugins: [
		// 'wire/debug',
		'wire/dom', 'wire/dom/render', 'wire/on',
		'wire/aop', 'wire/connect', 'cola'
	]
});
