(ns tobuymvc.actions
  (:require [tobuymvc.session :as session]
            [tobuymvc.helpers :as helpers]))

(defn add-tobuy [title default]
  (let [id (helpers/create-tobuy-id)
        trimmed-title (helpers/trim-title @title)]
    (swap! session/tobuys assoc id {:id id
                                   :title trimmed-title
                                   :completed false})
    (reset! title default)))

(defn toggle-tobuy [id]
  (swap! session/tobuys update-in [id :completed] not))

(defn toggle-all-tobuys [bool]
  (doseq [tobuy (helpers/tobuys-all @session/tobuys)]
    (swap! session/tobuys assoc-in [(:id tobuy) :completed] (not bool))))

(defn delete-tobuy [id]
  (swap! session/tobuys dissoc id))

(defn save-tobuy [id title editing]
  (let [trimmed-title (helpers/trim-title @title)]
    (if-not (empty? trimmed-title)
      (swap! session/tobuys assoc-in [id :title] trimmed-title)
      (delete-tobuy id))
    (reset! editing false)))

(defn clear-completed-tobuys [tobuys]
  (doseq [tobuy (helpers/tobuys-completed tobuys)]
    (delete-tobuy (:id tobuy))))
