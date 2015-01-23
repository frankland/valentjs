import ConvertDi from './utils/convert-to-di';
import Injector from '../components/injector';

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
    var injector = new Injector($injector);

    return new FactoryConstructor(...[injector].concat(dependencies));
  };

  return ConvertDi(factory, DiConstructor);
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
