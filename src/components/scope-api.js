import Config from '../config';

var colors = [
  '#008EBA',
  '#99CC00',
  '#AA66CC',
  '#FD7400',
  '#723147',
  '#FF5F5F',
  '#AC59D6',
  '#6B5D99',
  '#FFBB33',
  '#FF4444',
  '#1F8A70',
  '#9BCF2E',
  '#004358',
  '#979C9C',
  '#962D3E',
  '#35478C',
  '#5F9C6D',
  '#FD7400',
  '#16193B',
  '#7FB2F0'
];

var counter = 0;
function getBackgroundColor() {
  if (counter == colors.length) {
    counter = 0;
  }

  return colors[counter++];
}

function logColored(message, background, color) {
  console.log(`%c ${message}`, `background: ${background}; color: ${color}`);
}

export default class ScopeApi {

  constructor($scope, controllerName) {

    this.controllerName = controllerName;
    this.scopeState = {};


    this.scope = $scope;
    this.counter = 0;
    this.isLogDetailed = false;
    this.isLogEnabled = Config.isScopeLogsEnabled();
    this.colors = {
      background: getBackgroundColor(),
      text: '#fff'
    };

  }

  enableScopeLog(isDetailed) {
    this.isLogDetailed = isDetailed;
    this.isLogEnabled = true;
  }

  disableScopeLog() {
    this.isLogEnabled = false;
  }

  applyLogColor(background, color) {
    if (background) {
      this.colors.background = background;
    }

    if (color) {
      this.colors.text = color;
    }
  }

  commit(values) {
    if (values && !angular.isObject(values)) {
      throw new Error('Wrong values for commit');
    }
    var virtual = this.getScopeState();

    angular.extend(virtual, values);
  }

  push(values) {
    var number = ++this.counter;

    if (values) {
      this.commit(values);
    }
    var virtual = this.getScopeState();


    if (this.isLogEnabled) {
      var message = `#${number} push ${Object.keys(virtual).length} changes to ${this.controllerName}: [${Object.keys(virtual)}]`;
      var { background, text } = this.colors;

      logColored(message, background, text);
    }


    if (this.isLogDetailed) {
      console.log(virtual);
    }

    angular.extend(this.scope, virtual);

    this.clearScopeState();
  }

  pushAndApply() {
    var instance = this;
    this.$scope.$apply(function() {
      instance.push.apply(instance, arguments);
    });
  }

  getScopeState() {
    return this.scopeState;
  }

  clearScopeState() {
    this.scopeState = {};
  }
}

