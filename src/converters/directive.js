import { ControllerConvert } from './controller.js';

class DirectiveConverterError extends Error {
  constructor(message) {
    this.message = 'ngx runtime: Directive mapper. ' + message;
  }
}

function Convert(directive){

  var di = ControllerConvert(directive.config.controller);

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
    DirectiveConfig.templateUrl = directive.config.templateUrl;
  } else {
    throw new DirectiveConverterError('@template or @templateUrl should be described');
  }

  return function() {
    return DirectiveConfig;
  };
}

export default function(directive) {
  var moduleName = directive.module;

  if (!moduleName) {
    throw new DirectiveConverterError('application name is not described for directive: "' + directive.name + '"');
  }

  var DirectiveConstructor = Convert(directive);

  angular.module(moduleName)
      .directive(directive.name, DirectiveConstructor);
};
