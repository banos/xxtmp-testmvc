(ns tobuymvc.components.tobuys-count
  (:require [tobuymvc.session :as session]
            [tobuymvc.helpers :as helpers]))

(defn items-left [tobuys]
  (let [active-count (count (helpers/tobuys-active tobuys))]
    (str (if (= 1 active-count) " item " " items ")
         "left")))

(defn component []
  [:span#tobuy-count
   [:strong (count (helpers/tobuys-active @session/tobuys))] 
   (items-left @session/tobuys)])
