export default class FactoryException {
  constructor(name) {
    this.name = name;
  }

  getMessage(message) {
    return `factory "${this.name}": ${message}`;
  }

  wrongFactorySource() {
    var message = this.getMessage('Factory source should be executable (class or function)');
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
}
