(ns tobuymvc.routes
  (:require [tobuymvc.session :as session]
            [secretary.core :as secretary :include-macros true]
            [goog.events :as events]
            [goog.history.EventType :as EventType])
  (:import goog.History))

(secretary/set-config! :prefix "#")

(secretary/defroute "/" []
  (reset! session/tobuys-display-type :all))

(secretary/defroute "/active" []
  (reset! session/tobuys-display-type :active))

(secretary/defroute "/completed" []
  (reset! session/tobuys-display-type :completed))

(doto (History.)
  (events/listen
   EventType/NAVIGATE
   (fn [event]
     (secretary/dispatch! (.-token event))))
  (.setEnabled true))
