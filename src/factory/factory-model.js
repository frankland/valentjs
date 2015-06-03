import isFunction from 'lodash/lang/isFunction';

import FactoryException from './factory-exception';


function setDefaults(config) {
  config.dependencies = [];
}

var config = Symbol('config');

export class FactoryModel {
  constructor(name) {
    if (!name) {
      throw new Error('Factory name should be described');
    }

    this[config] = {};
    this[config].name = name;

    setDefaults(this[config]);

    this.exception = new FactoryException(name);
  }

  getName() {
    return this[config].name;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    this[config].module = name;
  }

  getApplicationName() {
    return this[config].name;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    this[config].dependencies = this[config].dependencies.concat(dependencies);
  }

  getDependencies() {
    return this[config].dependencies;
  }

  /**
   * Set factory class
   * @param src
   */
  setSource(src) {
    if (!isFunction(src)) {
      throw this.exception.wrongFactorySource();
    }

    this[config].src = src;
  }

  getSource() {
    return this[config].src;
  }
}
