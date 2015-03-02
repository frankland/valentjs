var unsubscribeKey = Symbol('unsubscribe-storage');

export default class Controller {

  constructor(scope, injector) {
    this.scope = scope;
    this.injector = injector;

    this[unsubscribeKey] = [];
  }

  getScope() {
    return this.scope;
  }

  error(message) {
    this.scope.error(message);
  }

  /**
   * Scope shortcuts
   * TODO: remove arguments. pass args 1to1
   */
  push() {
    this.scope.push.apply(this.scope, arguments);
    return this;
  }

  pushAndApply() {
    this.scope.pushAndApply.apply(this.scope, arguments);
  }

  commit() {
    this.scope.commit.apply(this.scope, arguments);
    return this;
  }

  get() {
    return this.scope.get.apply(this.scope, arguments);
  }

  /**
   * Injector shortcut
   */
  dep() {
    return this.injector.get.apply(this.injector, arguments);
  }

  /**
   * Directive State Model
   */
  listen(stateModel, event, func) {
    var unsubscribe = stateModel.listen(event, func);

    var storage = this[unsubscribeKey];
    storage.push(unsubscribe);
  }

  onDestroy() {
    var storage = this[unsubscribeKey];

    for (var unsubscribe of storage) {
      unsubscribe();
    }
  }
}
