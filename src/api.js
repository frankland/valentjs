import MapManager from './map-manager';

class Storage {
  constructor() {
    this.MapManager = new MapManager();
    this.storages = {};
  }

  create(type) {
    if (Object.isFrozen(this.storages)) {
      throw new Error('Can not create store because Storage is frozen');
    }

    this.storages[type] = [];
  }

  lock() {
    Object.freeze(this.storages);
  }

  store(type, component) {
    if (Object.isFrozen(this.storages)) {
      throw new Error('Can not create store because Storage is frozen');
    }

    this.storages[type].push(component);
  }

  clear() {
    this.storages = [];
  }


  statistics() {
    var storage = this.all(),
        types = Object.keys(storage);

    console.groupCollapsed('Runtime statistics');

    for (var type of types) {
      var total = storage[type].length;

      if (total) {
        var components = storage[type],
            group = type + ' (' + total + ')';

        console.group(group);

        for (var component of components) {
          if (component.hasOwnProperty('name')) {
            console.log(component.name);
          }

          component.statistics();
        }

        console.groupEnd(group);
      }
    }

    console.groupEnd('Runtime statistics');
  }

  all(type) {
    var all;

    if (type == undefined) {
      all = this.storages;
    } else {
      all = this.storages[type];
    }

    return all;
  }

  register() {
    var MapManager = this.MapManager,
        storage = this.all();

    for (var type of Object.keys(storage)) {
      var components = storage[type];

      MapManager.map(type, components);
    }
  }
}


export default Storage;
