import FactoryModel from './factory-model';

export default class FactoryFlow {
  constructor(name) {
    this.model = new FactoryModel(name);
  }

  /**
   * Set factory module name
   * @param name
   * @returns {FactoryFlow}
   */
  at(name) {
    this.model.setApplicationName(name);

    if (this.model.hasRoute()) {
      this.model.route.at(name);
    }

    return this;
  }

  /**
   * Set angular dependencies that will be passed to factory constructor as arguments
   * @param dependencies
   * @returns {FactoryFlow}
   */
  dependencies(dependencies) {
    if (!isArray(dependencies)) {
      dependencies = [dependencies];
    }

    this.model.addDependencies(dependencies);

    return this;
  }

  /**
   * Set factory class
   * @param src
   * @returns {FactoryFlow}
   */
  src(src) {
    this.model.setSource(src);

    return this;
  }
}

