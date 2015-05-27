import getter from 'lodash/object/get';
import setter from 'lodash/object/set';
import clone from 'lodash/lang/cloneDeep';

var transition = Symbol('transition');

export default class ObjectTransition {

  constructor(source) {
    this[transition] = new Map();
    this.source = source;

    this.pushCounter = 0;
  }

  /**
   * Scope methods
   */
  has(key) {
    return this[transition].has(key);
  }

  get(key) {
    return this[transition].get(key);
  }

  clear() {
    this[transition].clear();
  }

  commit(key, value) {
    this[transition].set(key, value);
  }

  push() {
    this.pushCounter++;

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      throw new Error('Wrong arguments for ObjectTransition.push');
    }

    var source = this.source;
    this[transition].forEach((value, key) => {
      setter(source, key, value);
    });

    this.clear();
  }
}

