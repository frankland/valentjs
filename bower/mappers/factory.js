class FactoryMapperError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Factory mapper. ' + message;
  }
}


var register = function(factory) {
  var module_name = factory.module;

  if (!module_name) {
    throw new FactoryMapperError('application name is not described for factory: "' + factory.name + '"');
  }

  var FactoryConstructor = factory.config.src;

  if (typeof FactoryConstructor != 'function') {
    throw new FactoryMapperError('Wrong factory source definition. Expect function (constructor)');
  }

  var FactorySource = function($injector, ...dependencies) {

    var Instance = new FactoryConstructor(...dependencies);
    if (typeof Instance.setInjector == 'function') {
      Instance.setInjector($injector);
    }

    return Instance;
  };

  var di = ['$injector'].concat(factory.config.dependencies);
  di.push(FactorySource);

  angular.module(module_name)
      .factory(factory.name, di);
};

var FactoryMapper = function(components) {
  for (var component of components) {
    register(component);
  }
};

export default FactoryMapper;
