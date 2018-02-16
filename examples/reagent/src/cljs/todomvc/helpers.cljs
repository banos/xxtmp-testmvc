(ns tobuymvc.helpers
  (:require [tobuymvc.session :as session]))

(def enter-key 13)

(def escape-key 27)

(defn trim-title [title]
  (clojure.string/trim title))

(defn display-elem [bool] 
  (if bool "inline" "none"))

(defn tobuy-display-filter [completed display-type]
  (case display-type
    :completed completed
    :active (not completed)
    true))

(defn create-tobuy-id []
  (swap! session/tobuys-counter inc))

(defn tobuys-all [tobuys]
  (vals tobuys))

(defn tobuys-active [tobuys]
  (let [tobuys-all (tobuys-all tobuys)]
    (filter #(not (:completed %)) tobuys-all)))

(defn tobuys-completed [tobuys]
  (let [tobuys-all (tobuys-all tobuys)]
    (filter :completed tobuys-all)))

(defn tobuys-any? [tobuys]
  (pos? (count (tobuys-all tobuys))))

(defn tobuys-any-completed? [tobuys]
  (pos? (count (tobuys-completed tobuys))))

(defn tobuys-all-completed? [tobuys]
  (= (count (tobuys-all tobuys))
     (count (tobuys-completed tobuys))))
