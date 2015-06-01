import ControllerModel from './controller-model';
import isArray from 'lodash/lang/isArray';

export default class ControllerFlow {
  constructor(name) {
    this.model = new ControllerModel(name);
  }

  /**
   * Set controller module name
   * @param name
   * @returns {ControllerFlow}
   */
  at(name) {
    this.model.setApplicationName(name);
    return this;
  }

  /**
   * Set angular dependencies that will be passed to controller constructor as arguments
   * @param dependencies
   * @returns {ControllerFlow}
   */
  dependencies(dependencies) {
    this.model.addDependencies(dependencies);
    return this;
  }

  /**
   * Add Route for this controller
   * @param url
   * @returns {ControllerFlow}
   */
  url(url) {
    this.model.addUrl(url);
    return this;
  }

  /**
   * Add resolve config to route
   * @returns {ControllerFlow}
   */
  resolve(key, resolve) {
    this.model.addResolve(key, resolve);
    return this;
  }

  /**
   * Set template
   * @param template
   * @returns {ControllerFlow}
   */
  template(template) {
    this.model.setTemplate(template);
    return this;
  }


  /**
   * Set templateUrl
   * @param templateUrl
   * @returns {ControllerFlow}
   */
  templateUrl(templateUrl) {
    this.model.setTemplateUrl(templateUrl);
    return this;
  }

  /**
   * Add url generator callback
   * @param generator
   * @returns {ControllerFlow}
   */
  urlBuilder(generator) {
    this.model.urlBuilder(generator);
    return this;
  }

  /**
   * Set controller class
   * @param src
   * @returns {ControllerFlow}
   */
  src(src) {
    this.model.setSource(src);
    return this;
  }
}

