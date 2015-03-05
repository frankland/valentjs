var listenersKey = Symbol('listeners');

export default class EventManager {
  constructor(name) {
    this.name = name;
    this.listeners = 0;
    this[listenersKey] = new Map();
  }

  listen(event, func) {

    if (!angular.isString(event) || !angular.isFunction(func)) {
      throw new Error('Wrong arguments for .listen method');
    }

    var storage = this[listenersKey];

    var listeners = null;
    if (storage.has(event)) {
      listeners = storage.get(event);
    } else {
      listeners = new Set();
      storage.set(event, listeners);
    }

    if (listeners.has(func)) {
      throw new Error(`Duplicate listener for ${event} event`);
    }

    listeners.add(func);
    this.listeners++;

    return () => {
      listeners.delete(func);
      this.listeners--;
    };
  }

  trigger(event, ...args) {

    if (this.name) {
      //console.log(`triggered event "${event}" on "${this.name}"`);
    }

    var storage = this[listenersKey];

    if (storage.has(event)) {
      var listeners = storage.get(event);

      listeners.forEach(function(listener){
        listener(...args);
      });

      //for (var listener of listeners) {
      //  listener(...args);
      //}
    } else {
      //throw new Error(`There are no listeners for "${event}" event at state model`);
      if (this.name) {
        //console.info(`There are no listeners for "${event}" event at pipe "${this.name}"`);
      } else {
        //console.info(`There are no listeners for "${event}" event at pipe`);
      }
    }
  }
}
