import isString from 'lodash/lang/isString';
import UrlSerializer from './url-serializer';

var local = {
  url: Symbol('url'),
  params: Symbol('params'),
  serializer: Symbol('serializer')
};

export default class UrlStruct {
  constructor(url) {
    if (!isString(url)) {
      throw new Error('Constructor argument @url at UrlStruct should be string type');
    }

    this[local.url] = url;
  }

  setSerializer(serializer) {
    this[local.serializer] = serializer;
  }

  setParams(struct) {
    var serializer = new UrlSerializer(struct);
    this.setSerializer(serializer);
  }

  /**
   * Generate url according to params
   */
  build(params) {
    var serializer = this[local.serializer];
    return serializer.encode(this[local.url], params);
  }

  /**
   * Get current url params
   */
  parse(url) {
    var serializer = this[local.serializer];
    return serializer.decode(url);
  }
}
