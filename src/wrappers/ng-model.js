var modelKey = Symbol('ngModel');

export default class NgxModel {

  constructor(ngModel, Logger) {

    this[modelKey] = ngModel;
    this.logger = Logger;

    this.isListen = false;
  }

  listen(func) {

    if (!angular.isFunction(func)) {
      throw new Error('Wrong listen function');
    }
    var model = this[modelKey];

    model.$render = () => {
      var value = this.get();
      func(value);
    };

    this.isListen = true;
  }

  isListening() {
    return this.isListen;
  }

  get() {
    var model = this[modelKey];
    return model.$viewValue;
  }

  set(value) {
    this.logger.logColored('push ng-model to parent scope', value);

    if (value == this.get()) {
      var message = 'existing ng-model value equals to new value';

      this.logger.warnColored(message, value);
    }

    var model = this[modelKey];
    model.$setViewValue(value);
  }
}
