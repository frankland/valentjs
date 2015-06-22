import { expect } from 'chai';

import UrlStruct from '../../src/components/url-struct';
import UrlSerializer from '../../src/components/url-serializer';

import * as primitives from '../../src/utils/struct-primitives';
import t from 'tcomb';

var UserStruct = t.struct({
  id: t.Num,
  name: t.Str,
  nickname: t.maybe(t.Str)
});

class CustomSerializer extends UrlSerializer {
  constructor(struct) {
    super(struct);

    this.addRule(UserStruct, {
      encode: () => {},
      decode: () => {}
    });
  }
}


describe('url struct', () => {
  it('cool encode', () => {
    var serializer = new UrlSerializer({
      apple: ['apl', primitives.Str],
      orange: primitives.Num,
      mango: primitives.ListNum,
      octarine: primitives.ListStr,
      octopus: primitives.ListDat,
      cat: ['c', primitives.Dat]
    });

    var encoded = serializer.encode({
      apple: 'a',
      orange: 1,
      mango: [1,2,3],
      octarine: ['a', 'b', 'c'],
      //octopus: [new Date(), new Date()],
      //cat: new Date()
    });

    expect(encoded).to.be.eql({
      apl: 'a',
      orange: '1',
      mango: '1~2~3',
      octarine: 'a~b~c',
      //octopus: '20150602~20150602',
      //c: '20150602'
    });
  });

  it('cool decode', () => {
    var serializer = new UrlSerializer({
      apple: ['apl', primitives.Str],
      orange: primitives.Num,
      mango: primitives.ListNum,
      octarine: primitives.ListStr,
      octopus: primitives.ListDat,
      cat: ['c', primitives.Dat]
    });

    var decoded = serializer.decode({
      apl: 'a',
      orange: '1',
      mango: '1~2~3',
      octarine: 'a~b~c',
      //octopus: '20150602~20150602',
      //c: '20150602'
    });

    expect(decoded).to.be.eql({
      apple: 'a',
      orange: 1,
      mango: [1,2,3],
      octarine: ['a', 'b', 'c'],
    });
  });

  it('custom serializer', () => {
    var urlSerializer = new CustomSerializer({
      a: primitives.Str,
      b: primitives.Num,
      c: primitives.ListNum,
      d: primitives.ListStr,
      e: primitives.ListDat,
      f: primitives.Dat
    });

    var urlStruct = new UrlStruct('/home/index');
    urlStruct.setSerializer(urlSerializer);
  });
});
