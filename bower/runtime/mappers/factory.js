var register = function(factory){
  var module_name =  factory.module;

  if (!module_name) {
    throw new Error('System.Factory mapper: Application name is not described for factory: "' + factory.name+ '"');
  }

  var src;

  if (factory.config.src instanceof Function) {
    src = factory.config.src;
  } else {
    src = function () {
      return factory.config.src;
    }
  }

  var di = factory.config.dependencies;
  di.push(src);

  angular.module(module_name)
    .factory(factory.name, di);
};

var FactoryMapper = function(components){
  for (var component of components){
    register(component);
  }
};

export default  FactoryMapper;
