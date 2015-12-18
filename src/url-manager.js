import isFunction from 'lodash/lang/isFunction';

let _map = Symbol('url-map');
let _currentRouteName = Symbol('current-route-name');

// Uncaught TypeError: Method Map.prototype.set called on incompatible receiver [object Object] :(
// export default class UrlManager extends Map {
export default class UrlManager {
  constructor() {
    this[_map] = new Map();
  }

  set(name, url) {
    this[_map].set(name, url);
  }

  has(name) {
    return this[_map].has(name);
  }

  get(name) {
    let url = this[_map].get(name);
    if (isFunction(url)) {
      url = url();
      this.set(name, url);
    }

    return url;
  }

  getCurrentRoute() {
    throw new Error('depends on framework. Should be implemented at child class');
  }
}
