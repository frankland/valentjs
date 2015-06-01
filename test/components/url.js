import { expect } from 'chai';

import url from '../../src/components/url';
import { Url } from '../../src/components/url';

var query = {
  foo: 1,
  bar: 2
};


describe('url', () => {
  it('should be an object', () => {
    expect(url).to.be.an('object');
  });

  it('add url builder', () => {
    var url = new Url();
    url.add('home.index', (state) => `/home/index/${state}`);

    expect(url.get('home.index')).to.be.a('function');
  });

  it('url manager should throw exception if route is not defined', () => {
    var url = new Url();

    expect(() => url.get('home.index')).to.throw(Error);
  });

  it('url manager should throw exception if urlBuilder result is not object or string', () => {
    var url = new Url();

    url.add('home.index', () => []);

    var builder = url.get('home.index');
    expect(() => builder()).to.throw(Error);
  });

  it('url builder as function and return string', () => {
    var url = new Url();

    url.add('home.index', (state) => `/home/index/${state}`);

    var builder = url.get('home.index');
    expect(builder('active')).to.equal('/home/index/active');
  });

  it('url builder as function and return object', () => {
    var url = new Url();

    url.add('home.index', (state, query) => {
      return {
        url: `/home/index/${state}`,
        query
      }
    });

    var builder = url.get('home.index');
    expect(builder('active', query)).to.equal('/home/index/active?foo=1&bar=2');
  });

  it('url builder as string', () => {
    var url = new Url();

    url.add('home.index', '/home/index');

    var builder = url.get('home.index');
    expect(builder(query)).to.equal('/home/index?foo=1&bar=2');
  });
});
