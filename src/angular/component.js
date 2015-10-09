import camelCase from 'lodash/string/camelCase';

import isObject from 'lodash/lang/isPlainObject';
import isBoolean from 'lodash/lang/isBoolean';

let validate = (component) => {
  let errors = [];
  let params = this.comopnent.options.params;

  if (!isBoolean(params) || !isObject(params)) {
    errors.push('components params could be an object or boolean');
  }

  let interfaces = component.getInterfaces();
  let optional = component.getOptional();

  if (component.isIsolated() && (component.hasInterfaces() || optional.hasOptionals())) {
    errors.push('It is not available to setup interfaces of optional params if params are defined as boolean');
  }

  let withoutTemplate = !this.comopnent.hasTemplate()
    && !this.comopnent.hasTemplateUrl()
    && !this.comopnent.hasTemplateMethod();

  if (withoutTemplate && component.Component.compile) {
    throw new Error('directive should implement compile method or defined with template');
  }

  return errors;
};

export default class Component {
  constructor(component) {
    let errors = validate(component);

    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.comopnent = component;
  }

  getName() {
    return camelCase(this.comopnent.name);
  }

  getModule() {
    return this.comopnent.options.module || null;
  }

  getController() {
    // NOTE: comopnent.Component :(
    return this.component.Component;
  }

  getNamespace() {
    return this.comopnent.options.as || 'controller';
  }

  getTemplate() {
    return this.component.template;
  }

  hasTemplate() {
    return this.comopnent.hasTemplate();
  }

  getTemplateUrl() {
    return this.component.templateUrl;
  }

  hasTemplateUrl() {
    return this.comopnent.hasTemplateUrl();
  }

  getTemplateMethod() {
    return this.comopnent.Component.render;
  }

  hasTemplateMethod() {
    return this.comopnent.hasTemplateMethod();
  }

  withoutTemplate() {
    return !this.hasTemplate() && !this.hasTemplateUrl() && !this.hasTemplateMethod();
  }

  getParams() {
    return this.comopnent.options.params;
  }

  isIsolated() {
    let params = this.getParams();
    return isObject(params);
  }

  hasInterfaces() {
    let interfaces = this.getInterfaces();
    return Object.keys(interfaces).length;
  }

  getInterfaces() {
    return this.comopnent.options.interfaces || {};
  }

  hasOptionals() {
    let optionals = this.getOptional();
    return Object.keys(optionals).length;
  }

  getOptionals() {
    return this.comopnent.options.optional || {};
  }
}
