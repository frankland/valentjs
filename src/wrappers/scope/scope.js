import Config from '../../components/config';

var scopeKey = Symbol('$scope');

export default class Scope {
  constructor($scope, InjectorApi, Logger) {

    /**
     * private attributes
     */
    this[scopeKey] = $scope;

    /**
     * public attributes
     */
    this.logger = Logger;
    this.transition = new Map();

    this.parse = InjectorApi.get('$parse');

    this.pushCounter = 0;
  }

  getter(key) {
    var parse = this.parse;
    return parse(key);
  }

  setter(key) {
    return this.getter(key).assign;
  }

  get(key) {
    var getter = this.getter(key);
    var scope = this[scopeKey];

    return getter(scope);
  }

  assign(key) {
    var scope = this[scopeKey];
    return this.getter(key).bind(null, scope);
  }

  getTransition() {
    return this.transition;
  }

  clearTransition() {
    this.transition.clear();
  }

  commit(key, value) {
    var scopeState = this.getTransition();
    scopeState.set(key, value);
  }

  log(message) {
    this.logger.log(message);
  }

  error(message) {
    var completeMessage = this.logger.getCompleteMessage(message);
    throw new Error(completeMessage);
  }

  push() {
    var pushCounter = ++this.pushCounter;

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      console.warn('Wrong arguments for scopeApi.push');
    }

    var transition = this.getTransition();

    var keys = [];
    transition.forEach((value, key) => keys.push(key));

    var message = `#${pushCounter} push ${transition.size} changes: [${keys.join(', ')}]`;
    this.logger.logColored(message, transition);


    var scope = this[scopeKey];

    transition.forEach((value, key) => {
      var setter = this.setter(key);
      var current = this.get(key);

      if (angular.equals(value, current)) {
        this.logger.warnEqualsValues(key, value);
      } else {
        setter(scope, value);
      }
    });

    this.clearTransition();
  }

  safeApply(fn) {
    var scope = this[scopeKey];

    var phase = scope.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      scope.$apply(fn);
    }
  };

  pushAndApply(...args) {
    this.safeApply(() => this.push(...args));
  }
}

