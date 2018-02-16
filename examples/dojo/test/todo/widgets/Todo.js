define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/_base/lang',
	'dojo/when',
	'dojo/Deferred',
	'dojo/Stateful',
	'tobuy/widgets/Todo',
	'../../handleCleaner'
], function (bdd, expect, lang, when, Deferred, Stateful, Todo, handleCleaner) {
	'use strict';

	// For supporting Intern's true/false check
	/*jshint -W030*/
	bdd.describe('Test tobuy/widgets/Todo', function () {
		var w;
		var handles = [];
		var emptyTemplateString = '<div><\/div>';

		bdd.beforeEach(function () {
			// Create fresh Todo instance for each test case
			handles.push(w = new Todo({
				templateString: emptyTemplateString,
				target: new Stateful({
					id: 1,
					title: 'Foo',
					completed: false
				}),
				tobuysWidget: new Stateful({
					saveTodo: function (tobuy, originalTitle, originalCompleted) {
						w.saveTodoArgs = {
							tobuy: tobuy,
							originalTitle: originalTitle,
							originalCompleted: originalCompleted
						};
					},
					replaceTodo: function (oldTodo, newTodo) {
						w.replaceTodoArgs = {
							oldTodo: oldTodo,
							newTodo: newTodo
						};
					},
					removeTodo: function (tobuy) {
						w.removeTodoArgs = {tobuy: tobuy};
					}
				})
			}));
			w.startup();
		});

		bdd.afterEach(handleCleaner(handles));

		bdd.it('Missing tobuysWidget reference', function () {
			var caught;
			var w = new Todo({
				templateString: emptyTemplateString
			});
			handles.push(w);
			try {
				w.startup();
			} catch (e) {
				caught = true;
			}
			expect(caught).to.be.true;
		});

		bdd.it('Start editing title', function () {
			expect(w.get('isEditing')).not.to.be.true;
			w.editTodo();
			expect(w.get('isEditing')).to.be.true;
			w.target.set('title', 'Bar');
			expect(w.get('originalTitle')).to.equal('Foo');
		});

		bdd.it('Save editing title', function () {
			w.saveEdits();
			expect(w.saveTodoArgs).not.to.exist;

			var preventedDefault;
			var fakeSubmitEvent = {
				type: 'submit',
				preventDefault: function () {
					preventedDefault = true;
				}
			};

			w.editTodo();
			w.target.set('title', 'Bar');
			w.saveEdits(fakeSubmitEvent);
			expect(preventedDefault).to.be.true;
			expect(w.saveTodoArgs.tobuy.get('title')).to.equal('Bar');
			expect(w.saveTodoArgs.originalTitle).to.equal('Foo');
			expect(w.get('isEditing')).not.to.be.true;

			preventedDefault = false;
			w.saveTodoArgs = null;
			w.editTodo();
			w.target.set('title', ' Bar ');
			w.saveEdits(fakeSubmitEvent);
			expect(w.saveTodoArgs).not.to.be.ok;
			expect(w.target.get('title')).to.equal(' Bar ');
			expect(w.get('isEditing')).to.be.true;
			expect(preventedDefault).to.be.true;

			w.editTodo();
			w.target.set('title', 'Bar0');
			return w.invokeSaveEdits().then(function () {
				expect(w.target.get('title')).to.equal('Bar0');
				expect(w.get('isEditing')).not.to.be.true;
			}).then(function () {
				w.tobuysWidget.saveTodo = function (tobuy, originalTitle, originalCompleted) {
					tobuy.set('title', originalTitle);
					tobuy.set('completed', originalCompleted);
					var dfd = new Deferred();
					dfd.reject(new Error());
					return dfd.promise;
				};
				w.editTodo();
				w.target.set('title', 'Bar1');
				return w.invokeSaveEdits().then(function () {
					throw new Error('invokeSaveEdits() shouldn\'t succeed if saveTodo() doesn\'t.');
				}, function () {
					expect(w.target.get('title')).to.equal('Bar0');
					expect(w.get('isEditing')).not.to.be.true;
				});
			});
		});

		bdd.it('Cancel editing title', function () {
			w.revertEdits();
			expect(w.replaceTodoArgs).not.to.exist;
			w.editTodo();
			w.target.set('title', 'Bar');
			w.revertEdits();
			expect(w.replaceTodoArgs.oldTodo.get('title')).to.equal('Bar');
			expect(w.replaceTodoArgs.newTodo.get('title')).to.equal('Foo');
		});

		bdd.it('Toggling completed state', function () {
			w.target.set('completed', true);
			w.toggleCompleted();
			expect(w.saveTodoArgs.tobuy.get('completed')).to.be.true;
			expect(w.saveTodoArgs.originalCompleted).not.to.be.true;
			w.target.set('completed', false);
			w.toggleCompleted();
			expect(w.saveTodoArgs.tobuy.get('completed')).not.to.be.true;
			expect(w.saveTodoArgs.originalCompleted).to.be.true;
		});

		bdd.it('Removing tobuy', function () {
			w.removeTodo();
			expect(w.removeTodoArgs.tobuy).to.deep.equal(w.target);
			expect(w._destroyed).to.be.true;
		});
	});
});
