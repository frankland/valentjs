import RegisterException from '../exceptions/register';
import ValentController from '../valent-controller';

let validate = (controller) => {
  return [];
};

export default class AngularController extends ValentController {
  constructor(name, Controller, options) {
    super(name, Controller, options);

    let errors = validate(this);

    if (errors.length) {
      throw new RegisterException(name, 'angular-component', errors);
    }
  }

  getModule() {
    return this.options.module || null;
  }

  getNamespace() {
    return this.options.as || 'controller';
  }
}
