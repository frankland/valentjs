import isFunction from 'lodash/lang/isFunction';

import Config from '../../components/config';

import FactoryModel from '../../factory/factory-model';
import FactoryException from '../../factory/factory-exception';


export default class FactoryConverter {
  static register(factories) {
    for (var factory of factories) {
      if (!(factory instanceof FactoryModel)) {
        throw new Error('Wrong factory model instance');
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
