import camelCase from 'lodash/string/camelCase';

import isObject from 'lodash/lang/isPlainObject';
import isBoolean from 'lodash/lang/isBoolean';
import isFunction from 'lodash/lang/isFunction';

import RegisterException from '../exceptions/register';
import ValentComponent from '../valent-component';

let validate = (component) => {
  let errors = [];
  let params = component.getParams();

  // https://docs.angularjs.org/api/ng/service/$compile
  if (!isBoolean(params) && !isObject(params)) {
    errors.push('components params should be an object or boolean');
  }

  if (!component.isIsolated() && (component.hasInterfaces() || component.hasOptionals())) {
    errors.push('It is not available to setup interfaces of optional params if params are defined as boolean');
  }

  if (component.withoutTemplate() && !component.hasCompileMethod()) {
    errors.push('directive should implement compile method or defined with template');
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

  hasCompileMethod() {
    return isFunction(this.Component.compile);
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

  getParams() {
    return this.options.hasOwnProperty('params') ? this.options.params : {};
  }

  getRequire() {
    return this.options.require || {};
  }
}
