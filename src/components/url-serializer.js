import isArray from 'lodash/lang/isArray';
import find from 'lodash/collection/find';

import moment from 'moment';

import Serializer from './serializer';
import primitives from '../utils/struct-primitives';

var DATE_FORMAT = 'YYYYMMDD';
var DELIMITER = '~';
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

export default class UrlSerializer extends Serializer {
  constructor(params) {
    super(params);

    /**
     * Numbers
     */
    this.addRule(primitives.Num, {
      decode: NumDecode,
      encode: NumEncode
    });

    this.addRule(primitives.ListNum, {
      decode: (raw) => {
        if (!raw || !raw.length) {
          return null;
        }
        return raw.split(DELIMITER).map(NumDecode);
      },
      encode: (value) => {
        if (!isArray(value)) {
          return null;
        }
        return value.map(NumEncode).join(DELIMITER);
      }
    });

    /**
     * Strings
     */
    this.addRule(primitives.Str, {
      decode: StrDecode,
      encode: StrEncode
    });

    this.addRule(primitives.ListStr, {
      decode: (raw) => {
        if (!raw || !raw.length) {
          return null;
        }
        return raw.split(DELIMITER).map(StrDecode);
      },
      encode: (value) => {
        if (!isArray(value)) {
          return null;
        }
        return value.map(StrEncode).join(DELIMITER);
      }
    });

    /**
     * Dates
     */
    this.addRule(primitives.Dat, {
      decode: DateDecode,
      encode: DateEncode
    });

    this.addRule(primitives.ListDat, {
      decode: (raw) => {
        if (!raw || !raw.length) {
          return null;
        }
        return raw.split(DELIMITER).map(DateDecode);
      },
      encode: (value) => {
        if (!isArray(value)) {
          return null;
        }
        return value.map(DateEncode).join(DELIMITER);
      }
    });

    /**
     * Bools
     */
    this.addRule(primitives.Bool, {
      decode: BoolDecode,
      encode: BoolEncode
    });

    this.addRule(primitives.ListBool, {
      decode: (raw) => {
        if (!raw || !raw.length) {
          return null;
        }
        return raw.split(DELIMITER).map(BoolDecode);
      },
      encode: (value) => {
        if (!isArray(value)) {
          return null;
        }
        return value.map(BoolEncode).join(DELIMITER);
      }
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
        throw new Error(`rename key "${key}" is not described at url serializer`);
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

      var rule = rules.get(keyStruct);
      var encodedValue = rule.encode(value);

      var rename = struct[key].rename;
      encodedValues[rename] = encodedValue;
    }

    return encodedValues;
  }
}
