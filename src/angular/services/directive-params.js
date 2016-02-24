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

  if (componentModel.getOptions()) {
    let options = componentModel.getOptions();
    for (let key of Object.keys(options)) {
      let translatedKey = camelCase(key);
      keys.push(translatedKey);
    }
  }

  return keys;
};

const processPipes = (componentModel, attrs, parse) => {
  let normalizedPipes = {};

  if (componentModel.hasPipes()) {
    let pipes = componentModel.getPipes();

    for (let key of Object.keys(pipes)) {
      let Pipe = pipes[key];

      // parse pipe from attributes
      let value = parse(key);

      if (!attrs.hasOwnProperty(key)) {
        // if pipe's key is not exists in attributes - create it
        value = new Pipe();
      } else {
        // if pipe's key is exists in attributes - use it
        if (!(value instanceof Pipe)) {
          throw new Error(`"${this[_name]}" - directive pipe "${key}" has wrong class`);
        }
      }

      normalizedPipes[key] = value;
    }
  }

  return normalizedPipes;
};

const processOptions = (componentModel, parse) => {
  let normalizedOptions = {};

  if (componentModel.hasOptions()) {
    let options = componentModel.getOptions();

    for (let key of Object.keys(options)) {
      let optionInstance = parse(key);

      if (optionInstance) {
        let OptionClass = options[key];

        if (!(optionInstance instanceof OptionClass)) {
          throw Error(`options "${key}" has wrong class`);
        }

        normalizedOptions[key] = optionInstance;
      } else {
        normalizedOptions[key] = null;
      }
    }
  }

  return normalizedOptions;
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
let _options = Symbol('options');

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

    // setup pipes
    this[_pipes] = processPipes(componentModel, $attrs, (key) => {
      return this.parse(key);
    });

    // setup options
    this[_options] = processOptions(componentModel, (key) => {
      return this.parse(key);
    });

    // initialize getters
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

    let value = null;

    if (this[_options].hasOwnProperty(key)) {
      value = this[_options][key];
    } else if (this[_pipes].hasOwnProperty(key)) {
      value = this[_pipes][key];
    } else {
      value = this[_scope][key];
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
    return this[_attrValues][key];
  }

  hasAttr(key) {
    return this[_attrValues].hasOwnProperty(key);
  }

  parse(key) {
    let $scope = this[_scope];
    let $attrs = this[_attrs];

    let parsed = undefined;

    // parse - means that we parse attribute value form parent scope
    if ($attrs.hasOwnProperty(key)) {
      let expression = $attrs[key];
      let scopeToParse = this[_isIsolated] ? $scope.$parent : $scope;

      parsed = scopeToParse.$eval(expression);
    } else {
      //throw new Error(`"${this[_name]}" - can not parse "${key}" because this params is not passed to attributes`);
    }

    return parsed;
  }
}
