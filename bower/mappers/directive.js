import { ControllerTranslate } from './controller';
import { ResolveTemplateUrl } from '../url-utils';

class DirectiveMapperError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Directive mapper. ' + message;
  }
}


var register = function(directive) {
  var module_name = directive.module;

  if (!module_name) {
    throw new DirectiveMapperError('application name is not described for directive: "' + directive.name + '"');
  }

  var di = ControllerTranslate(directive.config.controller);

  var DirectiveConfig = {
    restrict: directive.config.restrict,
    replace: directive.config.replace,
    link: directive.config.link,
    scope: directive.config.scope,
    controller: di
  };

  if (directive.config.template) {
    DirectiveConfig.template = directive.config.template;
  } else if (directive.config.templateUrl) {
    DirectiveConfig.templateUrl = ResolveTemplateUrl(directive);
  } else {
    throw new DirectiveMapperError('@template or @templateUrl should be described');
  }

  var DirectiveConstructor = function() {
    return DirectiveConfig;
  };

  angular.module(module_name)
      .directive(directive.name, DirectiveConstructor);
};

var DirectiveMapper = function(components) {
  for (var component of components) {
    register(component);
  }
};

export default DirectiveMapper;
