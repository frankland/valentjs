import { expect } from 'chai';

import urlManager from '../../src/components/url';
import { UrlManager } from '../../src/components/url';

var query = {
  foo: 1,
  bar: 2
};


describe('urlManager', () => {
  it('should be an object', () => {
    expect(urlManager).to.be.an('object');
  });

  it('add url builder', () => {
    var urlManager = new UrlManager();
    urlManager.add('home.index', (state) => `/home/index/${state}`);

    expect(urlManager.get('home.index')).to.be.a('function');
  });

  it('url manager should throw exception if route is not defined', () => {
    var urlManager = new UrlManager();

    expect(() => urlManager.get('home.index')).to.throw(Error);
  });

  it('url manager should throw exception if urlBuilder result is not object or string', () => {
    var urlManager = new UrlManager();

    urlManager.add('home.index', () => []);

    var builder = urlManager.get('home.index');
    expect(() => builder()).to.throw(Error);
  });

  it('url builder as function and return string', () => {
    var urlManager = new UrlManager();

    urlManager.add('home.index', (state) => `/home/index/${state}`);

    var builder = urlManager.get('home.index');
    expect(builder('active')).to.equal('/home/index/active');
  });

  it('url builder as function and return object', () => {
    var urlManager = new UrlManager();

    urlManager.add('home.index', (state, query) => {
      return {
        url: `/home/index/${state}`,
        query
      }
    });

    var builder = urlManager.get('home.index');
    expect(builder('active', query)).to.equal('/home/index/active?foo=1&bar=2');
  });

  it('url builder as string', () => {
    var urlManager = new UrlManager();

    urlManager.add('home.index', '/home/index');

    var builder = urlManager.get('home.index');
    expect(builder(query)).to.equal('/home/index?foo=1&bar=2');
  });
});
