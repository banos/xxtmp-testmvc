(ns tobuymvc.core
  (:require [reagent.core :as reagent]
            [tobuymvc.session :as session]
            [tobuymvc.actions :as actions]
            [tobuymvc.helpers :as helpers]
            [tobuymvc.components.title :as title]
            [tobuymvc.components.tobuy-input :as tobuy-input]
            [tobuymvc.components.footer :as footer]
            [tobuymvc.components.tobuys-toggle :as tobuys-toggle]
            [tobuymvc.components.tobuys-list :as tobuys-list]
            [tobuymvc.components.tobuys-count :as tobuys-count]
            [tobuymvc.components.tobuys-filters :as tobuys-filters]
            [tobuymvc.components.tobuys-clear :as tobuys-clear]))

(defn tobuy-app []
  [:div
   [:section#tobuyapp
    [:header#header
     [title/component]
     [tobuy-input/component]]
    [:div {:style 
           {:display (helpers/display-elem (helpers/tobuys-any?
                                            @session/tobuys))}}
     [:section#main
      [tobuys-toggle/component]
      [tobuys-list/component (helpers/tobuys-all @session/tobuys)]]
     [:footer#footer
      [tobuys-count/component]
      [tobuys-filters/component]
      [tobuys-clear/component]
      ]]]
   [footer/component]])

(defn ^:export run []
  (reagent/render [tobuy-app]
                  (js/document.getElementById "app")))
