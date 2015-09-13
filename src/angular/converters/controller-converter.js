import isFunction from 'lodash/lang/isFunction';
import clone from 'lodash/lang/cloneDeep';

import Logger from '../../components/logger';
import Scope from '../components/scope';
import AngularUrl from '../components/url'

import ControllerModel from '../../controller/controller-model';
import ObjectDifference from '../../utils/object-difference';

import RouteConverter from './route-converter';

export default class ControllerConverter {
  static register(controllers, defaultApplication) {
    for (let controller of controllers) {

      if (!(controller instanceof ControllerModel)) {
        throw new Error('Wrong controller model instance');
      }

      var resolversKeys = [];
      if (controller.hasRoute()) {
        var route = controller.getRoute();
        RouteConverter.register([route], defaultApplication);

        var resolvers = route.getResolvers();
        resolversKeys = Object.keys(resolvers);
      }

      var dependencies = ControllerConverter.getDependencies(controller);
      dependencies = dependencies.concat(resolversKeys);

      var wrapped = ControllerConverter.wrap(controller);
      dependencies.push(wrapped);

      var name = controller.getName();
      var application = controller.getApplicationName() || defaultApplication;


      angular.module(application)
        .controller(name, dependencies);
    }
  }

  static getDependencies(model) {
    var dependencies = model.getDependencies();
    return ['$scope'].concat(dependencies);
  }

  static wrap(model) {
    return function($scope, ...dependencies) {
      var name = model.getName();
      var Controller = model.getSource();

      var logger = Logger.create(model.getName());
      dependencies.push(logger);

      var controller = new Controller(...dependencies);

      /**
       * Attach $scope to controller's context
       */
      Scope.attach(controller, $scope);

      /**
       * Attach controller's context to Angular url
       */
      if (AngularUrl.has(name)) {
        AngularUrl.attach(name, controller);
      }

      /**
       * add Valent controller's model to $scope
       */
      $scope.$valentModel = model;

      var namespace = model.getControllerNamespace();
      $scope[namespace] = controller;

      /**
       * Setup $destroy event and run controller.destructor() if exist
       */
      $scope.$on('$destroy', () => {
        if (isFunction(controller.destructor)) {
          controller.destructor();
        }
      });

      if (controller.debug) {
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
