(ns tobuymvc.components.tobuys-toggle
  (:require [tobuymvc.session :as session]
            [tobuymvc.actions :as actions]
            [tobuymvc.helpers :as helpers]))

(defn component []
  [:span
   [:input#toggle-all {:type "checkbox"
                       :checked (helpers/tobuys-all-completed? @session/tobuys)
                       :on-change #(actions/toggle-all-tobuys 
                                    (helpers/tobuys-all-completed? @session/tobuys))}]
   [:label {:for "toggle-all"} "Mark all as complete"]])
