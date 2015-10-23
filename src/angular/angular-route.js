import RegisterException from '../exceptions/register';
import ValentRoute from '../valent-route';

let validate = (route) => {
  return [];
};

export default class AngularRoute extends ValentRoute {
  constructor(name, Route, options) {
    super(name, Route, options);

    let errors = validate(this);

    if (errors.length) {
      throw new RegisterException(name, 'angular-route', errors);
    }
  }

  getModule() {
    return this.options.module || null;
  }

  getNamespace() {
    return this.options.as || 'controller';
  }
}
