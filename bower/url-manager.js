class UrlManager {

  constructor() {
    this.routes = {};
  }

  addRoute(route, url) {
    this.routes[route] = url;
  }

  build(route, params) {
    if (!this.routes.hasOwnProperty(route)) {
      throw new Error('Route "' + route + '" does not exist');
    }

    var url = this.routes[route];

    return url;
  }
}


export default new UrlManager();
