import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';

import ControllerException from './controller-exception';
import RouteModel from '../route/route-model';


function setDefaults(config) {
  config.dependencies = [];
}

var local = {
  config: Symbol('config')
};


export default class ControllerModel {
  /**
   * @param name - controller name
   */
  constructor(name) {
    if (!name) {
      throw new Error('Controller name should be passed to Route constructor');
    }

    this[local.config] = {};
    this[local.config].controller = name;

    setDefaults(this[local.config]);

    this.exception = new ControllerException(name);
  }

  getName() {
    return this[local.config].controller;
  }

  /**
   * Add angular dependecies
   * @param dependencies
   */
  addDependencies(dependencies) {
    if (!isArray(dependencies)) {
      throw this.exception.dependenciesAreNotArray();
    }

    for (var dependency of dependencies) {
      this.addDependency(dependency);
    }
  }

  addDependency(dependency) {
    if (!isString(dependency)) {
      throw this.exception.dependencyIsNotString();
    }

    this[local.config].dependencies.push(dependency);
  }

  getDependencies() {
    return this[local.config].dependencies;
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

    this[local.config].application = name;
  }

  hasApplication() {
    return this[local.config].application;
  }

  getApplicationName() {
    return this[local.config].application;
  }

  /**
   * Set controller class
   * @param src
   */
  setSource(src) {
    if (!isFunction(src)) {
      throw this.exception.wrongControllerSource();
    }

    this[local.config].src = src;
  }

  getSource() {
    return this[local.config].src;
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

    this[local.config].route.addUrl(url);
  }

  addRouteOption(...arguments) {
    if (!this.hasRoute()) {
      throw this.exception.routeIsNotDefined('addRouteOption');
    }

    var route = this.getRoute();
    route.setOptions(...arguments);
  }

  setRouteOptions(...arguments) {
    if (!this.hasRoute()) {
      throw this.exception.routeIsNotDefined('setRouteOptions');
    }

    var route = this.getRoute();
    route.setOptions(...arguments);
  }

  setRoute(route) {
    if (!(route instanceof RouteModel)) {
      throw this.exception.wrongRouteInstance();
    }

    //if (this.hasRoute()) {
      //var existingRoute = this.getRoute();
      //Manager.removeRoute(existingRoute);
    //}

    if (!route.hasApplication()) {
      var application = this.getApplicationName();
      route.setApplicationName(application);
    }

    this[local.config].route = route;
  }

  getRoute() {
    return this[local.config].route;
  }

  hasRoute() {
    return this[local.config].hasOwnProperty('route');
  }

  addResolver(key, value) {
    var route = this.getRoute();
    route.addResolver(key, value);
  }

  setResolvers(resovlers) {
    var route = this.getRoute();
    route.setResolvers(resovlers);
  }

  /**
   * Template methods
   */
  setTemplate(template) {
    if (!this.hasRoute()) {
      throw this.exception.routeIsNotDefined('setTemplate');
    }

    var route = this.getRoute();
    route.setTemplate(template);
  }

  setTemplateUrl(templateUrl) {
    if (!this.hasRoute()) {
      throw this.exception.routeIsNotDefined('setTemplateUrl');
    }

    var route = this.getRoute();
    route.setTemplateUrl(templateUrl);
  }

  urlBuilder(urlBuilder) {
    if (!this.hasRoute()) {
      throw this.exception.routeIsNotDefined('urlBuilder');
    }

    var route = this.getRoute();
    route.setUrlBuilder(urlBuilder);
  }
}
