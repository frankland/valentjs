import isArray from 'lodash/lang/isArray';
import Serializer from './serializer';

export default class RenameSerializer extends Serializer {
  renameOptions = {};

  constructor(struct, options = {}) {
    let normalizedStruct = {};
    let renameOptions = {};
    for (let key of Object.keys(struct)) {
      let value = struct[key];
      let filedStruct = null;

      if (isArray(value)) {
        renameOptions[key] = value[0];
        filedStruct = value[1];
      } else {
        filedStruct = value;
      }

      normalizedStruct[key] = filedStruct;
    }

    super(normalizedStruct);
    this.renameOptions = renameOptions;
  }

  encode(params) {
    let encoded = super.encode(params);

    let normalized = {};
    for (let key of Object.keys(encoded)) {
      let value = encoded[key];
      let rename = this.renameOptions[key];

      if (rename) {
        normalized[rename] = value;
      } else {
        normalized[key] = value;
      }
    }

    return normalized;
  }

  getOriginalName(renamed) {
    let original = null;
    for (let key of Object.keys(this.renameOptions)) {
      if (this.renameOptions[key] == renamed) {
        original = key;
        break;
      }
    }

    return original;
  }

  decode(params) {
    let normalized = {};

    for (let key of Object.keys(params)) {
      let value = params[key];
      let original = this.getOriginalName(key);
      if (!original) {
        throw new Error(`Can not find origin name for "${key}"`);
      }

      if (original) {
        normalized[original] = value;
      } else {
        normalized[key] = value;
      }
    }

    return super.decode(params);
  }
}
