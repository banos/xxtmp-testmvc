package main

import (
	"log"

	"github.com/go-humble/router"

	"github.com/go-humble/examples/tobuymvc/go/models"
	"github.com/go-humble/examples/tobuymvc/go/views"
)

//go:generate temple build templates/templates templates/templates.go --partials templates/partials
//go:generate gopherjs build main.go -o ../js/app.js -m

func main() {
	// This is helps development by letting us know the app is actually running
	// and telling us the time that the app was most recently started.
	log.Println("Starting")

	// Create a new tobuy list.
	tobuys := &models.TobuyList{}
	if err := tobuys.Load(); err != nil {
		panic(err)
	}
	// Create an app view with our tobuy list.
	appView := views.NewApp(tobuys)

	// Register a change listener which will be triggered whenever the tobuy list
	// is changed.
	tobuys.OnChange(func() {
		// Asynchronously save the tobuys to localStorage.
		go func() {
			if err := tobuys.Save(); err != nil {
				panic(err)
			}
		}()
		// Then re-render the entire view.
		if err := appView.Render(); err != nil {
			panic(err)
		}
	})

	// Create and start a new router to handle the different routes. On each
	// route, we are simply going to use a filter to change which tobuys are
	// rendered, then re-render the entire view with the filter applied.
	r := router.New()
	r.ForceHashURL = true
	r.HandleFunc("/", func(_ *router.Context) {
		appView.UseFilter(models.Predicates.All)
		if err := appView.Render(); err != nil {
			panic(err)
		}
	})
	r.HandleFunc("/active", func(_ *router.Context) {
		appView.UseFilter(models.Predicates.Remaining)
		if err := appView.Render(); err != nil {
			panic(err)
		}
	})
	r.HandleFunc("/completed", func(_ *router.Context) {
		appView.UseFilter(models.Predicates.Completed)
		if err := appView.Render(); err != nil {
			panic(err)
		}
	})
	r.Start()
}
