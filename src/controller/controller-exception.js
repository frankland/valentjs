export default class ControllerException {
  static routeIsNotDefined(method) {
    var message = `Route is not defined or is not allowed. Before using @${method} method - add route url with @addUrl model method
      or @url flow method`;
    return new Error(message);
  }

  static noControllerName() {
    var message = 'Controller name should be described';
    return new Error(message);
  }

  static wrongControllerModelInstance() {
    var message = 'Wrong controller model instance';
    return new Error(message);
  }

  static wrongControllerSource() {
    var message = 'Controller source should be executable (class or function)';
    return new Error(message);
  }

  static dependenciesAreNotArray() {
    var message = 'Dependencies should be an array';
    return new Error(message);
  }

  static dependencyIsNotString() {
    var message = 'Dependency should be a string';
    return new Error(message);
  }

  static wrongRouteInstance() {
    var message = 'Wrong route instance';
    return new Error(message);
  }
}
