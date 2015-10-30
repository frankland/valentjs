import isString from 'lodash/lang/isString';
import isArray from 'lodash/lang/isArray';
import isObject from 'lodash/lang/isObject';
import isFunction from 'lodash/lang/isFunction';
import * as primitives  from '../../src/utils/primitives';

let _alias = {
};
let _rules = {};

export default class CodingSerializer {

  static addAlias(alias, struct, rules) {

    if (!isString(alias)) {
      throw new Error('alias should be a String');
    }

    if (!isObject(struct)) {
      throw new Error('struct must be an object');
    }

    if (rules !== undefined && (!isObject(rules) ||
      isArray(rules) || isFunction(rules) ||
      !isFunction(rules.encode) || !isFunction(rules.decode))) {

      throw new Error('Serialize rule should implement both @encode and @decode methods');
    }

    _alias[alias] = struct;
    if(rules){
      _rules[alias] = rules;
    }
  }

  static getStruct(alias) {
    return _alias[alias]
  }

  static getRule(alias) {
    return _rules[alias]
  }

  constructor() {
    "use strict";

  }
}