import Config from '../../components/config';
import Logger from '../../components/logger';


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
    this.scopeState = new Map();
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

  getScopeState() {
    return this.scopeState;
  }

  clearScopeState() {
    this.scopeState.clear();
  }

  commit(key, value) {
    var scopeState = this.getScopeState();
    scopeState.set(key, value);
  }

  log(message) {
    var log = this[logKey];
    var compeleteMessage = `${this.controllerName}: ${message}`;

    log(compeleteMessage);
  }

  error(message) {
    this.logger.error(message);
  }

  push() {
    var pushCounter = ++this.pushCounter;

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      console.warn('Wrong arguments for scopeApi.push');
    }

    var scopeState = this.getScopeState();

    var keys = [];
    scopeState.forEach((value, key) => keys.push(key));

    var message = `#${pushCounter} push ${scopeState.size} changes: [${keys.join(', ')}]`;
    this.logger.logColored(message, scopeState);


    var scope = this[scopeKey];

    scopeState.forEach((value, key) => {
      var setter = this.setter(key);
      var current = this.get(key);

      if (angular.equals(value, current)) {
        this.logger.warnEqualsValues(key, value);
      } else {
        setter(scope, value);
      }
    });

    this.clearScopeState();
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
    var scope = this[scopeKey];
    this.safeApply(() => this.push(...args));
  }
}

