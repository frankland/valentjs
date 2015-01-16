// not tested
class UrlManager {

  constructor() {
    this.routes = {};
  }

  serialize(obj) {
    return Object.keys(obj).map(function(key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[k]);
    }).join('&')
  }

  addRoute(namespace, builder) {
    this.routes[namespace] = builder;
  }

  build(namespace, params) {
    if (!this.routes.hasOwnProperty(namespace)) {
      throw new Error('Route "' + namespace + '" does not exist');
    }
    var builder = this.routes[namespace];

    var url;

    if (angular.isFunction(builder)) {
      url = builder(params);
    } else {
      url = builder;

      if (params) {
        url += '?' + serialize(params);
      }
    }

    return url;
  }
}


export default new UrlManager();
