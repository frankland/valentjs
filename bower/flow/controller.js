import Component from './component';

class ControllerFlowError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Controller flow. ' + message;
  }
}


class Controller extends Component {

  /**
   * Controller without name will be considered as directive controller
   * @param name
   */
  constructor(name) {
    super(name);
    if (!name) {
      this.isDirective = true;
    }
  }

  /**
   * Route flow
   */
  router(routeInstance) {
    this.routeInstance = routeInstance;

    return this;
  }

  resolve() {
    if (!this.routeInstance || this.isDirective) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    var resolve = arguments[0];
    if (arguments.length == 2) {
      resolve = {};
      resolve[arguments[0]] = arguments[1];
    }

    for (var key of Object.keys(resolve)) {
      this.routeInstance.resolve(key, resolve[key]);
      this.dependencies(key);
    }

    return this;
  }


  route(url, template) {
    if (!this.routeInstance || this.isDirective) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    this.routeInstance
        .url(url);

    if (template) {
      this.routeInstance.templateUrl(template);
    }

    return this;
  }

  generate(generate) {
    if (!this.routeInstance || this.isDirective) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    this.routeInstance
        .generate(generate);

    return this;
  }

  /**
   * Controller flow
   */
  src(src) {
    this.config.src = src;
    return this;
  }

  path() {
    if (!this.routeInstance || this.isDirective) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    this.routeInstance.path.apply(this.routeInstance, arguments);

    return this;
  }
}

export default Controller;
