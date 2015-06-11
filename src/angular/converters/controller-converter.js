import isFunction from 'lodash/lang/isFunction';
import clone from 'lodash/lang/cloneDeep';

import Config from '../../components/config';
import Logger from '../../components/logger';
import Scope from '../../components/scope';

import ControllerModel from '../../controller/controller-model';
import ObjectDifference from '../../utils/object-difference';

import RouteConverter from './route-converter';

export default class ControllerConverter {
  static register(controllers, defaultApplication) {
    for (let controller of controllers) {

      if (!(controller instanceof ControllerModel)) {
        throw new Error('Wrong controller model instance');
      }

      var wrapped = ControllerConverter.wrap(controller);
      var dependencies = ControllerConverter.getDependencies(controller);
      dependencies.push(wrapped);

      var name = controller.getName();
      var application = controller.getApplicationName() || defaultApplication;


      angular.module(application)
        .controller(name, dependencies);

      if (controller.hasRoute()) {
        var route = controller.getRoute();
        RouteConverter.register([route]);
      }
    }
  }

  static getDependencies(model) {
    var dependencies = model.getDependencies();
    return ['$scope'].concat(dependencies);
  }

  static wrap(model) {
    return function($scope, ...dependencies) {
      var Controller = model.getSource();

      var logger = Logger.create(model.getName());
      dependencies.push(logger);

      var controller = new Controller(...dependencies);

      Scope.attach(controller, $scope);

      $scope.controller = controller;
      $scope.$on('$destroy', () => {
        if (isFunction(controller.destructor)) {
          controller.destructor();
        }
      });

      if (Config.isDebug() || controller.debug) {
        var previous = clone(controller);
        var objectDifference = new ObjectDifference(logger);
        $scope.$watch(() => {
          var current = clone(controller);
          objectDifference.print(previous, current);
          previous = current;
        });
      }
    };
  }
}
