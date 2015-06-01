import clone from 'lodash/lang/cloneDeep';
import assign  from 'lodash/object/assign';
import isFunction from 'lodash/lang/isFunction';
import isObject from 'lodash/lang/isPlainObject';
import isArray from 'lodash/lang/isArray';

import Logger from '../../components/logger';
import Scope from '../../components/scope';
import Watcher from '../../components/watcher';
import Config from '../../components/config';
import DirectiveParams from '../../components/directive-params';
import ObjectDifference from '../../utils/object-difference';
import DirectiveModel from '../../directive/directive-model';

export default class DirectiveConverter {
  static register(directives) {

    for (var directive of directives) {
      if (!(directive instanceof DirectiveModel)) {
        throw new Error('Wrong directive model instance');
      }

      var name = directive.getName();
      var application = directive.getApplicationName();

      /**
       * Use default application name if not set at controller model
       */
      if (!application) {
        application = Config.getApplicationName();
      }

      angular.module(application)
        .directive(name, DirectiveConverter.wrap(directive));
    }
  }

  static wrap(model) {
    return function() {
      return DirectiveConverter.getConfig(model);
    }
  }

  static getConfig(model) {
    var attributes = DirectiveConverter.getScope(model);
    var controller = DirectiveConverter.getController(model, attributes);
    var dependencies = DirectiveConverter.getDependencies(model);
    dependencies.push(controller);

    var restrict = DirectiveConverter.getRestrict(model);

    var config =  {
      transclude: model.getTransclude(),
      replace: model.getReplace(),
      scope: attributes,
      controller: dependencies,
      restrict: restrict,
      link: DirectiveConverter.getLink(model)
    };

    if (model.hasRequire()) {
      config.require = model.getRequire();
    }

    var template = model.getTemplate();
    var templateUrl = model.getTemplateUrl();

    if (template) {
      config.template = template;
    } else if (templateUrl) {
      config.templateUrl = templateUrl;
    } else if (restrict == 'E') {
      throw model.exception.noTemplateOrTemplateUrl();
    }

    return config;
  }

  static getScope(model) {
    var scope = model.getScope();

    if (isObject(scope)) {
      scope.debug = '=';

      if (model.hasPipes()) {
        scope.pipes = '&pipes';
      }
    }

    /**
     * TODO: wtf do with scope {}, null, true ?
     */
    return scope ? assign({}, scope) : {};
  }

  static getLink(model) {
    return function($scope, element, attrs, require) {
      var controller = $scope.controller;

      /**
       * If directive configured using Valent flow or models
       * require - always should be an array
       */
      if (require && isArray(require)) {
        var requireControllers = require.map((directive) => {
          var requireController = null;
          if (directive) {
            requireController = directive.controller ? directive.controller : directive
          }

          return requireController;
        });

        if (isFunction(controller.require)) {
          controller.require(...requireControllers);
        } else {
          throw model.exception.requireConfiguredButNotAssigned();
        }
      }

      if (isFunction(controller.link)) {
        controller.link(element, attrs);
      }
    }
  }

  static getRestrict(model) {
    var template = model.getTemplate();
    var templateUrl = model.getTemplateUrl();

    var restrict = model.getRestrict();

    if (!restrict) {
      if (template || templateUrl) {
        restrict = 'E';
      } else {
        restrict = 'A';
      }
    }

    if (restrict.indexOf('C') != -1) {
      console.warn('using "C" for directive restrict is not a good practice');
    }

    return restrict;
  }

  static getDependencies(model) {
    var dependencies = model.getDependencies();
    return ['$scope', '$attrs'].concat(dependencies);
  }

  static getController(model, definitions) {
    return function($scope, $attrs, ...dependencies) {
      var Controller = model.getController();

      var pipes = DirectiveConverter.getPipes($scope, $attrs, model);

      var availableAttrs = definitions ? Object.keys(definitions) : [];
      var restrict = DirectiveConverter.getRestrict(model);

      if (restrict == 'A') {
        availableAttrs.push(model.getName());
      }

      var directiveParams = new DirectiveParams($scope, availableAttrs);

      var args = [];
      args.push(directiveParams);

      if (Object.keys(pipes)) {
        args.push(pipes);
      }

      var logger = Logger.create(model.getControllerName());
      dependencies.push(logger);

      var controller = new Controller(...args.concat(dependencies));

      Scope.attach(controller, $scope);

      $scope.controller = controller;
      /**
       * Add controller to current context to be available using
       * @require directive option
       */
      this.controller = controller;

      $scope.$on('$destroy', () => {

      });

      if (Config.isDebug() || $scope.debug || controller.debug) {
        var previous = clone(controller);
        var objectDifference = new ObjectDifference(logger);
        $scope.$watch(() => {
          var current = clone(controller);
          objectDifference.print(previous, current);
          previous = current;
        });
      }
    }
  }

  static getPipes($scope, $attrs, model) {
    var pipes = null;

    if (model.hasPipes()) {
      var registered = model.getPipes();
      var assigned = {};

      if ($attrs.hasOwnProperty('pipes')) {
        assigned = $scope.pipes();

        if (!isObject(assigned)) {
          throw model.exception.wrongAssignedPipesFormat();
        }
      }

      pipes = {};
      for (var name of Object.keys(registered)) {
        var Pipe = registered[name];
        var pipe = null;

        if (assigned.hasOwnProperty(name)) {
          pipe = assigned[name];

          if (!(pipe instanceof Pipe)) {
            throw model.exception.wrongDirectivePipeInstance();
          }
        } else {
          pipe = new Pipe();
        }

        pipes[name] = pipe;
      }
    } else if (isFunction($scope.pipes)) {
      throw model.exception.pipesAssignedButNotRegistered();
    }

    return pipes;
  }
}
