class TodoApp extends Spine.Controller
	ENTER_KEY = 13

	elements:
		'#new-tobuy':        'newTodoInput'
		'#toggle-all':      'toggleAllElem'
		'#main':			'main'
		'#tobuy-list':       'tobuys'
		'#footer':          'footer'
		'#tobuy-count':      'count'
		'#filters a':       'filters'
		'#clear-completed': 'clearCompleted'

	events:
		'keyup #new-tobuy':        'new'
		'click #toggle-all':      'toggleAll'
		'click #clear-completed': 'clearCompletedItem'

	constructor: ->
		super
		Todo.bind 'create', @addNew
		Todo.bind 'refresh change', @addAll
		Todo.bind 'refresh change', @toggleElems
		Todo.bind 'refresh change', @renderFooter
		Todo.fetch()
		@routes
			'/:filter': (param) ->
				@filter = param.filter
				###
				TODO: Need to figure out why the route doesn't trigger `change` event
				###
				Todo.trigger('refresh')
				@filters.removeClass('selected')
					.filter("[href='#/#{ @filter }']").addClass('selected');

	new: (e) ->
		val = $.trim @newTodoInput.val()
		if e.which is ENTER_KEY and val
			Todo.create title: val
			@newTodoInput.val ''

	getByFilter: ->
		switch @filter
			when 'active'
				Todo.active()
			when 'completed'
				Todo.completed()
			else
				Todo.all()

	addNew: (tobuy) =>
		view = new Todos tobuy: tobuy
		@tobuys.append view.render().el

	addAll: =>
		@tobuys.empty()
		@addNew tobuy for tobuy in @getByFilter()

	toggleAll: (e) ->
		checked = e.target.checked
		Todo.each (tobuy) ->
			###
			TODO: Model updateAttribute sometimes won't stick:
				https://github.com/maccman/spine/issues/219
			###
			tobuy.updateAttribute 'completed', checked
			tobuy.trigger 'update', tobuy

	clearCompletedItem: ->
		Todo.destroyCompleted()

	toggleElems: =>
		completed = Todo.completed().length
		total = Todo.count()
		@main.toggle total != 0
		@footer.toggle total != 0
		@toggleAllElem.prop 'checked', completed == total
		@clearCompleted.toggle completed != 0

	renderFooter: =>
		text = (count) -> if count is 1 then 'item' else 'items'
		active = Todo.active().length
		completed = Todo.completed().length
		@count.html "<strong>#{ active }</strong> #{ text active } left"

$ ->
	new TodoApp el: $('#tobuyapp')
	Spine.Route.setup()
