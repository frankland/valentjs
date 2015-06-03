export default class ControllerException {
  constructor(name) {
    this.name = name;
  }

  getMessage(message) {
    return `controller "${this.name}": ${message}`;
  }

  routeIsNotDefined(method) {
    var message = this.getMessage(`Route is not defined or is not allowed.
     Before using @${method} method - add route url with @addUrl model method or @url flow method`);

    return new Error(message);
  }

  wrongControllerSource() {
    var message = this.getMessage('Controller source should be executable (class or function)');
    return new Error(message);
  }

  dependenciesAreNotArray() {
    var message = this.getMessage('Dependencies should be an array');
    return new Error(message);
  }

  dependencyIsNotString() {
    var message = this.getMessage('Dependency should be a string');
    return new Error(message);
  }

  wrongRouteInstance() {
    var message = this.getMessage('Wrong route instance');
    return new Error(message);
  }

  wrongResolveArguments() {
    var message = this.getMessage('Wrong resolve arguments. Should be a two (key, value) arguments or one object');
    return new Error(message);
  }
}
