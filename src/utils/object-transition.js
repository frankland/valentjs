import getter from 'lodash/object/get';
import setter from 'lodash/object/set';
import clone from 'lodash/lang/cloneDeep';

var local = {
  transition: Symbol('transition'),
  source: Symbol('source'),
  counter: Symbol('counter')
};


export default class ObjectTransition {

  constructor(obj) {
    this[local.transition] = new Map();
    this[local.source] = obj;
    this[local.counter] = 0;
  }

  /**
   * Scope methods
   */
  has(key) {
    return this[local.transition].has(key);
  }

  get(key) {
    return this[local.transition].get(key);
  }

  clear() {
    this[local.transition].clear();
  }

  commit(key, value) {
    this[local.transition].set(key, value);
  }

  push() {

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      throw new Error('Wrong arguments for ObjectTransition.push');
    }

    this[local.transition].forEach((value, key) => {
      setter(this[local.source], key, value);
    });

    this[local.counter]++;

    this.clear();
  }
}

