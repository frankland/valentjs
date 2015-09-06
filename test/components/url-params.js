import { expect } from 'chai';

import * as primitives from '../../src/utils/struct-primitives';
import t from 'tcomb';

import UrlParams from '../../src/components/url-params';

describe('Url params', () => {
  var urlStruct = {
    id: primitives.Num,
    tags: primitives.ListNum,
    q: primitives.Str
  };

  var urlParams = new UrlParams('/api/user/:id', urlStruct);

  it('should encode correctly', () => {
    var url = urlParams.encode({
      id: 1,
      tags: [1,2,3],
      q: 'Yo'
    });

    expect(url).to.be.equal('/api/user/1?tags=1~2~3&q=Yo');
  });


  it('should decode correctly', () => {
    var url = urlParams.decode('/api/user/1?tags=1~2~3&q=Yo');

    expect(url).to.eql({
      id: 1,
      tags: [1,2,3],
      q: 'Yo'
    });
  });

  it('should throw error if key does not exist at url strcut', () => {
    expect(() => urlParams.decode('/api/user/1?UNEXISTING_AT_STRUCT=1~2~3&q=Yo')).to.throw(Error);
  });

  it('should throw error if url is not match pattern', () => {
    expect(() => urlParams.decode('/test')).to.throw(Error);
  });
});
