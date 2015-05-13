import getter from 'lodash/objects/get';
import setter from 'lodash/objects/set';

export default class ObjectTransition {
  constructor(source) {
    /**
     * public attributes
     */
    this.transition = new Map();
    this.source = source;

    this.pushCounter = 0;
  }

  getTransition() {
    return this.transition;
  }

  /**
   * Scope methods
   */
  set(key, value) {
    var source = this.source;
    return setter(source, key, value);
  }

  get(key) {
    var source = this.source;
    return getter(source, key);
  }

  clearTransition() {
    this.transition.clear();
  }

  commit(key, value) {
    var transition = this.getTransition();
    transition.set(key, value);
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

    transition.forEach((value, key) => {
      this.set(key, value);
    });

    this.clearTransition();
  }
}

