import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';

import RegisterException from './exceptions/register';

let validate = (component) => {
  let errors = [];

  let name = component.getName();
  
  if (!name || name.indexOf(' ') != -1) {
    errors.push('component\'s name could not be empty or contain spaces');
  }

  // --- VALIDATE COMPONENT CONSTRUCTOR -----
  let Controller = component.getController();
  if (!isFunction(Controller)) {
    errors.push('controller should be a constructor');
  }

  // ----- VALIDATE TEMPLATES -----
  let template = component.getTemplate();
  let templateUrl = component.getTemplateUrl();

  if (component.withoutTemplate()) {
    if (!component.hasCompileMethod()) {
      // TODO: means that component with restrict "A"?
      // errors.push('One of config options - template / templateUrl or components\'s class static function "render()" or "compile()" should be defined');
      console.log('devnotes: check');
    }
  } else if (template) {

    if (!isString(template) && !isFunction(template)) {
      errors.push('template should be string or function');
    }

  } else if (templateUrl) {

    if (!isString(templateUrl)) {
      errors.push('templateUrl should be string');
    }
  }

  return errors;
};

export default class ValentComponent {
  constructor(name, Component, options = {}) {
    this.name = name;
    this.options = options;

    // TODO: rename! at angular-controller - another naming
    this.Component = Component;

    let errors = validate(this);
    if (errors.length) {
      throw new RegisterException(name, 'valent-component', errors);
    }
  }

  getName() {
    return this.name;
  }

  getController() {
    return this.Component;
  }

  hasTemplate() {
    return !!this.options.template;
  }

  getTemplate() {
    return this.options.template;
  }

  hasTemplateUrl() {
    return !!this.options.templateUrl;
  }

  getTemplateUrl() {
    return this.options.templateUrl;
  }

  hasTemplateMethod() {
    return isFunction(this.Component.render);
  }

  getTemplateMethod() {
    return this.Component.render;
  }

  withoutTemplate() {
    return !this.hasTemplate() && !this.hasTemplateUrl() && !this.hasTemplateMethod();
  }

  hasCompileMethod() {
    return isFunction(this.Component.compile);
  }

  getParams() {
    return this.options.params;
  }

  hasInterfaces() {
    let interfaces = this.getInterfaces();
    return !!Object.keys(interfaces).length;
  }

  getInterfaces() {
    return this.options.interfaces || {};
  }

  hasOptions() {
    let options = this.getOptions();
    return !!Object.keys(options).length;
  }

  getOptions() {
    return this.options.options || {};
  }

  hasPipes() {
    let pipes = this.options.pipes;
    return !!Object.keys(pipes).length;
  }

  getPipes() {
    return this.options.pipes || {};
  }

  getRestrict() {
    return this.options.restrict;
  }
}
