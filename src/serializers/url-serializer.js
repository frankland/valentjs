import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';
import moment from 'moment';

import * as primitives from '../utils/primitives';

import RenameSerializer from './rename-serializer';


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

var addUrlRules = (addRule, options) => {
  let decoders = createDecoders(options);
  let encoders = createEncoders(options);

  // ------ NUMBER -----
  let num = {
    decode: decoders.num,
    encode: encoders.num
  };

  addRule(primitives.Num, num);
  addRule(primitives.ListNum, num);

  let numList = {
    decode: decoders.listNum,
    encode: encoders.listNum
  };

  addRule(primitives.ListNum, numList);
  addRule(primitives.MaybeListNum, numList);

  let matrixNum = {
    decide: decoders.matrixNum,
    encode: encoders.matrixNum
  };

  addRule(primitives.MatrixNum, matrixNum);
  addRule(primitives.MatrixMaybeNum, matrixNum);

  // ------ STRING -----
  var str = {
    decode: decoders.str,
    encode: encoders.str
  };

  addRule(primitives.Str, str);
  addRule(primitives.MaybeStr, str);

  let listStr = {
    decode: decoders.listStr,
    encode: encoders.listStr
  };

  addRule(primitives.ListStr, listStr);
  addRule(primitives.MaybeListStr, listStr);


  let matrixStr = {
    decode: decoders.matrixStr,
    encode: encoders.matrixStr
  };

  addRule(primitives.MatrixStr, matrixStr);
  addRule(primitives.MatrixMaybeStr, matrixStr);

  // ------ DATES -----
  var date = {
    decode: decoders.date,
    encode: encoders.date
  };

  addRule(primitives.Dat, date);
  addRule(primitives.MaybeDat, date);

  let listDate = {
    decode: decoders.listDate,
    encode: encoders.listDate,
  };

  addRule(primitives.ListDat, listDate);
  addRule(primitives.MaybeListDat, listDate);

  let matrixDate = {
    decode: decoders.matrixDate,
    encode: encoders.matrixDate
  };

  addRule(primitives.MatrixDate, matrixDate);
  addRule(primitives.MatrixMaybeDate, matrixDate);

  // ------ BOOL-----
  var bool = {
    decode: decoders.bool,
    encode: encoders.bool
  };

  addRule(primitives.Bool, bool);
  addRule(primitives.MaybeBool, bool);

  let listBool = {
    decode: decoders.listBool,
    encode: encoders.listBool
  };

  addRule(primitives.ListBool, listBool);
  addRule(primitives.MaybeListBool, listBool);

  let matrixBool = {
    decode: decoders.matrixBool,
    encode: encoders.matrixBool
  };

  addRule(primitives.MatrixBool, matrixBool);
  addRule(primitives.MatrixMaybeBool, matrixBool);
};

export default class UrlSerializer extends RenameSerializer {
  constructor(struct, options = {}) {
    super(struct);

    addUrlRules((struct, description) => {
      this.addRule(struct, description);
    }, {
      list_delimiter: options.list_delimiter || '~',
      matrix_delimiter: options.matrix_delimiter || '!',
      date_format: options.date_format || 'YYYYMMDD',
      condition_delimiter: options.condition_delimiter || ';'
    });
  }
}
