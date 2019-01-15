import { expect } from 'chai';

import ObjectDescription from '../../src/utils/object-description';

describe('Object description', () => {
  it('should create objects correctly', () => {
    var t1 = {
      'foo.bar': 1,
      'a.b.c.d': 2,
    };
    var t2 = {
      'bar.foo': 3,
    };

    var t3 = {
      'foo.bar': 2,
    };

    var o1 = ObjectDescription.create(t1, t2);
    var o2 = ObjectDescription.create(t2, t3);
    var o3 = ObjectDescription.create(t1, t2, t3);

    expect(o1).to.eql({
      foo: {
        bar: 1,
      },
      a: {
        b: {
          c: {
            d: 2,
          },
        },
      },
      bar: {
        foo: 3,
      },
    });

    expect(o2).to.eql({
      bar: {
        foo: 3,
      },
      foo: {
        bar: 2,
      },
    });

    expect(o3).to.eql({
      foo: {
        bar: 2,
      },
      a: {
        b: {
          c: {
            d: 2,
          },
        },
      },
      bar: {
        foo: 3,
      },
    });
  });
});
