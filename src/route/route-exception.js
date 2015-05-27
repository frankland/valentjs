export default class RouteException {
  static noUrlBuilder() {
    var message = 'Url builder is not available. Url build could be set using @urlBuilder method'
      + 'or could be auto generated if there is at least one url is attached to route';
    return new Error(message);
  }

  static wrongUrlParams() {
    var message = 'Params for default url builder should be an object';
    return new Error(message);
  }

  static noControllerName() {
    var message = 'Controller name should be passed to Route constructor';
    return new Error(message);
  }

  static templateUrlAlreadyExists() {
    var message = 'There are could be only one attribute @template or @templateUrl. @template already exists';
    return new Error(message);
  }

  static templateAlreadyExists() {
    var message = 'There are could be only one attribute @template or @templateUrl. @templateUrl already exists';
    return new Error(message);
  }

  static wrongRouteModelInstance() {
    var message = 'Wrong route model instance';
    return new Error(message);
  }

  static noTemplateOrTemplateUrl() {
    var message = 'There are no template or templateUrl';
    return new Error(message);
  }

  static wrongOtherwise() {
    var message = 'Wrong otherwise config. Should be an object or a string. String will be converted to redirectTo url';
    return new Error(message);
  }

  static wrongResolveArguments() {
    var message = 'Wrong resolve arguments. Should be a two (key, value) arguments or one object';
    return new Error(message);
  }

  static routeChangeErrorIsNotFunction() {
    var message = 'Callback for route change error should be a function';
    return new Error(message);
  }
}
