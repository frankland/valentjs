import isArray from 'lodash/lang/isArray';
import find from 'lodash/collection/find';

import moment from 'moment';

import Serializer from './serializer';

import * as primitives from '../utils/struct-primitives';

var DATE_FORMAT = 'YYYYMMDD';
var DELIMITER = '~';
var LIST_DELIMITER = '!';
var CONDITION_DELIMITER = ';';

/**
 * Numbers
 */
var NumDecode = (raw) => {
  if (raw === null) {
    return null;
  }
  return parseFloat(raw, 10);
};

var NumEncode = (value) => {
  var encoded = parseFloat(value, 10).toString(10);
  if (encoded === 'NaN') {
    return null;
  }
  return encoded;
};

/**
 * Strings
 */
var StrDecode = (raw)  => {
  if (raw === null) {
    return null;
  }
  return '' + raw;
};

var StrEncode = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  return '' + value;
};

/**
 * Dates
 */
var DateDecode = (raw) => {
  return moment.utc(raw, DATE_FORMAT).toDate();
};

var DateEncode = (value) => {
  return moment.utc(value).format(DATE_FORMAT);
};

/**
 * Booleans
 */
var BoolDecode = (raw) => {
  return raw !== '0';
};

var BoolEncode = (value) => {
  return !!value ? '1' : '0';
};


var addUrlRules = (urlSerializer, options) => {
  /**
   * Numbers
   */
  var Num = {
    decode: NumDecode,
    encode: NumEncode
  };

  urlSerializer.addRule(primitives.Num, Num);
  urlSerializer.addRule(primitives.ListNum, Num);
  urlSerializer.addRule(primitives.MaybeNum, Num);

  urlSerializer.addRule(primitives.Int, Num);
  urlSerializer.addRule(primitives.MaybeInt, Num);
  urlSerializer.addRule(primitives.ListInt, Num);

  var ListNum = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.delimiter).map(NumDecode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(NumEncode).join(options.delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListNum, ListNum);
  urlSerializer.addRule(primitives.MaybeListNum, ListNum);
  urlSerializer.addRule(primitives.MaybeListInt, ListNum);

  var ListListNum = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.list_delimiter).map(ListNum.decode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(ListNum.encode).join(options.list_delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListListNum, ListListNum);
  urlSerializer.addRule(primitives.ListMaybeListNum, ListListNum);

  /**
   * Strings
   */
  var Str = {
    decode: StrDecode,
    encode: StrEncode
  };

  urlSerializer.addRule(primitives.Str, Str);
  urlSerializer.addRule(primitives.MaybeStr, Str);

  var ListStr = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.delimiter).map(StrDecode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(StrEncode).join(options.delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListStr, ListStr);
  urlSerializer.addRule(primitives.MaybeListStr, ListStr);


  var ListListStr = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.list_delimiter).map(ListStr.decode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(ListStr.encode).join(options.list_delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListListStr, ListListStr);
  urlSerializer.addRule(primitives.ListMaybeListStr, ListListStr);

  /**
   * Dates
   */
  var Dat = {
    decode: DateDecode,
    encode: DateEncode
  };

  urlSerializer.addRule(primitives.Dat, Dat);
  urlSerializer.addRule(primitives.MaybeDat, Dat);

  var ListDat = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.delimiter).map(DateDecode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(DateEncode).join(options.delimiter);
    }
  };
  urlSerializer.addRule(primitives.ListDat, ListDat);
  urlSerializer.addRule(primitives.ListMaybeDat, ListDat);
  urlSerializer.addRule(primitives.MaybeListDat, ListDat);

  var ListListDat = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.list_delimiter).map(ListDat.decode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(ListDat.encode).join(options.list_delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListListDat, ListListDat);
  urlSerializer.addRule(primitives.ListMaybeListDat, ListListDat);
  /**
   * Bools
   */
  var Bool = {
    decode: BoolDecode,
    encode: BoolEncode
  };

  urlSerializer.addRule(primitives.Bool, Bool);
  urlSerializer.addRule(primitives.MaybeBool, Bool);

  var ListBool = {
    decode: (raw) => {
      if (!raw || !raw.length) {
        return null;
      }
      return raw.split(options.delimiter).map(BoolDecode);
    },
    encode: (value) => {
      if (!isArray(value)) {
        return null;
      }
      return value.map(BoolEncode).join(options.delimiter);
    }
  };

  urlSerializer.addRule(primitives.ListBool, ListBool);
  urlSerializer.addRule(primitives.MaybeListBool, ListBool);
};

export default class UrlSerializer extends Serializer {
  constructor(struct, options = {}) {
    super(struct);

    addUrlRules(this, {
      delimiter: options.delimiter || DELIMITER,
      date_format: options.date_format || DATE_FORMAT,
      list_delimiter: options.delimiter || LIST_DELIMITER,
      condition_delimiter: options.condition_delimiter || CONDITION_DELIMITER
    });
  }

  normalizeStruct(struct) {
    var normalized = {};

    for (var key of Object.keys(struct)) {
      var value = struct[key];

      var keyStruct = null;
      var rename = null;

      if (isArray(value)) {

        // TODO: check types
        rename = value[0];
        keyStruct = value[1];
      } else {
        rename = key;
        keyStruct = value;
      }

      normalized[key] = {
        rename,
        name: key,
        struct: keyStruct
      }
    }

    return normalized;
  }

  encode(params) {
    var struct = this.getStruct();
    var rules = this.getRules();

    var encodedValues = {};
    for (var key of Object.keys(params)) {
      var value = params[key];

      if (!struct.hasOwnProperty(key)) {
        throw new Error(`key "${key}" is not described at url serializer`);
      }

      var keyStruct = struct[key].struct;
      if (!rules.has(keyStruct)) {
        throw new Error(`serialize rule for "${key}" is not described at url serializer`);
      }

      try {
        var valueStruct = keyStruct(value);
      } catch (e) {
        throw new Error(`value with id "${key}" has wrong struct. Expected "${keyStruct.displayName}", but value is "${value}"`);
      }

      var rule = rules.get(keyStruct);
      var encodedValue = rule.encode(value);

      var rename = struct[key].rename;
      encodedValues[rename] = encodedValue;
    }

    return encodedValues;
  }

  decode(params) {
    var struct = this.getStruct();
    var rules = this.getRules();

    var decodedValues = {};

    for (var key of Object.keys(params)) {
      var value = params[key];

      var structItem = find(struct, {
        rename: key
      });

      if (!structItem) {
        // TODO: correct error msg
        throw new Error(`Key "${key}" is not described at url serialization rules`);
      }

      var keyStruct = structItem.struct;
      if (!rules.has(keyStruct)) {
        throw new Error(`serialize rule for "${key}" is not described at url serializer`);
      }

      var rule = rules.get(keyStruct);
      var decodedValue = rule.decode(value);

      var name = structItem.name;
      decodedValues[name] = decodedValue;
    }

    return decodedValues;
  }
}
