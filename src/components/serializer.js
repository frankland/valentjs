import isFunction from 'lodash/lang/isFunction';

var local = {
  rules: Symbol('rules'),
  struct: Symbol('struct')
};

export default class Serializer {
  constructor(struct) {
    this[local.struct] = this.normalizeStruct(struct);
    this[local.rules] = new WeakMap();
  }

  normalizeStruct(struct) {
    return struct;
  }

  normalizeRule(serializer) {
    return serializer;
  }

  getRules() {
    return this[local.rules];
  }

  getStruct() {
    return this[local.struct];
  }

  addRule(namespace, serializer) {
    if (!isFunction(serializer.encode) && !isFunction(serializer.decode)) {
      throw new Error('Serialize rule should implement both @encode and @decode methods');
    }

    var normalized = this.normalizeRule(serializer);
    this[local.rules].set(namespace, normalized);
  }

  encode() {
    throw new Error('@encode method should be implemented in child class');
  }


  decode() {
    throw new Error('@decode method should be implemented in child class');
  }
}
