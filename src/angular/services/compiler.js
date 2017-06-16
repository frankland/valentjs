import Injector from './injector';
import Scope from './scope';

//let _scope = Symbol('$scope');

let compileTemplate = function($scope, template, params) {
  let $compile = Injector.get('$compile');
  let compileTemplate = $compile(template);

  let compilingScope = $scope.$new();
  Object.assign(compilingScope, params);

  return compileTemplate(compilingScope);
};

let Compiler = function($scope) {
  let compile = function(template, params = {}) {
    return compileTemplate($scope, template, params);
  };

  compile.parent = function(template, params = {}) {
    return compileTemplate($scope.$parent, template, params);
  };

  return compile;
};

Compiler.create = function(context) {
  return Scope.get(context).then($scope => {
    return Compiler($scope);
  });
};

export default Compiler;
