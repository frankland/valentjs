import isFunction from 'lodash/lang/isFunction';

import * as validation from './validation/structures';

let normalize = (ControllerClass, options) => {
  let renderMethod = ControllerClass.render;
  let normalized = Object.assign({}, options);

  if (isFunction(renderMethod)) {
    normalized.template = renderMethod;
  }

  return normalized;
};

export default class ValentController {
  constructor(name, ControllerClass, options) {
    this.name = name;
    this.options = normalize(ControllerClass, options);
    this.ControllerClass = ControllerClass;

    let url = this.options.url;

    if (url) {
      valent.route(this.name, url, this.options);
    }
  }

  static validate(name, ControllerClass) {
    let isValidName = validation.isValidName(name);
    let isValidController = validation.isValidConstructor(ControllerClass);

    let errors = [];

    if (!isValidName) {
      errors.push('Controller\'s name could not be empty or with spaces');
    }

    if (!isValidController) {
      errors.push('Controller\'s class should be a constructor');
    }

    return errors;
  }

  getName() {
    return this.name;
  }

  getController() {
    return this.ControllerClass;
  }
}
