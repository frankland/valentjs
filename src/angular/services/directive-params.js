import isObject from 'lodash/lang/isPlainObject';
import camelCase from 'lodash/string/camelCase';
import Watcher from './watcher';

let getAvailableParams = (componentModel) => {
  let bindings = componentModel.getBindings();
  let keys = [];

  if (isObject(bindings)) {
    keys = Object.keys(bindings);
  }

  if (componentModel.isAttributeComponent()) {
    let name = componentModel.getName();
    keys.push(name);
  }

  if (componentModel.hasPipes()) {
    let pipes = componentModel.getPipes();
    for (let key of Object.keys(pipes)) {
      let translatedKey = camelCase(key);
      keys.push(translatedKey);
    }
  }

  return keys;
};

let _scope = Symbol('$scope');
let _attrs = Symbol('$attrs');
let _attrValues = Symbol('attributes-inline-values');
let _element = Symbol('$element');

let _isIsolated = Symbol('is-scope-isolated');
let _definitions = Symbol('definitions');
let _watcher = Symbol('$watcher');
let _name = Symbol('name');
let _pipes = Symbol('pipes');

/**
 * TODO: redevelop Pipes
 */
export default class DirectiveParams {
  constructor($scope, $attrs, $element, componentModel) {
    this[_scope] = $scope;
    this[_element] = $element;

    this[_name] = componentModel.getName();
    this[_isIsolated] = componentModel.isIsolated();
    this[_definitions] = getAvailableParams(componentModel);
    this[_watcher] = new Watcher($scope);


    this[_attrs] = $attrs;
    this[_attrValues] = {};
    for (let key of Object.keys(this[_attrs].$attr)) {
      this[_attrValues][key] = this[_attrs][key];
    }

    // setup pipes classes and instances
    this[_pipes] = {};

    if (componentModel.hasPipes()) {
      let pipes = componentModel.getPipes();

      for (let key of Object.keys(pipes)) {
        this[_pipes][key] = {
          pipe: pipes[key],
          value: null
        };
      }
    }

    for (let key of this[_definitions]) {
      Object.defineProperty(this, key, {
        set: () => {
          throw new Error('Can not set directive params property');
        },
        get: () => {
          return this.get(key);
        }
      });
    }
  }

  getElement() {
    return this[_element];
  }

  getAttributes() {
    return this[_attrValues];
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

      // parse pipe from attribtues
      value = this.parse(key);

      if (!attrs.hasOwnProperty(key)) {
        // if pipe's key is not exists in attributes - create it
        if (!state.value) {
          state.value = new Pipe();
        }

        value = state.value;
      } else {
        // if pipe's key is exists in attributes - use it
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

  attr(key) {
    let $attrs = this[_attrs];
    return $attrs[key];
  }

  parse(key) {
    let $scope = this[_scope];
    let $attrs = this[_attrs];

    let parsed = undefined;

    // parse - means that we parse attribute value form parent scope
    if ($attrs.hasOwnProperty(key)) {
      let expression = $attrs[key];
      parsed = $scope.$parent.$eval(expression);
    } else {
      //throw new Error(`"${this[_name]}" - can not parse "${key}" because this params is not passed to attributes`);
    }

    return parsed;
  }
}
