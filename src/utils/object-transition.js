/**
 * TODO: remove Injector deps form here and use lodash same methods
 */
import Injector from '../components/injector';

export default class ObjectTransition {
  constructor(source) {
    /**
     * public attributes
     */
    this.transition = new Map();
    this.source = source;

    this.parse = Injector.get('$parse');
    this.pushCounter = 0;
  }

  getTransition() {
    return this.transition;
  }

  /**
   * Scope methods
   */
  getter(key) {
    var parse = this.parse;
    return parse(key);
  }

  setter(key) {
    return this.getter(key).assign;
  }

  get(key) {
    var getter = this.getter(key);
    var source = this.source;
    return getter(source);
  }

  assign(key) {
    var source = this.source;
    return this.getter(key).bind(null, source);
  }


  clearTransition() {
    this.transition.clear();
  }

  commit(key, value) {
    var scopeState = this.getTransition();
    scopeState.set(key, value);
  }

  push() {
    this.pushCounter++;

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      throw new Error('Wrong arguments for ObjectTransition.push');
    }

    var transition = this.getTransition();

    // Workaround
    var keys = [];
    transition.forEach((value, key) => keys.push(key));

    var source = this.source;
    transition.forEach((value, key) => {
      var setter = this.setter(key);
      setter(source, value);
    });

    this.clearTransition();
  }
}

