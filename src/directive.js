import Manager from './index';

import DirectiveFlow from './directive/directive-flow';

export default function(name) {
  var directiveFlow = new DirectiveFlow(name);
  Manager.addDirective(directiveFlow.model);

  return directiveFlow;
}
