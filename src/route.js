import Manager from './index';

import RouteFlow from './route/route-flow';

export default function(controller) {
  var routeFlow = new RouteFlow(controller);
  Manager.addRoute(routeFlow.model);

  return routeFlow;
}
