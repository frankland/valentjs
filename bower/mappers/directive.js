import { ControllerTranslate } from './controller';
import { resolveTemplateUrl } from '../url-manager';


var register = function (directive) {
  var module_name = directive.module;

  if (!module_name) {
    throw new Error('System.Directive mapper: application name is not described for directive: "' + directive.name + '"');
  }

  var di = ControllerTranslate(directive.config.controller);

  var config = {
    restrict: directive.config.restrict,
    replace: directive.config.replace,
    link: directive.config.link,
    scope: directive.config.scope,
    controller: di
  };

  if (config.template && config.templateUrl) {
    throw new Error('For route "' + url + '" @template and @templateUrl is described');
  }

  if (directive.config.template) {
    config.template = directive.config.template;
  } else if (directive.config.templateUrl) {
    config.templateUrl = resolveTemplateUrl(directive);
  } else {
    throw new Error('System.Directive mapper: @template or @templateUrl should be described');
  }

  var src = function () {
    return config;
  };

  angular.module(module_name)
    .directive(directive.name, src);
};

var DirectiveMapper = function (components) {
  for (var component of components) {
    register(component);
  }
};

export default  DirectiveMapper;
