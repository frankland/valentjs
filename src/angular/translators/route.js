import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';

export default (route, config) => {
  let name = route.getName();
  let module = route.getModule();

  let resolvers = {
    valentResolve: () => {
      let globalResolvers = config.route.getResolvers();
      let globalDependencies = Object.keys(globalResolvers);

      let globalTasks =  [];
      for (let key of Object.keys(globalResolvers)) {
        let resolver = globalResolvers[key];
        let task = resolver(route);

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

        let localResolvers = route.getResolvers();
        let localDependencies = Object.keys(localResolvers);

        let localTasks = [];
        for (let key of Object.keys(localResolvers)) {
          let resolver = localResolvers[key];
          let task = resolver(route);

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
  };

  let params = route.getParams();
  let configuration = Object.assign(params, {
    controller: name,
    resolve: resolvers
  });

  if (route.hasTemplate()) {

    // set template
    let template = route.getTemplate();
    if (isFunction(template)) {
      configuration.template = template.bind(route);
    } else {
      configuration.template = template;
    }
  } else if (route.hasTemplateUrl()) {

    // set templateUrl
    configuration.templateUrl = route.hasTemplateUrl();
  }

  let routes = route.getUrl();
  if (!isArray(routes)) {
    routes = [routes];
  }

  // create URL
  let struct = route.getStruct();
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
