import isObject from 'lodash/lang/isPlainObject';
import camelCase from 'lodash/string/camelCase';
import Watcher from './watcher';

let getAvailableParams = (component) => {
  let params = component.getParams();
  let keys = [];

  if (isObject(params)) {
    keys = Object.keys(params);
  }

  let name = component.getName();
  keys.push(name);

  let substitutions = component.getSubstitution();
  for (let key of Object.keys(substitutions)) {
    let translatedKey = camelCase(key);
    keys.push(translatedKey);
  }

  return keys;
};

let _scope = Symbol('$scope');
let _attrs = Symbol('$attrs');
let _definitions = Symbol('definitions');
let _watcher = Symbol('$watcher');
let _name = Symbol('name');
let _substitutions = Symbol('substitutions');

export default class DirectiveParams {
  constructor($scope, $attrs, component) {
    this[_scope] = $scope;
    this[_attrs] = $attrs;
    this[_name] = component.getName();
    this[_definitions] = getAvailableParams(component);

    this[_watcher] = new Watcher($scope);

    let substitutions = component.getSubstitution();

    this[_substitutions] = {};
    for (let key of Object.keys(substitutions)) {
      let translatedKey = camelCase(key);

      this[_substitutions][translatedKey] = {
        substitution: substitutions[key],
        value: null
      };
    }
  }

  isAvailable(key) {
    return this[_definitions].indexOf(key) != -1;
  }

  get(key) {
    if (!this.isAvailable(key)) {
      throw new Error(`"${this[_name]}" - directive param "${key}" is not defined at directive config`);
    }

    let value = this[_scope][key];
    let attrs = this[_attrs].$attr;

    if (this[_substitutions].hasOwnProperty(key)) {
      let state = this[_substitutions][key];
      let Substitutions = state.substitution;

      if (!attrs.hasOwnProperty(key)) {
        if (!state.value) {
          state.value = new Substitutions();
        }

        value = state.value;
      } else {
        if (!(value instanceof Substitutions)) {
          throw new Error(`"${this[_name]}" - directive substitution "${key}" has wrong class`);
        }
      }
    }

    return value;
  }

  watch(key, cb) {
    if (!this.isAvailable(key)) {
      throw new Error(`"${this[_name]}" - can not initialize watcher for "${key}" because this params is not defined at directive config`);
    }

    return this[_watcher].watch(key, cb);
  }
}
