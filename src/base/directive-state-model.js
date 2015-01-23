var listenersKey = Symbol('listeners');

export default class DirectiveStateModel {
  constructor() {
    this.state = {};
    this[listenersKey] = new Set();
  }

  listen(func) {

    var listeners = this[listenersKey];

    if (listeners.has(func)) {
      throw new Error('Duplicate listener');
    }

    listeners.add(func);
    var state = this.getState();
    func(state);

    return () => listeners.delete(func);
  }

  getState(){
    return angular.copy(this.state);
  }

  trigger() {
    var listeners = this[listenersKey];

    for (var listener of listeners) {
      var copy = this.getState();
      listener(copy);
    }
  }
}
