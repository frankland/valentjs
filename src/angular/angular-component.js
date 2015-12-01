import camelCase from 'lodash/string/camelCase';

import isObject from 'lodash/lang/isPlainObject';
import isBoolean from 'lodash/lang/isBoolean';
import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import RegisterException from '../exceptions/register';
import ValentComponent from '../valent-component';

let validate = (component) => {
  let errors = [];
  let params = component.getParams();

  // https://docs.angularjs.org/api/ng/service/$compile
  if (!isBoolean(params) && !isObject(params)) {
    errors.push('components params should be an object or boolean');
  }

  if (!component.isIsolated() && (component.hasInterfaces() || component.hasOptions())) {
    errors.push('It is not available to setup interfaces of optional params if params are defined as boolean (not isolated scope)');
  }

  // TODO: use tcomb validation
  if (!isString(component.options.require) && !isArray(component.options.require)) {
    errors.push('require options should be array of strings of string');
  }

  return errors;
};

export default class AngularComponent extends ValentComponent {
  constructor(name, Controller, options) {
    super(name, Controller, options);

    let errors = validate(this);

    if (errors.length) {
      throw new RegisterException(name, 'angular-component', errors);
    }
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
    return isObject(params) || params === true;
  }

  getParams() {
    return this.options.hasOwnProperty('params') ? this.options.params : {};
  }

  getRequire() {
    let require = null;

    if (isArray(this.options.require)) {
      require = this.options.require;
    } else {
      require = [this.options.require];
    }

    return require;
  }
}
