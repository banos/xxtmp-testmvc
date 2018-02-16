(ns tobuymvc.components.tobuy-item
  (:require [reagent.core :as reagent]
            [tobuymvc.session :as session]
            [tobuymvc.actions :as actions]
            [tobuymvc.helpers :as helpers]
            [tobuymvc.components.tobuy-edit :as tobuy-edit]))

(defn tobuy-item-class [completed editing]
  (str (when completed "completed ")
       (when @editing "editing")))

(defn tobuy-checkbox [id completed]
  [:input.toggle {:type "checkbox" 
                  :checked completed
                  :on-change #(actions/toggle-tobuy id)}])

(defn component [tobuy]
  (let [editing (reagent/atom false)]
    (fn [{:keys [id title completed] :as tobuy}]
      [:li {:class (tobuy-item-class completed editing)
            :style {:display (helpers/display-elem
                              (helpers/tobuy-display-filter completed @session/tobuys-display-type))}}
       [:div.view
        [tobuy-checkbox id completed]
        [:label {:on-double-click #(reset! editing true)} title]
        [:button.destroy {:on-click #(actions/delete-tobuy id)}]]
       [tobuy-edit/component tobuy editing]])))
