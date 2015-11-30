import isString from 'lodash/lang/isString';
import isObject from 'lodash/lang/isObject';
import isEqual from 'lodash/lang/isEqual';
import isArray from 'lodash/lang/isArray';

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

export default class Url {
  cache = {};

  constructor(pattern, struct) {
    let serializer = new UrlSerializer(struct);
    this[_serializer] = serializer;

    let urlPattern = new UrlPattern(pattern);

    this[_pattern] = pattern;
    this[_urlPattern] = urlPattern;

    let urlParams = urlPattern.ast.filter(item => item.tag === 'named')
      .map(item => item.value);

    let searchParams = [];

    for (let key of Object.keys(struct)) {
      if (urlParams.indexOf(key) === -1) {
        searchParams.push(key);
      } else {
        if (serializer.hasRenameOption(key)) {
          throw new Error('url params with placeholders cant have rename config');
        }
      }
    }

    this[_searchParamsKeys] = searchParams;
    this[_urlParamsKeys] = urlParams;
    this[_links] = {};

  }

  getSerializer() {
    return this[_serializer];
  }

  getStruct() {
    return this[_serializer].getStruct();
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

  // -----

  decode(path) {
    var splittedPath = path.split('?');
    var search = splittedPath.slice(1).join('');

    var url = splittedPath[0];

    let urlPattern = this.getUrlPattern();
    let urlParams = urlPattern.match(url);

    if (!urlParams) {
      let pattern = this.getPattern();
      throw new Error(`Wrong url pattern. Expected "${pattern}", got "${path}"`);
    }

    let searchParams = {};

    //let search = window.location.search;
    if (search) {
      searchParams = decodeSearchString(search);
    }

    let params = Object.assign(urlParams, searchParams);
    let decoded = this[_serializer].decode(params);

    this.cacheParams(decoded);

    return decoded;
  }

  // -----

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

    return search ? [url, search].join('?') : url;
  }

  parse() {
    /**
     * if there is no cached params - parse url. Otherwise - return cached params
     *
     * if (!Object.keys(this.cache)) {
     *
     * }
     * @type {string}
     */
    var pathname = window.location.pathname;
    var search = window.location.search;

    var url = pathname;
    if (search) {
      url += `?${search}`;
    }

    return this.decode(url);
  }

  cacheParams(params) {
    this.cache = params;
  }

  getCachedParams() {
    return this.cache;
  }

  clearCachedParams() {
    this.cache = {};
  }

  isEmpty() {
    // TODO: use cached params
    let params = this.parse();
    return Object.keys(params).length == 0;
  }

  isEqual(params = {}) {
    if (!isObject(params)) {
      throw new Error('params should be an object');
    }

    // TODO: use cached params
    let existingParams = this.parse();

    return isEqual(existingParams, params);
  }

  // ---------------------

  link(key, link) {
    this[_links][key] = link;
  }

  linkTo(store, params = []) {
    if (!isArray(params)) {
      throw new Error('available params for linkTo should be an array');
    }

    let struct = this.getStruct();

    for (let key of Object.keys(struct)) {
      if (!params.length || params.indexOf(key) != -1) {

        this.link(key, value => {
          Object.assign(store, {
            key: value
          });
        });
      }
    }
  }

  apply() {
    // TODO: use cached params
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
