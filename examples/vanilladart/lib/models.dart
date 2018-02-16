library models;

class Tobuy {
  String id;
  String title;
  bool completed;

  Tobuy(this.id, this.title, {this.completed: false});

  Tobuy.fromJson(Map json) {
    id = json['id'];
    title = json['title'];
    completed = json['completed'];
  }

  // this is automatically called by JSON.encode
  Map toJson() {
    return {'id': id, 'title': title, 'completed': completed};
  }
}
