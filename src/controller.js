import isFunction from 'lodahs/lang/isFunction';
import isArray from 'lodahs/lang/isArray';
import isObject from 'lodahs/lang/isObject';
import isString from 'lodahs/lang/isString';

let validate = (name, Controller, options) => {
  let errors = [];

  // --- VALIDATE NAME -----
  if (!name || name.indexOf(' ') != -1) {
    errors.push('controller\'s name could not be empty or contain spaces');
  }

  // --- VALIDATE CONTROLLER CONSTRUCTOR -----
  if (!isFunction(Controller)) {
    errors.push('controller should be a constructor');
  }

  // ----- VALIDATE TEMPLATES -----
  let template = options.template;
  let templateUrl = options.templateUrl;

  if (!template && !templateUrl && !isFunction(Controller.render)) {
    errors.push('One of options.template, options.templateUrl or components\'s class static function "template()" should be defined');
  } else if (template) {

    if (!isString(template) && !isFunction(template)) {
      errors.push('template should be string or function');
    }

  } else if (templateUrl) {

    if (!isString(templateUrl)) {
      errors.push('templateUrl should be string');
    }
  }

  // ----- VALIDATE RESOLVERS -----
  if (options.resolve && !(isObject(options.resolve) && !isArray(options.resolve))) {
    errors.push('resolver functions should be defined as object');
  }

  // ----- VALIDATE URL -----
  if (options.url && !isString(options.url) && !isArray(options.url)) {
    errors.push('url should be defined as string or array');
  }

  return errors;
};

export default class ValentController {
  constructor(name, Controller, options) {
    let errors = validate(name, Controller, options);
    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.name = name;
    this.options = options;
    this.Controller = Controller;
  }

  hasTemplate() {
    return !!this.options.template;
  }

  hasTemplateUrl() {
    return !!this.options.templateUrl;
  }

  hesTemplateMethod() {
    return isFunction(this.Controller.render);
  }

  getUrl() {
    return this.options.url;
  }

  getResolvers() {
    return this.options.resolve;
  }
}
