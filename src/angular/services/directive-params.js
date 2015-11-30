import isObject from 'lodash/lang/isPlainObject';
import camelCase from 'lodash/string/camelCase';
import Watcher from './watcher';

let getAvailableParams = (componentModel) => {
  let params = componentModel.getParams();
  let keys = [];

  if (isObject(params)) {
    keys = Object.keys(params);
  }

  // TODO: only if restrict == A?
  let name = componentModel.getName();
  keys.push(name);

  let pipes = componentModel.getPipes();
  for (let key of Object.keys(pipes)) {
    let translatedKey = camelCase(key);
    keys.push(translatedKey);
  }

  return keys;
};

let _scope = Symbol('$scope');
let _attrs = Symbol('$attrs');
let _isIsolated = Symbol('is-scope-isolated');
let _definitions = Symbol('definitions');
let _watcher = Symbol('$watcher');
let _name = Symbol('name');
let _pipes = Symbol('pipes');

/**
 * TODO: redevelop component
 */
export default class DirectiveParams {
  constructor($scope, $attrs, componentModel) {
    this[_scope] = $scope;
    this[_attrs] = $attrs;
    this[_name] = componentModel.getName();
    this[_isIsolated] = componentModel.isIsolated();
    this[_definitions] = getAvailableParams(componentModel);

    this[_watcher] = new Watcher($scope);

    let pipes = component.getPipes();

    this[_pipes] = {};
    for (let key of Object.keys(pipes)) {
      let translatedKey = camelCase(key);

      this[_pipes][translatedKey] = {
        pipe: pipes[key],
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

    if (this[_pipes].hasOwnProperty(key)) {
      let state = this[_pipes][key];
      let Pipe = state.pipe;

      if (!attrs.hasOwnProperty(key)) {
        if (!state.value) {
          state.value = new Pipe();
        }

        value = state.value;
      } else {
        if (!(value instanceof Pipe)) {
          throw new Error(`"${this[_name]}" - directive pipe "${key}" has wrong class`);
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

  parse(key) {
    let $scope = this[_scope];
    let $attrs = this[_attrs];

    if (!$attrs.hasOwnProperty(key)) {
      throw new Error(`"${this[_name]}" - can not parse "${key}" because this params is not passed to attributes`);
    }

    let expression = $attrs[key];
    let evaluatingScope = null;
    
    if (this[_isIsolated]) {
      evaluatingScope = $scope.$parent;
    } else {
      evaluatingScope = $scope;
    }

    return evaluatingScope.$eval(expression);
  }
}
