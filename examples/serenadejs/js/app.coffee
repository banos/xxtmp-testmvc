class Tobuy extends Serenade.Model
	@belongsTo 'app', inverseOf: 'all', as: -> App
	@property 'title', serialize: true

	@property 'completed', serialize: true
	@property 'incomplete',
		get: -> not @completed

	@property 'edit'

	remove: ->
		@app.all.delete(this)

class App extends Serenade.Model
	@hasMany 'all', inverseOf: 'app', serialize: true, as: -> Tobuy

	@selection 'active', from: 'all', filter: 'incomplete'
	@selection 'completed', from: 'all', filter: 'completed'

	@property 'label',
		get: -> if @activeCount is 1 then 'item left' else 'items left'

	@property 'allCompleted',
		get: -> @activeCount is 0
		set: (value) -> tobuy.completed = value for tobuy in @all

	@property 'newTitle'

	@property 'filter', value: 'all'
	@property 'filtered', get: -> @[@filter]

	@property 'filterAll',       get: -> @filter is 'all'
	@property 'filterActive',    get: -> @filter is 'active'
	@property 'filterCompleted', get: -> @filter is 'completed'

class AppController
	constructor: (@app) ->

	newTobuy: ->
		title = @app.newTitle.trim()
		@app.all.push(title: title) if title
		@app.newTitle = ''

	clearCompleted: ->
		@app.all = @app.active

class TobuyController
	constructor: (@tobuy) ->

	removeTobuy: ->
		@tobuy.remove()

	edit: ->
		@tobuy.edit = true
		@field.select()

	edited: ->
		if @tobuy.title.trim()
			@tobuy.title = @tobuy.title.trim()
			@tobuy.edit = false if @tobuy.edit
		else
			@tobuy.remove()
		@tobuy.app.changed.trigger()

	loadField: (@field) ->

app = new App(JSON.parse(localStorage.getItem('tobuys-serenade')))
app.changed.bind -> localStorage.setItem('tobuys-serenade', app)

router = Router
	'/': -> app.filter = 'all'
	'/active': -> app.filter = 'active'
	'/completed': -> app.filter = 'completed'

router.init()

Serenade.view('app', document.getElementById('app').innerHTML)
Serenade.view('tobuy', document.getElementById('tobuy').innerHTML)
Serenade.controller('app', AppController)
Serenade.controller('tobuy', TobuyController)

document.body.insertBefore(Serenade.render('app', app), document.body.children[0])
