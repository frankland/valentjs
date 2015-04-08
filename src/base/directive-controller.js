import Controller from './controller';

export default class DirectiveController extends Controller {

  constructor(scope) {
    super(scope);
    this.pipes = this.scope.pipes;
  }
}
