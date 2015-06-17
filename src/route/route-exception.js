export default class RouteException {
  constructor(name) {
    this.name = name;
  }

  getMessage(message) {
    return `route "${this.name}": ${message}`;
  }

  noUrlBuilder() {
    var message = this.getMessage(`Url builder is not available. Url build could be set using @urlBuilder method
    or could be auto generated if there is at least one url is attached to route`);

    return new Error(message);
  }

  wrongTemplate() {
    var message = this.getMessage('@template should be a String or Function');
    return new Error(message);
  }

  wrongTemplateUrl() {
    var message = this.getMessage('@templateUrl should be a String');
    return new Error(message);
  }

  wrongUrlParams() {
    var message = this.getMessage('Params for default url builder should be an object');
    return new Error(message);
  }

  templateUrlAlreadyExists() {
    var message = this.getMessage('There are could be only one attribute @template or @templateUrl. @template already exists');
    return new Error(message);
  }

  templateAlreadyExists() {
    var message = this.getMessage('There are could be only one attribute @template or @templateUrl. @templateUrl already exists');
    return new Error(message);
  }

  noTemplateOrTemplateUrl() {
    var message = this.getMessage('There are no template or templateUrl');
    return new Error(message);
  }

  wrongResolveArguments() {
    var message = this.getMessage(`Wrong resolve arguments. Should be a two (key, value) arguments or one object. Resolver - only function`);
    return new Error(message);
  }

  wrongOptionsArguments() {
    var message = this.getMessage('Wrong options arguments. Should be a two (key, value) arguments or one object');
    return new Error(message);
  }

  routeChangeErrorIsNotFunction() {
    var message = this.getMessage('Callback for route change error should be a function');
    return new Error(message);
  }
}
