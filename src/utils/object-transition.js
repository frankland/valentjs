import getter from 'lodash/object/get';
import setter from 'lodash/object/set';
import clone from 'lodash/lang/cloneDeep';

var transition = Symbol('transition');
var source = Symbol('source');
var counter= Symbol('counter');

export default class ObjectTransition {

  constructor(obj) {
    this[transition] = new Map();
    this[source] = obj;
    this[counter] = 0;
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

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      throw new Error('Wrong arguments for ObjectTransition.push');
    }

    this[transition].forEach((value, key) => {
      setter(this[source], key, value);
    });

    this[counter]++;

    this.clear();
  }
}

