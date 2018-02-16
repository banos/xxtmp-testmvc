CollectionView = require './base/collection-view'
TodoView = require './tobuy-view'
utils = require 'lib/utils'

module.exports = class TodosView extends CollectionView
  container: '#main'
  events:
    'click #toggle-all': 'toggleCompleted'
  itemView: TodoView
  listSelector: '#tobuy-list'
  listen:
    'all collection': 'renderCheckbox'
    'tobuys:clear mediator': 'clear'
  template: require './templates/tobuys'

  render: ->
    super
    @renderCheckbox()

  renderCheckbox: ->
    @find('#toggle-all').checked = @collection.allAreCompleted()
    utils.toggle @el, @collection.length isnt 0

  toggleCompleted: (event) ->
    isChecked = event.delegateTarget.checked
    @collection.forEach (tobuy) -> tobuy.save completed: isChecked

  clear: ->
    @collection.getCompleted().forEach (model) ->
      model.destroy()
