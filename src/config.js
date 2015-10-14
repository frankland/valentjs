import getter from 'lodash/object/get';
import setter from 'lodash/object/set';

let _config = Symbol('config');

export default class ApplicationConfig {
  route = {
    onChangeStart: (handler) => {
      this.set('routing.hooks.start', handler);
    },

    onChangeError: (handler) => {
      this.set('routing.hooks.error', handler);
    },

    otherwise: (otherwise) => {
      this.set('routing.otherwise', otherwise);
    },

    addResolver: (key, resolver) => {
      this.set(`routing.resolvers.${key}`, resolver);
    },

    enableHistoryApi: () => {
      this.set('routing.html5Mode', true);
    },

    disableHistoryApi: () => {
      this.set('routing.html5Mode', false);
    }
  };

  exception = {
    handler: (handler) => {
      this.set('exception.handler', handler);
    }
  };

  constructor(config) {
    this[_config] = Object.assign(config, {
      routing: {
        html5Mode: true
      }
    });
  }

  get(key) {
    return getter(this.config, key);
  }

  set(key, value) {
    return getter(this.config, key, value);
  }
}
