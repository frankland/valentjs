import Scope from './scope';

var unsubscribeKey = Symbol('unsubscribe');
var stateModelKey = Symbol('state-model');
var defaultListenerKey = Symbol('default-listener');

export default class DirectiveScope extends Scope {
  constructor($scope, injectorApi, controllerName) {
    super($scope, injectorApi, controllerName);

    this[unsubscribeKey] = [];
  }

  setStateModel(stateModel) {
    this[stateModelKey] = stateModel;

    /**
     * Update scope state if model's state was changed
     */
    this[defaultListenerKey] = this.listen((state) => {
      console.log(state);
      this.push('state', state);
    });
  }

  unsubscribeDefault(){
    this[defaultListenerKey]();
  }

  getStateModel() {
    return this[stateModelKey];
  }

  throwIfEmptyStateModel() {
    var stateModel = this.getStateModel();

    if (!angular.isObject(stateModel)) {
      throw new Error('State model is not defined');
    }
  }

  listen(func) {
    this.throwIfEmptyStateModel();

    return this.listenTo(this.getStateModel(), func);
  }

  listenTo(stateModel, func) {

    if (!angular.isObject(stateModel)) {
      throw new Error('StateModel should be an object');
    }

    var off = stateModel.listen(func);

    this[unsubscribeKey].push(off);

    return off;
  }

  unsubscribeAll() {
    var unsubscribeFuncs = this[unsubscribeKey];

    for (var i = 0, size = unsubscribeFuncs.length; i < size; i++) {
      var unsubscribe = unsubscribeFuncs[i];
      unsubscribe();
    }
  }
}

