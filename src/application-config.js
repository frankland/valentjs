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

    getHooks: () => {
      return this.get('routing.hooks', {});
    },

    otherwise: (otherwise) => {
      this.set('routing.otherwise', otherwise);
    },

    addResolver: (key, resolver) => {
      this.set(`routing.resolvers.${key}`, resolver);
    },

    getResolvers: () => {
      return this.get('routing.resolvers', {});
    },

    requireBase: (requireBase) => {
      this.set('routing.requireBase', requireBase);
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
    },

    getHandler: () => {
      return this.get('exception.handler');
    }
  };

  constructor(config) {
    this[_config] = Object.assign(config, {
      routing: {
        html5Mode: true
      }
    });
  }

  get(key, defaultValue = null) {
    return getter(this[_config], key, defaultValue);
  }

  set(key, value) {
    return setter(this[_config], key, value);
  }
}
