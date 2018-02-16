(ns tobuymvc.session
  (:require [reagent.core :as reagent]
            [alandipert.storage-atom :refer [local-storage]]))

(reset! alandipert.storage-atom/storage-delay 0)

(def tobuys (local-storage (reagent/atom (sorted-map)) :tobuys-reagent))
;; will look like {id {:id _ :title _ :completed _ }}

(def tobuys-counter (local-storage (reagent/atom 0) :tobuys-counter-reagent))
;; will inc for each new tobuy

(def tobuys-display-type (reagent/atom :all))
;; the options are :all, :active, :completed
