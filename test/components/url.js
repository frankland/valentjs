import { expect } from 'chai';

import * as primitives from '../../src/utils/struct-primitives';
import t from 'tcomb';

import Url from '../../src/components/url';

describe('Url params', () => {
  var urlStruct = {
    id: primitives.Num,
    tags: primitives.ListNum,
    q: primitives.Str
  };

  var url = new Url('/api/user/:id', urlStruct);

  it('should encode correctly', () => {
    var encodedUrl = url.stringify({
      id: 1,
      tags: [1,2,3],
      q: 'Yo'
    });

    expect(encodedUrl).to.be.equal('/api/user/1?tags=1~2~3&q=Yo');
  });


  it('should decode correctly', () => {
    var decodedUrl = url.decode('/api/user/1?tags=1~2~3&q=Yo');

    expect(decodedUrl).to.eql({
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
