import ValentRoute from '../valent-route';
import * as validation from './angular-validation/structures';

export default class AngularRoute extends ValentRoute {
  constructor(name, url, options) {
    super(name, url, options);
  }

  static validate(name, url, options) {
    let errors = super.validate(name, url, options);

    let isValidModule = validation.isValidModule(options.module);

    if (!isValidModule) {
      errors.push('Module name should be a string');
    }

    return errors;
  }

  getModule() {
    return this.options.module || null;
  }
}
