import DirectiveFlow from './flow/directive';
import FactoryFlow from './flow/factory';
import ControllerFlow from './flow/controller';
import RouteFlow from './flow/route';
import Manager from './manager';


var manager = new Manager();

/**
 * Default angular module. Could be overridden at manager.register or
 * at each component using method `at`
 */
var App = 'ngx-flow';

export default manager;

export function Directive(name) {
  var component = new DirectiveFlow(name);

  manager.directive(component);

  return component.at(App);
}

export function Controller(name) {

  var component = new ControllerFlow(name);
  manager.controller(component);

  var Route = new RouteFlow(App);
  Route.controller(name);

  manager.route(Route);

  return component.at(App)
      .router(Route);
}


export function Factory(name) {

  var component = new FactoryFlow(name);
  manager.factory(component);

  return component.at(App);
}

