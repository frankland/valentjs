import Scope from './scope';

var pipe = Symbol('pipe');


function abstract() {
  throw new Error('Method is not implemented');
}

export default class DirectiveScope extends Scope {
  constructor(name, $scope) {
    super(name, $scope);
  }

  applyModel() {
    abstract();
  }

  setPipe(Pipe) {
    this[pipe] = Pipe;
  }

  getPipe() {
    return this[pipe];
  }
}

