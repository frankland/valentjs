import isObject from 'lodash/lang/isPlainObject';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';


import DirectiveException from './directive-exception';
import camelCase from 'lodash/string/camelCase';


function setDefaults(config) {
  config.dependencies = [];
  config.pipes = {};
  config.scope = null;
  config.replace = true;
  config.restrict = null;
}

var availableRestricts = ['A', 'E', 'C'];
var config = Symbol('config');

export default class DirectiveModel {
  constructor(name) {
    if (!name) {
      throw DirectiveException.noDirectiveName();
    }

    this[config] = {};
    this[config].name = camelCase(name);
    this[config].controllerNmae = `<${name}>`;

    setDefaults(this[config]);
  }

  getName() {
    return this[config].name;
  }

  getControllerName() {
    return this[config].controllerNmae;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    this[config].application = name;
  }

  getApplicationName() {
    return this[config].application;
  }

  /**
   *
   * @param require
   */
  require(require) {
    if (!isArray(require)) {
      this[config].require = [require];
    } else {
      this[config].require = require;
    }
  }

  hasRequire() {
    return !!this[config].require;
  }

  getRequire() {
    return this[config].require;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    if (!isArray(dependencies)) {
      throw new DirectiveException.dependenciesAreNotArray();
    }

    for (var dependency of dependencies) {
      this.addDependency(dependency);
    }
  }

  addDependency(dependency) {
    if (!isString(dependency)) {
      throw new DirectiveException.dependencyIsNotString();
    }

    this[config].dependencies.push(dependency);
  }

  getDependencies() {
    return this[config].dependencies;
  }

  /**
   *
   * @param transclude
   */
  setTransclude(transclude) {
    this[config].transclude = !!transclude;
  }

  getTransclude() {
    return this[config].transclude;
  }

  /**
   * no setter because
   * https://github.com/angular/angular.js/commit/eec6394a342fb92fba5270eee11c83f1d895e9fb#commitcomment-8124407
   * @returns {*}
   */
  getReplace() {
    return this[config].replace;
  }

  /**
   * Set directive's attributes
   * @param scope
   */
  setScope(scope) {
    if (!isObject(scope)) {
      throw DirectiveException.wrongScopeFormat();
    }

    this[config].scope = scope;
  }

  getScope() {
    return this[config].scope;
  }

  /**
   * Set directive's restrict
   * @param restrict
   */
  setRestrict(restrict) {
    if (!isString(restrict)) {
      throw DirectiveException.wrongRestrictOption()
    }

    var splited = restrict.split('');
    for (var char of splited) {
      if (availableRestricts.indexOf(char) == -1) {
        throw DirectiveException.wrongRestrictOption()
      }
    }

    this[config].restrict = restrict;
  }

  getRestrict() {
    return this[config].restrict;
  }

  /**
   * Set directive's controller class
   * @param controller
   */
  setController(controller) {
    this[config].controller = controller;
  }

  getController() {
    return this[config].controller;
  }

  /**
   * Set directive's pipes
   * @param pipes
   */
  setPipes(pipes) {
    if (!isObject(pipes)) {
      throw DirectiveException.wrongPipesFormat();
    }

    this[config].pipes = pipes;
  }

  getPipes() {
    return this[config].pipes;
  }

  hasPipes() {
    return !!this[config].pipes;
  }

  /**
   *
   * @param template
   */
  setTemplate(template) {
    if (this[config].templateUrl) {
      throw DirectiveException.templateUrlAlreadyExists();
    }

    this[config].template = template;
  }

  getTemplate() {
    return this[config].template;
  }

  /**
   *
   * @param templateUrl
   */
  setTemplateUrl(templateUrl) {
    if (this[config].template) {
      throw DirectiveException.templateAlreadyExists();
    }

    this[config].templateUrl = templateUrl;
  }

  getTemplateUrl() {
    return this[config].templateUrl;
  }
}
