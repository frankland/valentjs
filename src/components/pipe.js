import EventManager from './event-manager';

var listeners = Symbol('listeners');

export default class Pipe extends EventManager {
  constructor(name) {
    super(name);
    this.state = {};

    //this.attached = new WeakMap();
    //this.attached = [];
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return angular.copy(this.state);
  }

  sync() {
    var state = this.getState();
    this.trigger('sync', state);
  }

  //attach(pipe, proxy){
  //  //this.attached.set(Instance, proxy || {});
  //  this.attached.push({
  //    pipe,
  //    proxy
  //  });
  //}

  //detach(Instance) {
    //if (this.attached.has(Instance)) {
    //  this.attached.delete(Instance);
    //}
  //}

  //trigger(event) {
  //
  //  for (var { pipe, proxy } of this.attached) {
  //    var proxyName = event;
  //
  //    if (proxy.hasOwnProperty(event)) {
  //      proxyName = proxy[event];
  //    }
  //
  //    pipe.trigger(proxyName);
  //  }
  //
  //  var args = Array.prototype.slice.call(arguments);
  //  super.trigger(...args);
  //}
}
