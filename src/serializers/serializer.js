import isFunction from 'lodash/lang/isFunction';


let _struct = Symbol('struct');
let _rules = Symbol('rules');

export default class Serializer {
  constructor(struct) {
    this[_struct] = this.normalizeStruct(struct);
    this[_rules] = new WeakMap();
  }

  normalizeStruct(struct) {
    return struct;
  }

  normalizeRule(serializer) {
    return serializer;
  }

  getRules() {
    return this[_rules];
  }

  getStruct() {
    return this[_struct];
  }

  addRule(namespace, serializer) {
    if (!isFunction(serializer.encode) && !isFunction(serializer.decode)) {
      throw new Error('Serialize rule should implement both @encode and @decode methods');
    }

    let normalized = this.normalizeRule(serializer);
    this[_rules].set(namespace, normalized);
  }

  encode(params) {
    let struct = this.getStruct();
    let rules = this.getRules();
    let encodedObject = {};

    let props = struct.meta.props;
    for (let key of Object.keys(props)) {

      if (params.hasOwnProperty(key)) {
        let structItem = props[key];
        if (!rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        let value = params[key];
        try {
          let valueStruct = structItem(value);
        } catch (e) {
          throw new Error(`value with id "${key}" has wrong struct. Expected "${structItem.displayName}", but value is "${value}"`);
        }

        let rule = rules.get(structItem);
        encodedObject[key] = rule.encode(value);
      }
    }

    return encodedObject;
  }


  decode(params) {
    let struct = this.getStruct();
    let rules = this.getRules();
    let decodedObject = {};

    let props = struct.meta.props;
    for (let key of Object.keys(props)) {

      if (params.hasOwnProperty(key)) {
        let structItem = props[key];
        if (!rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        let value = params[key];

        let rule = rules.get(structItem);
        decodedObject[key]= rule.decode(value);
      }
    }

    return decodedObject;
  }
}
