import DirectiveSource from './components/directive';
import FactorySource from './components/factory';
import ControllerSource from './components/controller';
import RouteSource from './components/route';
import Storage from './storage';
import MapManager from './map-manager';

class StorageManager {
  constructor() {
    this.MapManager = new MapManager();
    this.storages = {};
  }

  create(type) {
    if (Object.isFrozen(this.storages)){
      throw new Error('Can not create store because Storage is frozen');
    }

    this.storages[type] = [];
  }

  lock(){
    Object.freeze(this.storages);
  }

  store(type, component) {
    if (Object.isFrozen(this.storages)){
      throw new Error('Can not create store because Storage is frozen');
    }

    this.storages[type].push(component);
  }

  clear(){
    this.storages = [];
  }

  each(expr){
    var storage = this.all();

    for (var type of Object.keys(storage)) {
      var components = storage[type];
      for (var component of components) {
        expr(type, component);
      }
    }
  }

  statistics(){
    var storage = this.all(),
      types = Object.keys(storage);

    console.groupCollapsed('Runtime statistics');

    for (var type of types) {
      var total = storage[type].length;

      if (total){
        var components = storage[type],
          group = type + ' (' + total + ')';

        for (var component of components) {
          console.group(group);

          if (component.hasOwnProperty('name')){
            console.log(component.name);
          }

          component.statistics();

          console.groupEnd(group);
        }
      }
    }

    console.groupEnd('Runtime statistics');
  }

  all(type){
    var all;

    if (type == undefined) {
      all = this.storages;
    } else {
      all = this.storages[type];
    }

    return all;
  }

  register(){
    var MapManager = this.MapManager;
    this.each(function(type, component){
      MapManager.map(type, component);
    });
  }
}

var Manager = new StorageManager();

Manager.create('directive');
Manager.create('controller');
Manager.create('factory');
Manager.create('route');

var App = 'app';

function checkApp() {
  if (!App) {
    throw new Error('Add Application name using Runtime.Application(%name%)');
  }
}

export default Manager;

export function Directive(name) {
  checkApp();

  var Component = new DirectiveSource(name);

  Manager.store('directive', Component);

  return Component.at(App);
}

export function Controller(name) {
  checkApp();

  var Component = new ControllerSource(name);
  Manager.store('controller', Component);

  var Route = new RouteSource(App);
  Route.controller(name);

  Manager.store('route', Route);

  return Component.at(App)
    .router(Route);
}


export function Factory(name) {
  checkApp();

  var Component = new FactorySource(name);
  Manager.store('factory', Component);

  return Component.at(App);
}

