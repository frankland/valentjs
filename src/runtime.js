import DirectiveSource from './flow/directive';
import FactorySource from './flow/factory';
import ControllerSource from './flow/controller';
import RouteSource from './flow/route';
import Api from './api';


var Manager = new Api();

Manager.create('directive');
Manager.create('controller');
Manager.create('factory');
Manager.create('route');

/**
 * Default angular module
 */
var App = 'app';

export default Manager;

export function Directive(name) {
  var Component = new DirectiveSource(name);

  Manager.store('directive', Component);

  return Component.at(App);
}

export function Controller(name) {

  var Component = new ControllerSource(name);
  Manager.store('controller', Component);

  var Route = new RouteSource(App);
  Route.controller(name);

  Manager.store('route', Route);

  return Component.at(App)
      .router(Route);
}


export function Factory(name) {

  var Component = new FactorySource(name);
  Manager.store('factory', Component);

  return Component.at(App);
}

