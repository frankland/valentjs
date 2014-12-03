import { ControllerTranslate } from './controller';
import { resolveUrl } from '../url-manager';
import { isAbsolute } from '../url-manager';


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

    var resolved = directive.config.templateUrl;

    if (!isAbsolute(resolved)) {
      var deployDir = directive.buildScript.replace(/\/[^\/]+$/, '');

      resolved = resolveUrl(directive.buildScript, directive.modulePath);
      resolved = resolved.replace(directive.baseDir, deployDir).replace('src', '');

      resolved = resolveUrl(resolved.replace(/[^\/]+$/, ''), directive.config.templateUrl);
    }

    config.templateUrl = resolved;
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
