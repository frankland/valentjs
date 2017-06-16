import { expect } from 'chai';

import * as primitives from '../../src/utils/primitives';
import t from 'tcomb';

import RouteFlow from '../../src/route/route-flow';
import RouteConvert from '../../src/angular/converters/route-converter';

import Url from '../../src/components/url';

describe('Route url struct', () => {
  var urlSerializer = new Url('/test/serializer', {
    id: primitives.Num,
    name: primitives.Str,
  });

  Url.clear();
  Url.add('test.route', urlSerializer);

  it('should work encode correctly', () => {
    var url = Url.get('test.route');

    expect(
      url.stringify({
        id: 1,
        name: 'sads',
      })
    ).to.be.equal('/test/serializer?id=1&name=sads');
  });

  it('should work decode correctly', () => {
    var url = Url.get('test.route');

    expect(url.decode('/test/serializer?id=1&name=sads')).to.be.eql({
      id: 1,
      name: 'sads',
    });
  });
});
