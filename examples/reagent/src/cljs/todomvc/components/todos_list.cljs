(ns tobuymvc.components.tobuys-list
  (:require [tobuymvc.components.tobuy-item :as tobuy-item]))

(defn component [tobuys]
  [:ul#tobuy-list
   (for [tobuy tobuys]
     ^{:key (:id tobuy)}
     [tobuy-item/component tobuy])])
