import Config from '../../components/config';

import FactoryModel from '../../factory/factory-model';
import FactoryException from '../../factory/factory-exception';

function Convert(FactoryModel) {
  var FactoryConstructor = FactoryModel.src;

  if (!angular.isFunction(FactoryConstructor)) {
    throw new Error('Wrong factory source definition. Expect function (constructor)');
  }

  var FactoryFunction = function(...dependencies) {
    return new FactoryConstructor(dependencies);
  };

  var deps = FactoryModel.dependencies;
  return [...deps, FactoryFunction];
}

export default function(factory) {
  var FactoryModel = factory.model;

  var moduleName = FactoryModel.module;

  if (!moduleName) {
    throw new Error(`Application name is not described for factory: "${FactoryModel.name}"`);
  }

  var di = Convert(FactoryModel);

  angular.module(moduleName)
    .factory(FactoryModel.name, di);
};


export default class FactoryConverter {
  static register(factories) {
    for (var factory of factories) {
      if (!(factory instanceof FactoryModel)) {
        throw FactoryException.wrongFactoryModelInstance();
      }

      var wrapped = FactoryConverter.wrap(factory);
      var dependencies = FactoryConverter.getDependencies(factory);

      var name = factory.getName();
      var application = factory.getApplicationName();

      /**
       * Use default application name if not set at controller model
       */
      if (!application) {
        application = Config.getApplicationName();
      }

      angular.module(application)
        .factory(name, dependencies.push(wrapped));
    }
  }

  static getDependencies(model) {
    return model.getDependencies();
  }

  static wrap(model) {
    return function($scope, ...dependencies) {
      var Factory = model.getSource();

      return new Factory(...dependencies);
    };
  }
}
