import Component from '../flow-component';

class ControllerFlowError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Controller flow. ' + message;
  }
}


class Controller extends Component {

  /**
   * Route flow
   */
  router(routeInstance) {
    this.routeInstance = routeInstance;

    return this;
  }

  resolve() {
    if (!this.routeInstance) {
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
    if (!this.routeInstance) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    this.routeInstance
        .url(url);

    if (template) {
      this.routeInstance.templateUrl(template);
    }

    return this;
  }

  template (template){

    if (!this.routeInstance) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    if (template) {
      this.routeInstance.template(template);
    }

    return this;
  }

  buildUrl(builder) {
    if (!this.routeInstance) {
      throw new ControllerFlowError('Router is not defined or is not allowed');
    }

    this.routeInstance
        .buildUrl(builder);

    return this;
  }

  /**
   * Controller flow
   */
  src(src) {
    this.config.src = src;
    return this;
  }

  logInfo() {
    var group = `${this.name} at ${this.module}`;

    console.groupCollapsed(group);

    if (!!Object.keys(this.config.defaults).length) {
      console.log(`defaults:`, this.config.defaults);
    }

    console.groupEnd(group);
  }
}

export default Controller;
