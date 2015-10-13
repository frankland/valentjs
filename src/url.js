import isString from 'lodash/lang/isString';
import isObject from 'lodash/lang/isObject';

import UrlPattern from 'url-pattern';

import UrlSerializer from './serializers/url-serializer';


let _pattern = Symbol('pattern');
let _mappings = Symbol('mappings');
let _urlPattern = Symbol('url-pattern');
let _urlParamsKeys = Symbol('url-params-key');
let _searchParamsKeys = Symbol('search-params-key');

let routes = new Map();

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

    let urlPattern = new UrlPattern(pattern);

    this[_pattern] = pattern;
    this[_urlPattern] = urlPattern;

    let urlParams = urlPattern.ast.filter(item => item.tag === 'named')
      .map(item => item.value);

    let searchParams = [];

    for (let key of Object.keys(struct)) {
      if (urlParams.indexOf(key) === -1) {
        searchParams.push(key);
      }
    }

    this[_searchParamsKeys] = searchParams;
    this[_urlParamsKeys] = urlParams;
    this[_mappings] = {};
  }

  getPattern() {
    return this[_pattern];
  }

  getUrlPattern() {
    return this[_urlPattern];
  }

  getUrlParamKeys() {
    return this[_urlParamsKeys];
  }

  getSearchParamKeys() {
    return this[_searchParamsKeys];
  }

  encodeSearchString(params) {
    let parts = [];

    for (let param of Object.keys(params)) {
      let value = params[param];
      let part = `${param}=${encodeURIComponent(value)}`;

      parts.push(part);
    }

    return parts.join('&');
  }

  go(params = {}) {
    if (!isObject(params)) {
      throw new Error('params should be an object');
    }

    let encoded = this.stringify(params);

    /**
     * TODO: check redirect method
     */
    window.location.replace(encoded);
  }

  // --------------------------------

  stringify(params) {
    let encodedParams = this.encode(params);

    let urlPattern = this.getUrlPattern();
    let urlParamKeys = this.getUrlParamKeys();

    let searchParams = {};
    let urlParams = {};

    for (let key of Object.keys(encodedParams)) {
      if (urlParamKeys.indexOf(key) === -1) {
        searchParams[key] = encodedParams[key];
      } else {
        urlParams[key] = encodedParams[key];
      }
    }

    let url = urlPattern.stringify(urlParams);
    let query = this.encodeSearchString(searchParams);

    return query ? [url, query].join('?') : url;
  }

  parse() {
    let pathname = window.location.pathname;
    let search = window.location.search;

    let url = pathname;
    if (search) {
      url += `?${search}`;
    }

    return this.decode(url);
  }

  decodeSearchString(queryString) {
    let queryParams = {};
    let queryPairs = queryString.split('&');

    for (let pair of queryPairs) {
      let tuple = pair.split('=');
      let key = tuple[0];
      let value = tuple.slice(1).join('');

      queryParams[key] = decodeURIComponent(value);
    }

    return queryParams;
  }

  decode(path) {
    let splittedPath = path.split('?');
    let searchString = splittedPath.slice(1).join('');

    let url = splittedPath[0];

    let urlPattern = this.getUrlPattern();
    let urlParams = urlPattern.match(url);

    if (!urlParams) {
      let pattern = this.getPattern();
      throw new Error(`Wrong url pattern. Expected "${pattern}", got "${path}"`);
    }

    let searchParams = {};

    if (searchString) {
      searchParams = this.decodeSearchString(searchString);
    }

    let params = Object.assign(urlParams, searchParams);
    return super.decode(params);
  }

  setMapping(key, mapper) {
    this[_mappings][key] = mapper;
  }

  map() {
    let params = this.parse();
    let mappings = this[_mappings];
    let tasks = [];

    for (let key of Object.keys(params)) {
      if (mappings.hasOwnProperty(key)) {
        let value = params[key];
        let callback = mappings[key];

        let mapping = callback(value);
        tasks.push(mapping);
      }
    }

    return Promise.all(tasks);
  }

  isEmpty() {
    let params = this.parse();
    return Object.keys(params).length == 0;
  }
}
