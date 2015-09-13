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

  encode(params) {
    var struct = this.getStruct();
    var rules = this.getRules();
    var encodedObject = {};

    var props = struct.meta.props;
    for (var key of Object.keys(props)) {

      if (params.hasOwnProperty(key)) {
        var structItem = props[key];
        if (!rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        var value = params[key];
        try {
          var valueStruct = structItem(value);
        } catch (e) {
          throw new Error(`value with id "${key}" has wrong struct. Expected "${structItem.displayName}", but value is "${value}"`);
        }

        var rule = rules.get(structItem);
        var encoded = rule.encode(value);
        encodedObject[key] = encoded;
      }
    }

    return encodedObject;
  }


  decode(params) {
    var struct = this.getStruct();
    var rules = this.getRules();
    var decodedObject = {};

    var props = struct.meta.props;
    for (var key of Object.keys(props)) {

      if (params.hasOwnProperty(key)) {
        var structItem = props[key];
        if (!rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        var value = params[key];

        var rule = rules.get(structItem);
        var decoded = rule.decode(value);
        decodedObject[key] = decoded;
      }
    }

    return decodedObject;
  }
}
