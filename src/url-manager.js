import isFunction from 'lodash/lang/isFunction';

let _map = Symbol('url-map');

//export default class UrlManager extends Map {
// Uncaught TypeError: Method Map.prototype.set called on incompatible receiver [object Object] :(

export default class UrlManager {
  constructor(options) {

    this[_map] = new Map();
  }

  set(name, url) {
    this[_map].set(name, url);
  }

  get(name) {
    let url = this[_map].get(name);
    if (isFunction(url)) {
      url = url();
      this.set(name, url);
    }

    return url;
  }
}
