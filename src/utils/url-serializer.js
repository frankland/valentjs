import isArray from 'lodash/lang/isArray';
import find from 'lodash/collection/find';

import moment from 'moment';

import Serializer from './serializer';
import * as primitives from '../utils/primitives';


let createDecoders = (options) => {
  var decoders = {
    // ------- NUMBER -------
    num: (raw) => raw === null ? null : parseFloat(raw),
    listNum: (raw) => !raw || !raw.length ? null : raw.split(options.list_delimiter).map(decoders.num),
    matrixNum: (raw) => !raw || !raw.length ? null : raw.split(options.matrix_delimiter).map(decoders.listNum),

    // ------- STRING -------
    str: (raw) => raw === null ? null : '' + raw,
    listStr: (raw) => !raw || !raw.length ? null : raw.split(options.list_delimiter).map(decoders.str),
    matrixStr: (raw) => !raw || !raw.length ? null : raw.split(options.matrix_delimiter).map(decoders.listStr),

    // ------- DATE-------
    date: (raw) => moment.utc(raw, options.dateFormat).toDate(),
    listDate: (raw) => !raw || !raw.length ? null : raw.split(options.list_delimiter).map(decoders.date),
    matrixDate: (raw) => !raw || !raw.length ? null : raw.split(options.matrix_delimiter).map(decoders.listDate),


    // ------- BOOL-------
    bool: (raw) => raw !== '0',
    listBool: (raw) => !raw || !raw.length ? null : raw.split(options.list_delimiter).map(decoders.bool),
    matrixBool: (raw) => !raw || !raw.length ? null : raw.split(options.matrix_delimiter).map(decoders.listBool)
  };


  return decoders;
};

let createEncoders = (options) => {
  var encoders = {
    // ------- NUMBER -------
    num: (value) => {
      let encoded = parseFloat(value).toString(10);
      return encoded === 'NaN' ? null : encoded;
    },
    listNum: (value) => !isArray(value) ? null : value.map(encoders.num).join(options.list_delimiter),
    matrixNum: (value) => !isArray(value) ? null : value.map(encoders.listNum).join(options.matrix_delimiter),

    // ------- STRING -------
    str: (value) => value === null || value === undefined ? null : '' + value,
    listStr: (value) => !isArray(value) ? null : value.map(encoders.str).join(options.list_delimiter),
    matrixStr: (value) => !isArray(value) ? null : value.map(encoders.listStr).join(options.matrix_delimiter),

    // ------- DATE-------
    date: (value) => moment.utc(value).format(options.dateFormat),
    listDate: (value) => !isArray(value) ? null : value.map(encoders.date).join(options.list_delimiter),
    matrixDate: (value) => !isArray(value) ? null : value.map(encoders.listDate).join(options.matrix_delimiter),

    // ------- BOOL-------
    bool: (value) => !!value ? '1' : '0',
    listBool: (value) => !isArray(value) ? null : value.map(encoders.bool).join(options.list_delimiter),
    matrixBool: (value) => !isArray(value) ? null : value.map(encoders.listBool).join(options.matrix_delimiter)
  };

  return encoders;
};

var addUrlRules = (serializer, options) => {
  let decoders = createDecoders(options);
  let encoders = createEncoders(options);

  // ------ NUMBER -----
  let num = {
    decode: decoders.num,
    encode: encoders.num
  };

  serializer.addRule(primitives.Num, num);
  serializer.addRule(primitives.ListNum, num);

  let numList = {
    decode: decoders.listNum,
    encode: encoders.listNum
  };

  serializer.addRule(primitives.ListNum, numList);
  serializer.addRule(primitives.MaybeListNum, numList);

  let matrixNum = {
    decide: decoders.matrixNum,
    encode: encoders.matrixNum
  };

  serializer.addRule(primitives.MatrixNum, matrixNum);
  serializer.addRule(primitives.MatrixMaybeNum, matrixNum);

  // ------ STRING -----
  var str = {
    decode: decoders.str,
    encode: encoders.str
  };

  serializer.addRule(primitives.Str, str);
  serializer.addRule(primitives.MaybeStr, str);

  let listStr = {
    decode: decoders.listStr,
    encode: encoders.listStr
  };

  serializer.addRule(primitives.ListStr, listStr);
  serializer.addRule(primitives.MaybeListStr, listStr);


  let matrixStr = {
    decode: decoders.matrixStr,
    encode: encoders.matrixStr
  };

  serializer.addRule(primitives.MatrixStr, matrixStr);
  serializer.addRule(primitives.MatrixMaybeStr, matrixStr);

  // ------ DATES -----
  var date = {
    decode: decoders.date,
    encode: encoders.date
  };

  serializer.addRule(primitives.Dat, date);
  serializer.addRule(primitives.MaybeDat, date);

  let listDate = {
    decode: decoders.listDate,
    encode: encoders.listDate,
  };

  serializer.addRule(primitives.ListDat, listDate);
  serializer.addRule(primitives.MaybeListDat, listDate);

  let matrixDate = {
    decode: decoders.matrixDate,
    encode: encoders.matrixDate
  };

  serializer.addRule(primitives.MatrixDate, matrixDate);
  serializer.addRule(primitives.MatrixMaybeDate, matrixDate);

  // ------ BOOL-----
  var bool = {
    decode: decoders.bool,
    encode: encoders.bool
  };

  serializer.addRule(primitives.Bool, bool);
  serializer.addRule(primitives.MaybeBool, bool);

  let listBool = {
    decode: decoders.listBool,
    encode: encoders.listBool
  };

  serializer.addRule(primitives.ListBool, listBool);
  serializer.addRule(primitives.MaybeListBool, listBool);

  let matrixBool = {
    decode: decoders.matrixBool,
    encode: encode.matrixBool
  };

  serializer.addRule(primitives.MatrixBool, matrixBool);
  serializer.addRule(primitives.MatrixMaybeBool, matrixBool);
};

export default class UrlSerializer extends Serializer {
  constructor(struct, options = {}) {
    super(struct);

    addUrlRules(this, {
      list_delimiter: options.list_delimiter || '~',
      matrix_delimiter: options.matrix_delimiter || '!',
      date_format: options.date_format || 'YYYYMMDD',
      condition_delimiter: options.condition_delimiter || ';'
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

  /**
   * Overridden because of rename option
   * @override
   * @param params
   * @returns {{}}
   */
  encode(params) {
    let struct = this.getStruct();
    let rules = this.getRules();
    let encodedValues = {};

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

  /**
   * Overridden because of rename option
   * @override
   * @param params
   * @returns {{}}
   */
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
