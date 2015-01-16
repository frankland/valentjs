import EnchantDi from './enchant/di';
import InjectorApi from '../components/injector-api';

class FactoryConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Factory mapper. ' + message;
  }
}

function Convert(factory) {
  var FactoryConstructor = factory.config.src;

  if (angular.isFunction(FactoryConstructor)) {
    throw new FactoryConverterError('Wrong factory source definition. Expect function (constructor)');
  }

  var DiConstructor = function($injector, ...dependencies) {
    var injectorApi = new InjectorApi($injector);

    return new FactoryConstructor(...[$injectorApi].concat(dependencies));
  };

  return EnchantDi(factory, DiConstructor);
}

export default function(factory) {
  var moduleName = factory.module;

  if (!moduleName) {
    throw new FactoryConverterError('application name is not described for factory: "' + factory.name + '"');
  }

  var di = Convert(factory);

  angular.module(moduleName)
      .factory(factory.name, di);
};
