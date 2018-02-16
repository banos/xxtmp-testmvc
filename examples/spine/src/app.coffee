class TobuyApp extends Spine.Controller
	ENTER_KEY = 13

	elements:
		'#new-tobuy':        'newTobuyInput'
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
		Tobuy.bind 'create', @addNew
		Tobuy.bind 'refresh change', @addAll
		Tobuy.bind 'refresh change', @toggleElems
		Tobuy.bind 'refresh change', @renderFooter
		Tobuy.fetch()
		@routes
			'/:filter': (param) ->
				@filter = param.filter
				###
				TOBUY: Need to figure out why the route doesn't trigger `change` event
				###
				Tobuy.trigger('refresh')
				@filters.removeClass('selected')
					.filter("[href='#/#{ @filter }']").addClass('selected');

	new: (e) ->
		val = $.trim @newTobuyInput.val()
		if e.which is ENTER_KEY and val
			Tobuy.create title: val
			@newTobuyInput.val ''

	getByFilter: ->
		switch @filter
			when 'active'
				Tobuy.active()
			when 'completed'
				Tobuy.completed()
			else
				Tobuy.all()

	addNew: (tobuy) =>
		view = new Tobuys tobuy: tobuy
		@tobuys.append view.render().el

	addAll: =>
		@tobuys.empty()
		@addNew tobuy for tobuy in @getByFilter()

	toggleAll: (e) ->
		checked = e.target.checked
		Tobuy.each (tobuy) ->
			###
			TOBUY: Model updateAttribute sometimes won't stick:
				https://github.com/maccman/spine/issues/219
			###
			tobuy.updateAttribute 'completed', checked
			tobuy.trigger 'update', tobuy

	clearCompletedItem: ->
		Tobuy.destroyCompleted()

	toggleElems: =>
		completed = Tobuy.completed().length
		total = Tobuy.count()
		@main.toggle total != 0
		@footer.toggle total != 0
		@toggleAllElem.prop 'checked', completed == total
		@clearCompleted.toggle completed != 0

	renderFooter: =>
		text = (count) -> if count is 1 then 'item' else 'items'
		active = Tobuy.active().length
		completed = Tobuy.completed().length
		@count.html "<strong>#{ active }</strong> #{ text active } left"

$ ->
	new TobuyApp el: $('#tobuyapp')
	Spine.Route.setup()
