import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';

import AngularUrl from '../angular-url';

let getValentResolver = (config, routeModel) => ({
  'valent.resolve': () => {
    let globalResolvers = config.route.getResolvers();
    let globalDependencies = Object.keys(globalResolvers);

    let name = routeModel.getName();
    let params = routeModel.getParams();

    let resolverArguments = [name, params];

    let globalTasks = [];
    for (let key of Object.keys(globalResolvers)) {
      let resolver = globalResolvers[key];

      let task = resolver(...resolverArguments);

      globalTasks.push(task);
    }

    return Promise.all(globalTasks).then((resolved) => {
      let results = {};
      let index = 0;

      for (let resolverResult of resolved) {
        let key = globalDependencies[index];
        results[key] = resolverResult;

        index++;
      }

      let localResolvers = routeModel.getResolvers();
      let localDependencies = Object.keys(localResolvers);

      let localTasks = [];
      for (let key of Object.keys(localResolvers)) {
        let resolver = localResolvers[key];

        let task = resolver(...resolverArguments);

        localTasks.push(task);
      }

      return Promise.all(localTasks).then((resolved) => {
        let index = 0;

        for (let resolverResult of resolved) {
          let key = localDependencies[index];
          results[key] = resolverResult;

          index++;
        }

        return results;
      });
    });
  }
});

export default (routeModel, config) => {
  let name = routeModel.getName();
  let module = routeModel.getModule();


  let params = routeModel.getParams();
  let defaultRouteParams = {
    reloadOnSearch: false
  };

  let configuration = Object.assign(defaultRouteParams, params, {
    controller: name
  });

  let globalResolvers = config.route.getResolvers();

  if (!!Object.keys(globalResolvers).length || routeModel.hasResolvers()) {
    configuration.resolve = getValentResolver(config, routeModel);
  }

  if (routeModel.hasTemplate()) {

    // set template
    let template = routeModel.getTemplate();
    if (isFunction(template)) {
      configuration.template = template.bind(routeModel);
    } else {
      configuration.template = template;
    }
  } else if (routeModel.hasTemplateUrl()) {

    // set templateUrl
    configuration.templateUrl = routeModel.hasTemplateUrl();
  }

  let routes = routeModel.getUrl();
  if (!isArray(routes)) {
    routes = [routes];
  }

  // create URL
  let struct = routeModel.getStruct();
  let pattern = routes[0];

  let url = () => {
    return new AngularUrl(pattern, struct);
  };

  return {
    name,
    module,
    routes,
    url,
    configuration
  }
}
