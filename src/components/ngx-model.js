var modelKey = Symbol('ngModel');

export default class NgxModel {

  constructor(ngModel, onRender) {
    this[modelKey] = ngModel;
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
    var model = this[modelKey];
    model.$setViewValue(value);
  }
}
