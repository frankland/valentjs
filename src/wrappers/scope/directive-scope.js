import Scope from './scope';

var stateModelKey = Symbol('state-model');

export default class DirectiveScope extends Scope {
  constructor($scope, InjectorApi, Logger) {
    super($scope, InjectorApi, Logger);
  }

  setStateModel(stateModel) {
    this[stateModelKey] = stateModel;
  }

  getStateModel() {
    return this[stateModelKey];
  }
}

