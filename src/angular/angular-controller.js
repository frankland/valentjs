import ValentController from '../valent-controller';

import * as validation from './angular-validation/structures';


export default class AngularController extends ValentController {
  constructor(name, ControllerClass, options) {
    super(name, ControllerClass, options);
  }

  static validate(name, ControllerClass, options) {
    let errors = super.validate(name, ControllerClass, options);

    let isValidNamespace = validation.isValidNamespace(options.as);

    if (!isValidNamespace) {
      errors.push('Namespace should be a string');
    }

    return errors;
  }

  getModule() {
    return this.options.module || null;
  }

  getNamespace() {
    return this.options.as || 'controller';
  }
}
