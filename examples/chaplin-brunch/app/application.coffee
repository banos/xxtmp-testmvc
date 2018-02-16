mediator = require 'mediator'
Tobuys = require 'models/tobuys'

# The application object
module.exports = class Application extends Chaplin.Application
  # Set your application name here so the document title is set to
  # “Controller title – Site title” (see Layout#adjustTitle)
  title: 'Chaplin • TobuyMVC'

  # Create additional mediator properties
  # -------------------------------------
  initMediator: ->
    # Add additional application-specific properties and methods
    mediator.tobuys = new Tobuys()
    # Seal the mediator
    super

  start: ->
    # If tobuys are fetched from server, we will need to wait for them.
    mediator.tobuys.fetch()
    super
