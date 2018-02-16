(ns tobuymvc.components.tobuys-clear
  (:require [tobuymvc.session :as session]
            [tobuymvc.actions :as actions]
            [tobuymvc.helpers :as helpers]))

(defn component []
  [:button#clear-completed {:on-click #(actions/clear-completed-tobuys @session/tobuys)
                            :style {:display (helpers/display-elem (helpers/tobuys-any-completed? 
                                                                    @session/tobuys))}}
   "Clear completed"])
