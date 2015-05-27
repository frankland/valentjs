export default class FactoryException {
  static noFactoryName() {
    var message = `Factory name should be described`;

    return new Error(message);
  }

  static wrongFactoryModelInstance() {
    var message = `Wrong factory model instance`;

    return new Error(message);
  }

  static wrongFactorySource() {
    var message = `Factory source should be executable (class or function)`;

    return new Error(noFactoryName);
  }
}
