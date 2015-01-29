import Controller from './controller';

var unsubscribeKey = Symbol('unsubscribe-storage');

export default class DirectiveController extends Controller {

  constructor(scope, injector) {
    super(scope, injector);

    this.stateModel = this.scope.getStateModel();
  }
  listen(event, func) {

    super(this.stateModel, event, func);
  }

  sync() {
    this.stateModel.sync();
  }
}
