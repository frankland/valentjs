import ControllerMapper from './mappers/controller';
import Directive from './mappers/directive';
import Factory from './mappers/factory';
import RouteMapper from './mappers/route';

class MapManager {

  constructor() {
    this.mappers = {
      controller: ControllerMapper,
      route: RouteMapper,
      directive: Directive,
      factory: Factory
    }
  }


  get(type) {
    if (!this.mappers.hasOwnProperty(type)) {
      throw new Error('MapManager: Type "' + type + '" is not defined');
    }

    return this.mappers[type];
  }

  map(type, components) {
    var mapper = this.get(type);

    mapper(components);
  }
}

export default MapManager;
