import setter from 'lodash/set';

let _transition = Symbol('transition');
let _source = Symbol('source');
let _counter = Symbol('counter');

export default class ObjectTransition {
  constructor(obj) {
    this[_transition] = new Map();
    this[_source] = obj;
    this[_counter] = 0;
  }

  /**
   * Scope methods
   */
  has(key) {
    return this[_transition].has(key);
  }

  get(key) {
    return this[_transition].get(key);
  }

  clear() {
    this[_transition].clear();
  }

  commit(key, value) {
    this[_transition].set(key, value);
  }

  push(...args) {
    if (args.length == 2) {
      this.commit(...args);
    } else if (!!args.length) {
      throw new Error('Wrong arguments for ObjectTransition.push');
    }

    this[_transition].forEach((value, key) => {
      setter(this[_source], key, value);
    });

    this[_counter]++;

    this.clear();
  }
}
