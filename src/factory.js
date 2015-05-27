import Manager from './index';

import FactoryFlow from './factory/factory-flow';

export default function(name) {
  var factoryFlow = new FactoryFlow(name);
  Manager.addFactory(factoryFlow.model);

  return factoryFlow;
}
