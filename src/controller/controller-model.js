import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';

import ControllerException from './controller-exception';
import RouteException from '../route/route-exception';
import RouteModel from '../route/route-model';


function setDefaults(config) {
  config.dependencies = [];
}

var config = Symbol('config');

export default class ControllerModel {
  /**
   * @param name - controller name
   */
  constructor(name) {
    if (!name) {
      throw ControllerException.noControllerName();
    }

    this[config] = {};
    this[config].controller = name;

    setDefaults(this[config]);
  }

  getName() {
    return this[config].controller;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    if (!isArray(dependencies)) {
      throw new ControllerException.dependenciesAreNotArray();
    }

    for (var dependency of dependencies) {
      this.addDependency(dependency);
    }
  }

  addDependency(dependency) {
    if (!isString(dependency)) {
      throw new ControllerException.dependencyIsNotString();
    }

    this[config].dependencies.push(dependency);
  }

  getDependencies() {
    return this[config].dependencies;
  }

  /**
   * Set angular module name
   * @param name
   */
  setApplicationName(name) {
    var currentName = this.getApplicationName();

    if (this.hasRoute()) {
      var route = this.getRoute();
      var routeApplication = route.getApplicationName();
      if (currentName == routeApplication) {
        route.setApplicationName(name);
      }
    }

    this[config].application = name;
  }

  hasApplication() {
    return this[config].application;
  }

  getApplicationName() {
    return this[config].application;
  }

  /**
   * Set controller class
   * @param src
   */
  setSource(src) {
    if (!isFunction(src)) {
      throw ControllerException.wrongControllerSource();
    }

    this[config].src = src;
  }

  getSource() {
    return this[config].src;
  }

  /**
   *
   * @param url
   */
  addUrl(url) {
    if (!this.hasRoute()) {
      var name = this.getName();

      /**
       * Not very good solution to create Route instance here
       * and add it to manager.
       */
      var routeModel = new RouteModel(name);
      this.setRoute(routeModel);
    }

    this[config].route.addUrl(url);
  }

  setRoute(route) {
    if (!(route instanceof RouteModel)) {
      throw ControllerException.wrongRouteInstance();
    }

    if (this.hasRoute()) {
      var existingRoute = this.getRoute();
      Manager.removeRoute(existingRoute);
    }

    if (!route.hasApplication()) {
      var application = this.getApplicationName();
      route.setApplicationName(application);
    }

    this[config].route = route;
  }

  getRoute() {
    return this[config].route;
  }

  hasRoute() {
    return this[config].hasOwnProperty('route');
  }

  /**
   * Resolve method
   * arguments
   * 1. name, resolve
   * 2. object
   */
  addResolve() {
    if (!this.hasRoute()) {
      throw new ControllerException.routeIsNotDefined('resolve');
    }

    var route = this.getRoute();
    route.addResolve.apply(route, arguments);

    var dependencies = [];
    if (arguments.length == 1) {
      dependencies = Object.keys(arguments[0]);
    } else if (arguments.length == 2) {
      dependencies = [arguments[0]];
    } else {
      throw RouteException.wrongResolveArguments();
    }

    this.addDependencies(dependencies);
  }

  /**
   * Template methods
   */
  setTemplate(template) {
    if (!this.hasRoute()) {
      throw new ControllerException.routeIsNotDefined('template');
    }

    var route = this.getRoute();

    route.setTemplate(template);
  }

  setTemplateUrl(templateUrl) {
    if (!this.hasRoute()) {
      throw new ControllerException.routeIsNotDefined('templateUrl');
    }

    var route = this.getRoute();

    route.setTemplateUrl(templateUrl);
  }

  urlBuilder(urlBuilder) {
    if (!this.hasRoute()) {
      throw new ControllerException.routeIsNotDefined('urlBuilder');
    }

    var route = this.getRoute();

    route.setUrlBuilder(urlBuilder);
  }
}
