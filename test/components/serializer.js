import { expect } from 'chai';

import Serializer from '../../src/serializers/serializer';

import * as primitives from '../../src/utils/primitives';
import t from 'tcomb';

var optionItem = t.struct({
  id: t.Num,
  value: t.Str,
});

var optionList = t.list(optionItem);

describe('Seriazlier', () => {
  var struct = t.struct({
    id: t.Num,
    options: optionList,
  });

  var serializer = new Serializer(struct);

  serializer.addRule(t.Num, {
    encode: value => {
      return `@${value}`;
    },
    decode: value => {
      return parseInt(value.slice(1));
    },
  });

  serializer.addRule(optionList, {
    encode: value => {
      return value
        .map(item => {
          return item.id + '|' + item.value;
        })
        .join('~');
    },
    decode: value => {
      return value.split('~').map(item => {
        var splited = item.split('|');
        return {
          id: parseInt(splited[0]),
          value: splited[1],
        };
      });
    },
  });

  it('should correctly encode data', () => {
    var encoded = serializer.encode({
      id: 1,
      options: [
        {
          id: 1,
          value: 'active',
        },
        {
          id: 2,
          value: 'opened',
        },
      ],
    });

    expect(encoded).to.be.eql({
      id: '@1',
      options: '1|active~2|opened',
    });
  });

  it('should correctly decode data', () => {
    var encoded = serializer.decode({
      id: '@1',
      options: '1|active~2|opened',
    });

    expect(encoded).to.be.eql({
      id: 1,
      options: [
        {
          id: 1,
          value: 'active',
        },
        {
          id: 2,
          value: 'opened',
        },
      ],
    });
  });
});
