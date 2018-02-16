open Lwt.Infix

(** Utility module for local storage. *)
module Storage = struct
  open Js

  let storage =
    Optdef.case (Dom_html.window##localStorage)
      (fun () -> failwith "Storage is not supported by this browser")
      (fun v -> v)

  let key = string "jsoo-tobuy-state"

  let find () =
    let r = storage##getItem(key) in
    Opt.to_option @@ Opt.map r to_string

  let set v = storage##setItem(key, string v)

  let init default = match find () with
    | None -> set default ; default
    | Some v -> v
end

(** Application data *)
module Model = struct

  type visibility =
    Completed | Active | All
    deriving (Json)

  type task = {
    description : string;
    (* backup field keep the previous description to restore it when ESC key is pressed *)
    backup : string;
    completed : bool;
    editing : bool;
    id : int;
  } deriving (Json)

  type t = {
    tasks : task list;
    field : string;
    uid : int;
    visibility : visibility;
  } deriving (Json) (* to save/restore the state in JSON *)

  let empty = {
    tasks = [];
    field = "";
    uid = 0;
    visibility = All;
  }

  let new_task desc id = {
    description = desc;
    backup = desc;
    completed = false;
    editing = false;
    id = id
  }

  let string_of_visibility v =
    match v with
    | Completed -> "Completed"
    | Active -> "Active"
    | All -> "All"

  let from_json s =
    Json.from_string<t> s

  let to_json m =
    Json.to_string<t> m

end

(** Utility module for routing *)
module Route = struct

  let visibility_from_url url =
    let fragment =
      match url with
      | Url.Http h
      | Url.Https h -> h.hu_fragment
      | Url.File f -> f.fu_fragment
    in
    match fragment with
    | "/" -> Model.All
    | "/active" -> Model.Active
    | "/completed" -> Model.Completed
    | _ -> Model.All

end

(** User interface actions *)
module Action = struct

  type action =
    | Update_field of Js.js_string Js.t
    | Editing_task of (int * bool)
    | Update_task of (int * Js.js_string Js.t)
    | Add of Js.js_string Js.t
    | Delete of int
    | Delete_complete
    | Check of (int * bool)
    | Check_all of bool
    | Change_visibility of Model.visibility
    | Escape of int

end

(** The user actions are sent in this stream *)
let stream, (send_in_stream : Action.action option -> unit) = Lwt_stream.create ()
let send_some x = send_in_stream (Some x)

(** Build HTML and send user actions *)
module View = struct

  open Action
  open Tyxml_js


  module Ev = Lwt_js_events
  let bind_event ev elem handler =
    let handler evt _ = handler evt in
    Ev.(async @@ (fun () -> ev elem handler))


  let task_input =
    Html5.(input ~a:[
        a_class ["new-tobuy"] ;
        a_placeholder "What needs to be done?" ;
        a_autofocus `Autofocus ;
      ] ())

  let task_input_dom = To_dom.of_input task_input

  (* New task input field *)
  let task_entry =
    bind_event Ev.inputs task_input_dom (fun _ ->
      Lwt.return @@ send_some (Update_field task_input_dom##value)) ;

    bind_event Ev.keypresses task_input_dom (fun evt ->
      Lwt.return @@ if evt##keyCode = 13 then send_some (Add task_input_dom##value)) ;

    Html5.(header ~a:[a_class ["header"]] [
        h1 [ pcdata "tobuys" ];
        task_input
      ])

  let set_task_input v =
    task_input_dom##value <- Js.string v

  let focus_task_input () =
    task_input_dom##focus ()

  (** One item in the tasks list *)
  let tobuy_item (tobuy:Model.task) =
    let input_check =
      Html5.(input ~a:(
          let l = [
            a_input_type `Checkbox ;
            a_class ["toggle"] ;
            a_onclick (fun _ ->
              send_some (Check (tobuy.id, (not tobuy.completed))); true
            )]
          in if tobuy.completed then a_checked `Checked :: l else l
        ) ())
    in

    let input_edit =
      Html5.(input ~a:[
          a_input_type `Text ;
          a_class ["edit"] ;
          a_value tobuy.description ;
          a_id (Printf.sprintf "tobuy-%u" tobuy.id) ;
          a_onblur (fun _ ->
            send_some (Editing_task (tobuy.Model.id, false)); true ) ;
        ] ())
    in
    let input_edit_dom = To_dom.of_input input_edit in

    bind_event Ev.inputs input_edit_dom (fun _ ->
      Lwt.return @@ send_some (Update_task (tobuy.id, input_edit_dom##value))) ;

    let key_handler evt =
      if evt##keyCode = 13 then
        send_some (Editing_task (tobuy.id, false))
      else if evt##keyCode = 27 then
        send_some (Action.Escape tobuy.id)
      else () ;
      Lwt.return_unit
    in

    bind_event Ev.keypresses input_edit_dom key_handler ;
    (* keydown needed to catch ESC key on Chrome *)
    bind_event Ev.keydowns input_edit_dom key_handler ;

    let css_class l =
      let l = if tobuy.completed then "completed"::l else l in
      if tobuy.editing then "editing"::l else l
    in

    Html5.(li ~a:[a_class (css_class [])] [
      div ~a:[a_class ["view"]] [
        input_check;
        label ~a:[a_ondblclick (
            fun evt -> send_some (Editing_task (tobuy.id, true)); true;
          )] [pcdata tobuy.Model.description];
        button ~a:[a_class ["destroy"]; a_onclick (
            fun evt -> send_some (Delete tobuy.Model.id); true;
          )] []
      ];
      input_edit;
    ])

  let focus_tobuy_item id =
    let e = Dom_html.getElementById(Printf.sprintf "tobuy-%u" id) in
    Js.Opt.case (Dom_html.CoerceTo.input e)
      (fun e -> ()) (fun e -> e##focus ())

  (** Build the tasks list *)
  let task_list visibility tasks =
    let is_visible tobuy =
      match visibility with
      | Model.Completed -> tobuy.Model.completed
      | Active -> not tobuy.completed
      | All -> true
    in
    let all_completed = List.for_all (fun e -> e.Model.completed) tasks in
    let css_visibility =
      match tasks with
      | [] -> "visibility: hidden;"
      | _ -> "visibility: visible;"
    in
    let toggle_input =
      Html5.(input ~a:(
          let l = [
            a_input_type `Checkbox ;
            a_class ["toggle-all"] ;
            a_onclick (fun _ ->
              send_some (Check_all (not all_completed)) ; true) ;
          ] in
          if all_completed then a_checked `Checked :: l else l
        ) ())
    in

    Html5.(section ~a:[a_class ["main"]; a_style css_visibility] [
        toggle_input;
        label ~a:[a_for "toggle-all"] [pcdata "Mark all as complete"];
        ul ~a:[a_class ["tobuy-list"]]
          (List.rev_map tobuy_item (List.filter is_visible tasks))
      ])

  let visibility_swap uri visibility actual_visibility =
    let css =
      if visibility = actual_visibility then ["selected"] else []
    in
    Html5.(li ~a:[a_onclick (fun evt ->
        send_some (Change_visibility visibility); true;
      )] [
        a ~a:[a_href uri; a_class css]
          [pcdata (Model.string_of_visibility visibility)]
      ])

  let controls visibility tasks =
    let open Html5 in
    let tasks_completed, tasks_left = List.partition (fun e -> e.Model.completed) tasks in
    let item = if (List.length tasks_left = 1) then " item" else " items" in
    let a_footer = [a_class ["footer"]] in
    let a_footer =
      match tasks with
      | [] -> (a_hidden `Hidden) :: a_footer
      | _ -> a_footer
    in
    let a_button = [a_class ["clear-completed"]; a_onclick (
      fun evt -> send_in_stream (Some(Delete_complete)); true;
    )] in
    let a_button =
      match tasks_completed with
      | [] -> (a_hidden `Hidden) :: a_button
      | _ -> a_button
    in
    let html =
      footer ~a:a_footer [
        span ~a:[a_class ["tobuy-count"]] [
          strong ~a:[] [pcdata (string_of_int (List.length tasks_left))];
          pcdata (item ^ " left")
        ];
        ul ~a:[a_class ["filters"]] [
          visibility_swap "#/" Model.All visibility;
          visibility_swap "#/active" Model.Active visibility;
          visibility_swap "#/completed" Model.Completed visibility;
        ];
        button ~a:a_button [
          pcdata "Clear completed"
        ]
      ]
    in
    html

  let info_footer =
    Html5.(footer ~a:[a_class ["info"]] [
        p [pcdata "Double-click to edit a tobuy"];
        p [
          pcdata "Written by ";
          a ~a:[a_href "https://stephanelegrand.wordpress.com/"] [pcdata "Stéphane Legrand"]
        ];
        p [
          pcdata "Various code improvements from ";
          a ~a:[a_href "https://github.com/Drup"] [pcdata "Gabriel Radanne"]
        ];
        p [
          pcdata "Based on ";
          a ~a:[a_href "https://github.com/evancz"] [pcdata "Elm implementation by Evan Czaplicki"]
        ];
        p [
          pcdata "Part of ";
          a ~a:[a_href "http://tobuymvc.com"] [pcdata "TodoMVC"]
        ]
      ])

  (** Build the HTML for the application *)
  let view m =
    Html5.(
      div ~a:[a_class ["tobuymvc-wrapper"]] [
        section ~a:[a_class ["tobuyapp"]] [
          task_entry ;
          task_list m.Model.visibility m.Model.tasks ;
          controls m.Model.visibility m.Model.tasks
        ];
        info_footer
      ])

  let refresh parent m =
    let rec remove_children () =
      Js.Opt.iter (parent##firstChild)
        (fun e -> Dom.removeChild parent e; remove_children ())
    in
    remove_children () ;
    Dom.appendChild parent (Tyxml_js.To_dom.of_div (view m))

end

(** Manage actions, refresh view if needed and save the state in local storage *)
module Controler =
struct

  let update parent a m =
    let open Action in
    let open Model in
    let m = match a with
      | Add field ->
        let field = Js.to_string field in
        let uid = m.uid + 1 in
        let tasks =
          let v = String.trim field in
          if v = "" then m.tasks
          else (new_task v m.uid) :: m.tasks
        in
        { m with uid = uid; field = ""; tasks = tasks }
      | Update_field field ->
        { m with field = Js.to_string field }
      | Editing_task (id, is_edit) ->
        let update_task t =
          if (t.id = id) then
            let v = String.trim t.description in
            { t with editing = is_edit; description = v; backup = v }
          else { t with editing = false }
        in
        let l = List.map update_task m.tasks in
        let l = List.filter (fun e -> e.description <> "") l in
        { m with tasks = l }
      | Update_task (id, task) ->
        let update_task t =
          if (t.id = id) then { t with description = Js.to_string task }
          else t
        in
        { m with tasks = List.map update_task m.tasks }
      | Delete id ->
        { m with tasks = List.filter (fun e -> e.id <> id) m.tasks }
      | Delete_complete ->
        { m with tasks = List.filter (fun e -> not e.completed) m.tasks }
      | Check (id, is_compl) ->
        let update_task t =
          if (t.id = id) then { t with completed = is_compl }
          else t
        in
        { m with tasks = List.map update_task m.tasks }
      | Check_all is_compl ->
        let update_task t =
          { t with completed = is_compl }
        in
        { m with tasks = List.map update_task m.tasks }
      | Change_visibility visibility ->
        { m with visibility = visibility }
      | Escape id ->
        let unedit_task t =
          if (t.id = id) then { t with editing = false; description = t.backup }
          else t
        in
        { m with tasks = List.map unedit_task m.tasks }
    in
    begin match a with
      | Add _ -> View.set_task_input "" ;
      | _ -> ()
    end ;
    begin match a with
      | Update_field _
      | Update_task _ -> ()
      | _ -> View.refresh parent m
    end ;
    begin match a with
      | Update_field _
      | Update_task _ -> ()
      | Editing_task (_, is_edit) ->
        if not is_edit then View.focus_task_input ()
      | _ -> View.focus_task_input () ;
    end ;
    begin match a with
      | Editing_task (id, is_edit) ->
        if is_edit then View.focus_tobuy_item id
      | _ -> ();
    end ;
    Storage.set @@ Model.to_json m ;
    m

end

let main _ =
  let doc = Dom_html.document in
  let parent =
    Js.Opt.get (doc##getElementById(Js.string "tobuymvc"))
      (fun () -> assert false)
  in
  (* restore the saved state or empty state if not found *)
  let m =
    try
      Model.from_json @@ Storage.init @@ Model.to_json Model.empty
    with
    | _ -> Model.empty
  in
  (* set the visibility by looking at the current url *)
  let m =
    match Url.Current.get() with
    | None -> m
    | Some u ->
        let v = Route.visibility_from_url u in
        { m with Model.visibility = v }
  in
  (* init the view *)
  View.refresh parent m ;
  View.set_task_input m.Model.field ;
  View.focus_task_input () ;
  (* main loop *)
  let rec run m =
    try_lwt
      lwt a = Lwt_stream.next stream in
      let m = Controler.update parent a m in
      run m
    with
    | Lwt_stream.Empty -> run m
  in
  run m

let onhashchanges evt _ =
  let url = evt##newURL in
  let url = Url.url_of_string (Js.to_string url) in
  match url with
  | None -> Lwt.return()
  | Some u ->
    let v = Route.visibility_from_url u in
    send_some (Change_visibility v);
    Lwt.return()

let _ = Lwt_js_events.onhashchanges onhashchanges
let _ = Lwt_js_events.onload () >>= main
