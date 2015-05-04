import log from 'log-with-style';
import Config from './config';

var colors = Config.getColors();

var counter = 0;

function getColor() {
  if (counter == colors.length) {
    counter = 0;
  }

  return colors[counter++];
}


var id = Symbol('id');
var loggers = new WeakMap();

export default class Logger {

  static attach(scope, name) {
    var logger = Logger.create(name);
    loggers.set(scope, logger);

    return logger;
  }

  static getNextColor() {
    return getColor();
  }

  static create(name) {
    var background = this.getNextColor();
    var color = '#fff;';

    return new Logger(name, background, color);
  }

  constructor(name, background, color){
    this[id] = name;

    this.background = background || '#fff';
    this.color = color || '#000';

    this.isEnabled = true;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getCompleteMessage(message) {
    return `[c="color: ${this.color}; background: ${this.background}"]${this[id]}[c] ${message}`;
  }

  error() {
    // TODO
  }

  log(message, ...rest) {
    if (this.isEnabled) {
      var completeMessage = this.getCompleteMessage(message);
      log.apply(null, [completeMessage].concat(rest));
    }
  }
}
