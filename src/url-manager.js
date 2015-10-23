import isFunction from 'lodash/lang/isFunction';

export default class UrlManager extends Map {
  constructor(options) {
    super();
  }

  get(name) {
    let url = super.get(name);
    if (isFunction(url)) {
      url = url();
      this.set(name, url);
    }

    return url;
  }
}
