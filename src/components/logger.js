import Config from './config';

var colors = Config.colors;

var counter = 0;

function getColor() {
  if (counter == colors.length) {
    counter = 0;
  }

  return colors[counter++];
}


var nameKey = Symbol('controller-name-key');

export default class Logger {
  constructor(name, background, color){
    this[nameKey] = name;

    this.background = background;
    this.color = color;

    this.isEnabled = Config.isScopeLogsEnabled();
    this.isDetailed = false;
  }

  static getNextColor() {
    return getColor();
  }

  static create(name) {
    var background = this.getNextColor();
    var color = '#fff;';

    var logger = new Logger(name, '#fff', '#999');
    logger.setBackgroundColor(background);
    logger.setColor(color);

    return logger;
  }

  setBackgroundColor(background) {
    this.background = background;
  }

  setColor(color) {
    this.color = color;
  }

  enable(isDetailed) {
    if (isDetailed) {
      this.isDetailed = true;
    }

    this.isEnabled = true;
  }

  disable() {
    this.isDetailed = false;
    this.isEnabled = false;
  }

  log(){
    if (this.isEnabled) {
      console.log.apply(console, arguments);
    }
  }

  warn() {
    if (this.isEnabled) {
      console.warn.apply(console, arguments);
    }
  }

  logColored(message, value) {
    if (this.isEnabled) {
      var completeMessage = `${this[nameKey]} ${message}`;

      console.log(`%c ${completeMessage}`, `background: ${this.background}; color: ${this.color}`);

      if (this.isDetailed  && arguments.length == 2) {
        this.log(value);
      }
    }
  }

  warnColored(message, value) {
    if (this.isEnabled) {
      var completeMessage = `${this[nameKey]} ${message}`;

      console.warn(`%c ${completeMessage}`, `background: ${this.background}; color: ${this.color}`);

      if (this.isDetailed && arguments.length == 2) {
        this.warn(value);
      }
    }
  }

  warnEqualsValues(key, value) {
    if (this.isEnabled) {
      this.warnColored(`Exisitng value by path "${key}" is same`, value);
    }
  }
}
