import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';
import isString from 'lodash/lang/isString';


import RegisterException from './exceptions/register';

let validate = (route) => {
  let errors = [];

  // --- VALIDATE NAME -----
  let name = route.getName();
  if (!name || name.indexOf(' ') != -1) {
    errors.push('route\'s name could not be empty or contain spaces');
  }

  // ----- VALIDATE URL -----
  let url = route.getUrl();
  if (url && !isString(url) && !isArray(url)) {
    errors.push('url should be defined as string or array');
  }

  // ----- VALIDATE TEMPLATES -----
  let template = route.getTemplate();
  let templateUrl = route.getTemplateUrl();

  if (route.withoutTemplate()) {
    errors.push('options.template or options.templateUrl should be defined');
  } else if (template) {

    if (!isString(template) && !isFunction(template)) {
      errors.push('template should be string or function');
    }

  } else if (templateUrl) {

    if (!isString(templateUrl)) {
      errors.push('templateUrl should be string');
    }
  }

  // ----- VALIDATE STRUCT -----
  let struct = route.getStruct();
  if (!struct || !(isObject(struct) && !isArray(struct))) {
    errors.push('url struct should be array');
  }

  return errors;
};

export default class ValentController {
  constructor(name, url, options) {
    this.name = name;
    this.url = url;
    this.options = options;

    let errors = validate(this);
    if (errors.length) {
      throw new RegisterException(name, 'valent-route', errors);
    }
  }

  getName() {
    return this.name;
  }

  getController() {
    return this.Controller;
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

  withoutTemplate() {
    return !this.hasTemplate() && !this.hasTemplateUrl();
  }

  getUrl() {
    return this.options.url;
  }

  getResolvers() {
    return this.options.resolve;
  }

  getParams() {
    return this.options.params || {};
  }

  getStruct() {
    return this.options.struct || {};
  }
}
