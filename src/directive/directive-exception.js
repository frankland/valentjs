export default class DirectiveException {
  static noDirectiveName() {
    var message = 'Directive name should be described';
    return new Error(message);
  }

  static templateUrlAlreadyExists() {
    var message = 'There are could be only one attribute @template or @templateUrl. @template already exists';
    return new Error(message);
  }

  static templateAlreadyExists() {
    var message = 'There are could be only one attribute @template or @templateUrl. @templateUrl already exists';
    return new Error(message);
  }

  static wrongScopeFormat() {
    var message = 'Scope config should an object';
    return new Error(message);
  }

  static wrongDirectiveModelInstance() {
    var message = 'Wrong directive model instance';
    return new Error(message);
  }

  static wrongPipesFormat() {
    var message = 'Pipes config should an object';
    return new Error(message);
  }

  static wrongAssignedPipesFormat() {
    var message = 'Pipes config that passed as directive attribute should be an object';
    return new Error(message);
  }

  static wrongDirectivePipeInstance() {
    var message = 'Wrong directive pipe instance lol';
    return new Error(message);
  }

  static pipesAssignedButNotRegistered() {
    var message = 'Pipes assigned to directive but not registered';
    return new Error(message);
  }

  static dependenciesAreNotArray() {
    var message = 'Dependencies should be an array';
    return new Error(message);
  }

  static dependencyIsNotString() {
    var message = 'Dependency should be a string';
    return new Error(message);
  }

  static noTemplateOrTemplateUrl() {
    var message = 'There are no template or templateUrl';
    return new Error(message);
  }

  static wrongRestrictOption() {
    var message = 'Wrong restrict options. Could be only "A", "E", "C" and their combinations';
    return new Error(message);
  }

  static requireConfiguredButNotAssigned() {
    var message = 'Require option for directive is configured but controller does not has function to assign';
    return new Error(message);
  }
}


