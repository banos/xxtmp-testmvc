interface ITobuy {
  id: string,
  title: string,
  completed: boolean
}

interface ITobuyItemProps {
  key : string,
  tobuy : ITobuy;
  editing? : boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: ()  => void;
  onCancel: (event : any) => void;
  onToggle: () => void;
}

interface ITobuyItemState {
  editText : string
}

interface ITobuyFooterProps {
  completedCount : number;
  onClearCompleted : any;
  nowShowing : string;
  count : number;
}


interface ITobuyModel {
  key : any;
  tobuys : Array<ITobuy>;
  onChanges : Array<any>;
  subscribe(onChange);
  inform();
  addTobuy(title : string);
  toggleAll(checked);
  toggle(tobuyToToggle);
  destroy(tobuy);
  save(tobuyToSave, text);
  clearCompleted();
}

interface IAppProps {
  model : ITobuyModel;
}

interface IAppState {
  editing? : string;
  nowShowing? : string
}
