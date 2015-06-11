import isFunction from 'lodash/lang/isFunction';

import FactoryModel from '../../factory/factory-model';
import FactoryException from '../../factory/factory-exception';


export default class FactoryConverter {
  static register(factories, defaultApplication) {
    for (var factory of factories) {
      if (!(factory instanceof FactoryModel)) {
        throw new Error('Wrong factory model instance');
      }

      var wrapped = FactoryConverter.wrap(factory);
      var dependencies = FactoryConverter.getDependencies(factory);

      var name = factory.getName();
      var application = factory.getApplicationName() || defaultApplication;

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
