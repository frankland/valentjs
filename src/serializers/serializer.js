import isFunction from 'lodash/isFunction';

let _struct = Symbol('struct');
let _rules = Symbol('rules');

export default class Serializer {
  constructor(struct) {
    this[_struct] = struct;
    this[_rules] = new WeakMap();
  }

  getRules() {
    return this[_rules];
  }

  getStruct() {
    return this[_struct];
  }

  addRule(namespace, serializer) {
    if (!namespace) {
      throw new Error('Namespace is required');
    }

    if (!isFunction(serializer.encode) || !isFunction(serializer.decode)) {
      throw new Error(
        'Serialize rule should implement both @encode and @decode methods'
      );
    }
    this[_rules].set(namespace, serializer);
  }

  encode(params) {
    let struct = this.getStruct();

    let rules = this.getRules();
    let encodedObject = {};

    for (let key of Object.keys(struct)) {
      if (params.hasOwnProperty(key)) {
        let structItem = struct[key];

        if (false && !rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        let value = params[key];
        let isEncodeAllowed = this.isEncodeAllowed(key, value);

        if (isEncodeAllowed) {
          if (!structItem.is(value)) {
            try {
              structItem(value);
            } catch (e) {
              throw new Error(
                `value with id "${key}" has wrong struct. Expected "${
                  structItem.displayName
                }", but value is "${value}"`
              );
            }
          }

          let rule = rules.get(structItem);

          encodedObject[key] = rule.encode(value);
        }
      }
    }

    return encodedObject;
  }

  decode(params) {
    let struct = this.getStruct();
    let rules = this.getRules();
    let decodedObject = {};

    //let props = struct;
    for (let key of Object.keys(struct)) {
      if (params.hasOwnProperty(key)) {
        let structItem = struct[key];
        if (!rules.has(structItem)) {
          throw new Error(`rule for struct with id "${key}" does not exist`);
        }

        let value = params[key];

        let rule = rules.get(structItem);
        decodedObject[key] = rule.decode(value);
      }
    }

    return decodedObject;
  }

  // should be overridden in child serializers
  isEncodeAllowed(key, value) {
    return true;
  }
}
