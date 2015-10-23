import isString from 'lodash/lang/isString';
import isObject from 'lodash/lang/isObject';
import isEqual from 'lodash/lang/isEqual';

import UrlPattern from 'url-pattern';

import UrlSerializer from './serializers/url-serializer';

let decodeSearchString = (queryString) => {
  let queryParams = {};
  let queryPairs = queryString.split('&');

  for (let pair of queryPairs) {
    let tuple = pair.split('=');
    let key = tuple[0];
    let value = tuple.slice(1).join('');

    queryParams[key] = decodeURIComponent(value);
  }

  return queryParams;
};

let encodeSearchString = (params) => {
  let parts = [];

  for (let param of Object.keys(params)) {
    let value = params[param];
    let part = `${param}=${encodeURIComponent(value)}`;

    parts.push(part);
  }

  return parts.join('&');
};


let _pattern = Symbol('pattern');
let _links = Symbol('mappings');
let _urlPattern = Symbol('url-pattern');
let _urlParamsKeys = Symbol('url-params-key');
let _searchParamsKeys = Symbol('search-params-key');

let _serializer = Symbol('url-serializer');

//let routes = new Map();

/**
 * TODO: support HTML5 history API
 */
export default class Url {

  constructor(pattern, struct) {
    this[_serializer] =  new UrlSerializer(struct);

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
    this[_links] = {};
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
    let encodedParams = this[_serializer].encode(params);

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

    let urlPattern = this.getUrlPattern();

    let url = urlPattern.stringify(urlParams);
    let search = encodeSearchString(searchParams);

    return query ? [url, search].join('?') : url;
  }

  parse() {
    let url = window.location.pathname;

    let urlPattern = this.getUrlPattern();
    let urlParams = urlPattern.match(url);

    if (!urlParams) {
      let pattern = this.getPattern();
      throw new Error(`Wrong url pattern. Expected "${pattern}", got "${path}"`);
    }

    let searchParams = {};

    let search = window.location.search;
    if (search) {
      searchParams = decodeSearchString(search);
    }

    let params = Object.assign(urlParams, searchParams);

    return this[_serializer].decode(params);
  }

  isEmpty() {
    let params = this.parse();
    return Object.keys(params).length == 0;
  }

  isEqual(params = {}) {
    if (!isObject(params)) {
      throw new Error('params should be an object');
    }

    var existingParams = this.parse();

    return isEqual(existingParams, params);
  }

  // ---------------------

  link(key, link) {
    this[_links][key] = link;
  }

  apply() {
    let params = this.parse();
    let links = this[_links];
    let tasks = [];

    for (let key of Object.keys(params)) {
      if (links.hasOwnProperty(key)) {
        let value = params[key];
        let link = links[key];

        let task = link(value);
        tasks.push(task);
      }
    }

    return Promise.all(tasks);
  }
}
