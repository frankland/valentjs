class BaseControllerError extends Error {
  constructor(message) {
    this.message = 'ngx component: Base Controller. ' + message;
  }
}


class BaseController {

  setInjector(injector) {
    this.injector = injector;
  }

  get(dependency) {
    if (!this.injector) {
      throw new BaseControllerError('Injector is not defined');
    }

    if (!this.injector.has(dependency)) {
      throw new BaseControllerError('Dependency "' + dependency + '" does not exist');
    }

    return this.injector.get(dependency);
  }


  api(key) {
    throw new BaseControllerError('Not implemented yet');
  }
}


export default BaseController;
