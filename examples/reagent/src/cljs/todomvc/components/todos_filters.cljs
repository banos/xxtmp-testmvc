(ns tobuymvc.components.tobuys-filters
  (:require [tobuymvc.session :as session]))

(defn selected-class [display-type tobuys-display-type]
  (if (= display-type
         tobuys-display-type)
    "selected" ""))

(defn component []
  [:ul#filters
   [:li [:a {:class (selected-class :all @session/tobuys-display-type)  :href "#/"} "All"]]
   [:li [:a {:class (selected-class :active @session/tobuys-display-type) :href "#/active"} "Active"]]
   [:li [:a {:class (selected-class :completed @session/tobuys-display-type) :href "#/completed"} "Completed"]]])
