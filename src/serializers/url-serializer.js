import isObject from 'lodash/lang/isObject';
import isArray from 'lodash/lang/isArray';
import isString from 'lodash/lang/isString';
import isEmpty from 'lodash/lang/isEmpty';

import moment from 'moment';

import * as primitives from '../utils/primitives';

import RenameSerializer from './rename-serializer';

const datesToPeriod = dates => {
  return [
    moment.utc(dates[0]).startOf('day').toDate(),
    moment.utc(dates[1]).endOf('day').toDate()
  ]
};

let createDecoders = (options) => {
  let decoders = {
    // ------- NUMBER -------
    num: (raw) => raw === null ? null : parseFloat(raw),
    listNum: (raw) => !raw || !raw.length ? null : raw.split(options.listDelimiter).map(decoders.num),
    matrixNum: (raw) => !raw || !raw.length ? null : raw.split(options.matrixDelimiter).map(decoders.listNum),

    // ------- STRING -------
    str: (raw) => raw === null ? null : '' + raw,
    listStr: (raw) => !raw || !raw.length ? null : raw.split(options.listDelimiter).map(decoders.str),
    matrixStr: (raw) => !raw || !raw.length ? null : raw.split(options.matrixDelimiter).map(decoders.listStr),

    // ------- DATE-------
    date: (raw) => moment.utc(raw, options.dateFormat).toDate(),
    listDate: (raw) => !raw || !raw.length ? null : raw.split(options.listDelimiter).map(decoders.date),
    matrixDate: (raw) => !raw || !raw.length ? null : raw.split(options.matrixDelimiter).map(decoders.listDate),

    // ------- PERIOD-------
    period: (raw) => {
      if (!raw || !raw.length)
        return null;
      let dates = raw.split(options.listDelimiter).map(decoders.date);
      return datesToPeriod(dates);
    },
    comparePeriod: (raw) => {
      if (!raw || !raw.length)
        return null;

      let dates = raw.split(options.matrixDelimiter).map(decoders.listDate);
      return dates.map(datesToPeriod);
    },

    // ------- BOOL-------
    bool: (raw) => raw !== '0',
    listBool: (raw) => !raw || !raw.length ? null : raw.split(options.listDelimiter).map(decoders.bool),
    matrixBool: (raw) => !raw || !raw.length ? null : raw.split(options.matrixDelimiter).map(decoders.listBool)
  };


  return decoders;
};

let createEncoders = (options) => {
  let encoders = {
    // ------- NUMBER -------
    num: (value) => {
      let encoded = parseFloat(value).toString(10);
      return encoded === 'NaN' ? null : encoded;
    },
    listNum: (value) => !isArray(value) ? null : value.map(encoders.num).join(options.listDelimiter),
    matrixNum: (value) => !isArray(value) ? null : value.map(encoders.listNum).join(options.matrixDelimiter),

    // ------- STRING -------
    str: (value) => value === null || value === undefined ? null : '' + value,
    listStr: (value) => !isArray(value) ? null : value.map(encoders.str).join(options.listDelimiter),
    matrixStr: (value) => !isArray(value) ? null : value.map(encoders.listStr).join(options.matrixDelimiter),

    // ------- DATE-------
    date: (value) => moment.utc(value).format(options.dateFormat),
    listDate: (value) => !isArray(value) ? null : value.map(encoders.date).join(options.listDelimiter),
    matrixDate: (value) => !isArray(value) ? null : value.map(encoders.listDate).join(options.matrixDelimiter),

    // ------- PERIOD-------
    period: (value) => !isArray(value) ? null : value.map(encoders.date).join(options.listDelimiter),
    comparePeriod: (value) => !isArray(value) ? null : value.map(encoders.listDate).join(options.matrixDelimiter),

    // ------- BOOL-------
    bool: (value) => !!value ? '1' : '0',
    listBool: (value) => !isArray(value) ? null : value.map(encoders.bool).join(options.listDelimiter),
    matrixBool: (value) => !isArray(value) ? null : value.map(encoders.listBool).join(options.matrixDelimiter)
  };

  return encoders;
};

let addUrlRules = (addRule, options) => {
  let decoders = createDecoders(options);
  let encoders = createEncoders(options);

  // ------ NUMBER -----
  let num = {
    decode: decoders.num,
    encode: encoders.num
  };

  addRule(primitives.Num, num);
  addRule(primitives.MaybeNum, num);
  addRule(primitives.ListNum, num);

  addRule(primitives.Int, num);
  addRule(primitives.MaybeInt, num);
  addRule(primitives.ListInt, num);

  let numList = {
    decode: decoders.listNum,
    encode: encoders.listNum
  };

  addRule(primitives.ListNum, numList);
  addRule(primitives.MaybeListNum, numList);
  addRule(primitives.MaybeListInt, numList);

  let matrixNum = {
    encode: encoders.matrixNum,
    decode: decoders.matrixNum
  };

  addRule(primitives.MatrixNum, matrixNum);
  addRule(primitives.MatrixMaybeNum, matrixNum);

  // ------ STRING -----
  let str = {
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
  let date = {
    decode: decoders.date,
    encode: encoders.date
  };

  addRule(primitives.Dat, date);
  addRule(primitives.MaybeDat, date);

  let listDate = {
    decode: decoders.listDate,
    encode: encoders.listDate
  };

  addRule(primitives.ListDat, listDate);
  addRule(primitives.MaybeListDat, listDate);

  let matrixDate = {
    decode: decoders.matrixDate,
    encode: encoders.matrixDate
  };

  addRule(primitives.MatrixDate, matrixDate);
  addRule(primitives.MatrixMaybeDate, matrixDate);


  // ------- PERIOD-------

  addRule(primitives.Period, {
    decode: decoders.period,
    encode: encoders.period
  });
  addRule(primitives.ComparePeriod,  {
    decode: decoders.comparePeriod,
    encode: encoders.comparePeriod
  });

  // ------ BOOL-----
  let bool = {
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

    let serializeOptions = {
      listDelimiter: options.listDelimiter || '~',
      matrixDelimiter: options.matrixDelimiter || '!',
      dateFormat: options.dateFormat || 'YYYYMMDD',
      conditionDelimiter: options.conditionDelimiter || ';'
    };

    addUrlRules((struct, description) => {
      this.addRule(struct, description);
    }, serializeOptions);
  }

  isEncodeAllowed(key, value) {
    return true;
    //return value && value.length;
  }

  decode(params) {
    for (let key of Object.keys(params)) {
      if (!isString(params[key])) {
        throw new Error('URL param should be String');
      }
    }
    return super.decode(params);
  }
}
