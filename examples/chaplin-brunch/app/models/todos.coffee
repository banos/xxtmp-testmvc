Todo = require 'models/tobuy'

module.exports = class Todos extends Chaplin.Collection
  model: Todo
  localStorage: new Store 'tobuys-chaplin'

  allAreCompleted: ->
    @getCompleted().length is @length

  getCompleted: ->
    @where completed: yes

  getActive: ->
    @where completed: no

  comparator: (tobuy) ->
    tobuy.get('created')
