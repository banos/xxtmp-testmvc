(ns tobuymvc.components.footer)

(defn component []
  [:footer#info
   [:p "Double-click to edit a tobuy"]
   [:p "Credits: " 
    [:a {:href "https://twitter.com/gadfly361"} "Matthew Jaoudi"] ", "
    [:a {:href "https://twitter.com/yogthos"} "Dmitri Sotnikov"] ", and "
    [:a {:href "https://twitter.com/holmsand"} "Dan Holmsand"]]
   [:p "Part of " [:a {:href "http://tobuymvc.com"} "TodoMVC"]]])
