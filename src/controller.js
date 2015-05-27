import Manager from './index';

import ControllerFlow from './controller/controller-flow';

export default function(name) {
  var controllerFlow = new ControllerFlow(name);
  Manager.addController(controllerFlow.model);

  return controllerFlow;
}
