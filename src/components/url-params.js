import UrlPattern from 'url-pattern';
import UrlSerializer from './url-serializer';
import pluck from 'lodash/collection/pluck';

var local ={
  pattern: Symbol('pattern'),
  urlPattern: Symbol('url-pattern'),

  urlParamsKeys: Symbol('url-params-key'),
  queryParamsKeys: Symbol('query-params-key')
};

export default class UrlParams extends UrlSerializer {
	constructor(pattern, struct) {
    super(struct);

    var urlPattern = new UrlPattern(pattern);

    this[local.pattern] = pattern;
    this[local.urlPattern] = urlPattern;

    var urlParams = urlPattern.ast.filter(item => item.tag === 'named')
      .map(item => item.value);

    var queryParams = [];

    for (var key of Object.keys(struct)) {
      if (urlParams.indexOf(key) === -1) {
        queryParams.push(key);
      }
    }

    this[local.queryParamsKeys] = queryParams;
    this[local.urlParamsKeys] = urlParams;
 	}

  getPattern() {
    return this[local.pattern];
  }

  getUrlPattern() {
    return this[local.urlPattern];
  }

  getUrlParamKeys() {
    return this[local.urlParamsKeys];
  }

  getQueryParamKeys() {
    return this[local.queryParamsKeys];
  }

  encodeQueryString(params) {
    var parts = [];

    for (var param of Object.keys(params)) {
      var value = params[param];
      var part = `${param}=${encodeURIComponent(value)}`;

      parts.push(part);
    }

    return parts.join('&');
  }

  decodeQueryString(queryString) {
    var queryParams = {};
    var queryPairs = queryString.split('&');

    for (var pair of queryPairs) {
      var splitedPair = pair.split('=');
      var key = splitedPair[0];
      var value = splitedPair.slice(1).join('');

      queryParams[key] = decodeURIComponent(value);
    }

    return queryParams;
  }

  go(params) {
    var encoded = this.encode(encodeParams);
  }

  encode(params) {
    var urlParamKeys = this.getUrlParamKeys();

    var queryParams = {};
    var urlParams = {};

    for (var key of Object.keys(params)) {
      if (urlParamKeys.indexOf(key) === -1) {
        queryParams[key] = params[key];
      } else {
        urlParams[key] = params[key];
      }
    }

    var urlPattern = this.getUrlPattern();
    var url = urlPattern.stringify(urlParams);

    var encodedQueryParams = super.encode(queryParams);
    var query = this.encodeQueryString(encodedQueryParams);

    return [url, query].join('?');
  }

  parse() {
    var path = window.location.pathname.split('?');
    return this.decode(path);
  }

  decodeQueryParams(queryParams) {
    var query = this.decodeQueryString(queryParams);
    return super.decode(query);
  }

  decode(path) {
    var splitedPath = path.split('?');

    var url = splitedPath[0];

    var urlPattern = this.getUrlPattern();
    var urlParams = urlPattern.match(url);

    if (!urlParams) {
      throw new Error(`Wrong url pattern. Expected "${this.getPattern()}" got "${path}"`);
    }

    var queryParams = {};
    var queryString = splitedPath[1];

    if (queryString) {
      queryParams = this.decodeQueryString(queryString);
    }

    var params = Object.assign(urlParams, queryParams);
    return super.decode(params);
  }
}
