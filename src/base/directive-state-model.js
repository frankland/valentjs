import EventManager from './event-manager';

var listenersKey = Symbol('listeners');

export default class DirectiveStateModel extends EventManager {
  constructor() {
    super();

    this.state = {};
  }

  getState() {
    return angular.copy(this.state);
  }

  sync() {
    var state = this.getState();

    this.trigger('sync', state);
  }
}
