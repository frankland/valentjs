import Config from '../config';
import Logger from '../logger';


var scopeKey = Symbol('$scope');
var logKey = Symbol('log');
var loggerKey = Symbol('logger');

export default class Scope {
  constructor($scope, injectorApi, controllerName) {
    /**
     * private attributes
     */
    var background = Logger.getNextColor();
    var color = '#fff;';
    var LogInstance = new Logger(background, color);
    this[loggerKey] = LogInstance;
    this[logKey] = LogInstance.logColored.bind(LogInstance);

    this[scopeKey] = $scope;

    /**
     * public attributes
     */
    this.controllerName = controllerName;

    this.scopeState = new Map();
    this.parse = injectorApi.get('$parse');

    this.pushCounter = 0;
    this.isLogDetailed = false;
    this.isLogEnabled = Config.isScopeLogsEnabled();
  }


  enableScopeLog(isDetailed) {
    this.isLogDetailed = isDetailed;
    this.isLogEnabled = true;
  }

  disableScopeLog() {
    this.isLogEnabled = false;
  }

  setLogColor(background, color) {
    var LoggerInstance = this[loggerKey];

    if (background) {
      LoggerInstance.setBackgroundColor(background);
    }

    if (color) {
      LoggerInstance.setColor(color);
    }
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

  push() {
    var pushCounter = ++this.pushCounter;

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      console.warn('Wrong arguments for scopeApi.push');
    }

    var scopeState = this.getScopeState();

    if (this.isLogEnabled) {
      var keys = [];
      scopeState.forEach((value, key) => keys.push(key));

      var message = `#${pushCounter} push ${scopeState.size} changes to ${this.controllerName}: [${keys.join(', ')}]`;

      var log = this[logKey];
      log(message);
    }

    if (this.isLogDetailed) {
      console.log(scopeState);
    }

    var scope = this[scopeKey];

    scopeState.forEach((value, key) => {
      var setter = this.setter(key);
      var current = this.get(key);

      if (angular.equals(value, current)) {
        console.warn(`Exisitng value in "${this.controllerName}'s" scope by key "${key}" is equal with pushing value`, value);
      }

      setter(scope, value);
    });

    this.clearScopeState();
  }

  pushAndApply() {
    var scope = this[scopeKey];
    scope.$apply(() => this.push(arguments));
  }
}

