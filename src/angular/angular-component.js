import camelCase from 'lodash/string/camelCase';

import isObject from 'lodash/lang/isPlainObject';
import isBoolean from 'lodash/lang/isBoolean';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import RegisterException from '../exceptions/register';
import ValentComponent from '../valent-component';

import * as validation from './validation/structures';


let normalize = options => {
  let require = options.require;

  let normalizedRequire = null;
  if (require) {
    if (isArray(require)) {
      normalizedRequire = require;
    } else {
      normalizedRequire = [require];
    }
  }

  return Object.assign({}, options, {
    require: normalizedRequire
  });
};

export default class AngularComponent extends ValentComponent {
  constructor(name, ComponentClass, options) {
    let normalized = normalize(options);
    super(name, ComponentClass, normalized);
  }

  static validate(name, ComponentClass, options) {
    let errors = super.validate(name, ComponentClass, options);

    let isValidRequire = validation.isValidRequire(options.require);
    let isValidTransclude = validation.isValidTransclude(options.transclude);
    let isValidModule = validation.isValidModule(options.module);
    let isValidNamespace = validation.isValidNamespace(options.as);


    if (!isValidRequire) {
      errors.push('require should string or array of strings');
    }

    if (!isValidTransclude) {
      errors.push('transclude should be boolean value or object (for multi-slot transclude)');
    }

    if (!isValidModule) {
      errors.push('Module name should be a string');
    }

    if (!isValidNamespace) {
      errors.push('Namespace should be a string');
    }

    return errors;
  }

  getDirectiveName() {
    let name = this.getName();
    return camelCase(name);
  }

  getModule() {
    return this.options.module || null;
  }

  getNamespace() {
    return this.options.as || 'controller';
  }

  isIsolated() {
    let params = this.getParams();
    return isObject(params);
  }

  getTransclude() {
    return this.options.transclude;
  }

  getRequire() {
    return this.options.require;
  }
}
