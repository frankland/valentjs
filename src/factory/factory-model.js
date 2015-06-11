import isFunction from 'lodash/lang/isFunction';

import FactoryException from './factory-exception';


function setDefaults(config) {
  config.dependencies = [];
}

var local = {
  config: Symbol('config')
};

export class FactoryModel {
  constructor(name) {
    if (!name) {
      throw new Error('Factory name should be described');
    }

    this[local.config] = {};
    this[local.config].name = name;

    setDefaults(this[local.config]);

    this.exception = new FactoryException(name);
  }

  getName() {
    return this[local.config].name;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    this[local.config].module = name;
  }

  getApplicationName() {
    return this[local.config].name;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    this[local.config].dependencies = this[local.config].dependencies.concat(dependencies);
  }

  getDependencies() {
    return this[local.config].dependencies;
  }

  /**
   * Set factory class
   * @param src
   */
  setSource(src) {
    if (!isFunction(src)) {
      throw this.exception.wrongFactorySource();
    }

    this[local.config].src = src;
  }

  getSource() {
    return this[local.config].src;
  }
}
