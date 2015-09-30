import pluck from 'lodash/collection/pluck';
import isString from 'lodash/lang/isString';

import UrlPattern from 'url-pattern';

import UrlSerializer from './url-serializer';


var local = {
  pattern: Symbol('pattern'),
  mappings: Symbol('mappings'),
  urlPattern: Symbol('url-pattern'),

  urlParamsKeys: Symbol('url-params-key'),
  searchParamsKeys: Symbol('search-params-key')
};

var routes = new Map();

export default class Url extends UrlSerializer {

  static add(namespace, url) {
    if (!(url instanceof Url)) {
      throw new Error(`url for "${namespace}" should be instance of Url`);
    }

    routes.set(namespace, url);
  }

  static has(namespace) {
    return routes.has(namespace);
  }

  /**
   * TODO: add lazzy URL creating
   * @param namespace
   * @returns {*}
   */
  static get(namespace) {
    if (!isString(namespace)) {
      throw new Error(`Wrong arguments for Url.get`);
    }

    if (!routes.has(namespace)) {
      throw new Error('Url does not exists');
    }

    return routes.get(namespace);
  }

  static clear() {
    routes = new Map();
  }

  constructor(pattern, struct) {
    super(struct);

    var urlPattern = new UrlPattern(pattern);

    this[local.pattern] = pattern;
    this[local.urlPattern] = urlPattern;

    var urlParams = urlPattern.ast.filter(item => item.tag === 'named')
      .map(item => item.value);

    var searchParams = [];

    for (var key of Object.keys(struct)) {
      if (urlParams.indexOf(key) === -1) {
        searchParams.push(key);
      }
    }

    this[local.searchParamsKeys] = searchParams;
    this[local.urlParamsKeys] = urlParams;
    this[local.mappings] = {};
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

  getSearchParamKeys() {
    return this[local.searchParamsKeys];
  }

  encodeSearchString(params) {
    var parts = [];

    for (var param of Object.keys(params)) {
      var value = params[param];
      var part = `${param}=${encodeURIComponent(value)}`;

      parts.push(part);
    }

    return parts.join('&');
  }

  go(params) {
    var encoded = this.stringify(params);

    /**
     * TODO: check redirect method
     */
    window.location.replace(encoded);
  }

  // --------------------------------

  stringify(params) {
    var encodedParams = this.encode(params);

    var urlPattern = this.getUrlPattern();
    var urlParamKeys = this.getUrlParamKeys();

    var searchParams = {};
    var urlParams = {};

    for (var key of Object.keys(encodedParams)) {
      if (urlParamKeys.indexOf(key) === -1) {
        searchParams[key] = encodedParams[key];
      } else {
        urlParams[key] = encodedParams[key];
      }
    }

    var url = urlPattern.stringify(urlParams);
    var query = this.encodeSearchString(searchParams);

    return [url, query].join('?');
  }

  parse() {
    var pathname = window.location.pathname;
    var search = window.location.search;

    var url = pathname;
    if (search) {
      url += `?${search}`;
    }

    return this.decode(url);
  }

  decodeSearchString(queryString) {
    var queryParams = {};
    var queryPairs = queryString.split('&');

    for (var pair of queryPairs) {
      var tuple = pair.split('=');
      var key = tuple[0];
      var value = tuple.slice(1).join('');

      queryParams[key] = decodeURIComponent(value);
    }

    return queryParams;
  }

  decode(path) {
    var splittedPath = path.split('?');
    var searchString = splittedPath.slice(1).join('');

    var url = splittedPath[0];

    var urlPattern = this.getUrlPattern();
    var urlParams = urlPattern.match(url);

    if (!urlParams) {
      var pattern = this.getPattern();
      throw new Error(`Wrong url pattern. Expected "${pattern}", got "${path}"`);
    }

    var searchParams = {};

    if (searchString) {
      searchParams = this.decodeSearchString(searchString);
    }

    var params = Object.assign(urlParams, searchParams);
    return super.decode(params);
  }

  setMapping(key, mapper) {
    this[local.mappings][key] = mapper;
  }

  map() {
    var params = this.parse();
    var mappings = this[local.mappings];
    var tasks = [];

    for (var key of Object.keys(params)) {
      if (mappings.hasOwnProperty(key)) {
        var value = params[key];
        var callback = mappings[key];

        var mapping = callback(value);
        tasks.push(mapping);
      }
    }

    return Promise.all(tasks);
  }

  isEmpty() {
    var params = this.parse();
    return Object.keys(params).length == 0;
  }
}
