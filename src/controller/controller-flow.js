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
  resolver(key, resolve) {
    this.model.addResolver(key, resolve);
    return this;
  }

  resolvers(resolvers) {
    this.model.setResolvers(resolvers);
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

  /**
   * Add route options
   * @param key
   * @param value
   */
  option(key, value) {
    this.model.addRouteOption(key, value);
    return this;
  }

  options(options) {
    this.model.setRouteOptions(options);
    return this;
  }

  as(name) {
    this.model.setControllerNamespace(name);
    return this;
  }
}

