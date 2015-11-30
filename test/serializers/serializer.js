import { expect } from 'chai';
import testUtils from '../test-utils'
import Serializer from '../../src/serializers/serializer';
import * as primitives  from '../../src/utils/primitives';

import t from 'tcomb';

describe('Serializer', () => {

  var struct = {
    id: primitives.Num,
    options: primitives.ListStr
  };



  let serializer = new Serializer(struct);

  serializer.addRule(t.Num, {
    encode: (value) => {
      return `@${value}`;
    },
    decode: (value) => {
      return parseInt(value.slice(1));
    }
  });

  serializer.addRule(primitives.ListStr, {
    encode: (value) => {
      return value.map((item) => {
        return item;
      }).join('~');
    },
    decode: (value) => {
      return value.split('~').map((item) => {
        return item
      });
    }
  });
  
  it('should have defaults', () => {
    expect(serializer.getStruct()).to.be.eql(struct);
    expect(serializer.getRules()).to.instanceof(WeakMap);

  });

  describe('addRule', () => {
    var srlz = new Serializer(struct);

    it('should add rule correctly', () => {
      srlz.addRule(t.Num, {
        encode: value => {
          return `@${value}`;
        },
        decode: value => {
          return parseInt(value.slice(1));
        }
      })
    });

    it('should throw error if encode rule is not specified', () => {
      expect(() => {
        srlz.addRule(t.Str, {
          encode: value => {
            return `@${value}`;
          }
        });
      }).to.throw(Error);
    });

    it('should throw error if decode rule is not specified', () => {
      expect(() => {
        srlz.addRule(t.Str, {
          decode: value => {
            return parseInt(value.slice(1));
          }
        });
      }).to.throw(Error);
    });

    it('should throw error if namespace is not specified', () => {
      expect(() => {
        srlz.addRule();
      }).to.throw(Error);
    });

  });

  describe('encode', () => {

    it('should encode correctly', () => {
      var encoded = serializer.encode({id: 5, options: ['a', 'b', 'c']});

      expect(encoded).to.be.eql({
        id: '@5',
        options: 'a~b~c'
      });

    });

    it('should encode params with extra key correctly', () => {
      expect(serializer.encode({id: 3, wrongKey: []})).to.be.eql({id: '@3'});
    });

    it('should throw error if struct param type is wrong', () => {
      expect(() => {
        serializer.encode({id: 3, options: ''});
      }).to.throw(Error);
    });

  });

  describe('decode', () => {

    it('should decode correctly', () => {
      expect(serializer.decode({
        id: '@5',
        options: 'a~b~c'
      })).to.be.eql({id: 5, options: ['a', 'b', 'c']});
    });

    it('should decode string with extra key correctly', () => {
      expect(serializer.decode({id: '@2', wrongKey: '@2'})).to.be.eql({id: 2});
    });

  });

});