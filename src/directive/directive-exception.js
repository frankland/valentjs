export default class DirectiveException {
  constructor(name) {
    this.name = name;
  }

  getMessage(message) {
    return `route "${this.name}": ${message}`;
  }

  templateUrlAlreadyExists() {
    var message = this.getMessage('There are could be only one attribute @template or @templateUrl. @template already exists');
    return new Error(message);
  }

  templateAlreadyExists() {
    var message = this.getMessage('There are could be only one attribute @template or @templateUrl. @templateUrl already exists');
    return new Error(message);
  }

  wrongScopeFormat() {
    var message = this.getMessage('Scope config should an object');
    return new Error(message);
  }

  wrongPipesFormat() {
    var message = this.getMessage('Pipes config should an object');
    return new Error(message);
  }

  wrongAssignedPipesFormat() {
    var message = this.getMessage('Pipes config that passed as directive attribute should be an object');
    return new Error(message);
  }

  wrongDirectivePipeInstance() {
    var message = this.getMessage('Wrong directive pipe instance :)');
    return new Error(message);
  }

  pipesAssignedButNotRegistered() {
    var message = this.getMessage('Pipes assigned to directive but not registered');
    return new Error(message);
  }

  dependenciesAreNotArray() {
    var message = this.getMessage('Dependencies should be an array');
    return new Error(message);
  }

  dependencyIsNotString() {
    var message = this.getMessage('Dependency should be a string');
    return new Error(message);
  }

  noTemplateOrTemplateUrl() {
    var message = this.getMessage('There are no template or templateUrl');
    return new Error(message);
  }

  wrongRestrictOption() {
    var message = this.getMessage('Wrong restrict options. Could be only "A", "E", "C" and their combinations');
    return new Error(message);
  }

  requireConfiguredButNotAssigned() {
    var message = this.getMessage('Require option for directive is configured but controller does not has function to assign');
    return new Error(message);
  }
}


