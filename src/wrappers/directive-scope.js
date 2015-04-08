import Scope from './scope';

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

  setPipes(pipes) {
    if (this.pipes) {
      this.error('Pipes already set');
    }

    this.pipes = pipes;
    Object.freeze(this.pipes);
  }
}

