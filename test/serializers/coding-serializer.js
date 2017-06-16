import { expect } from 'chai';
import testUtils from '../test-utils';
import CodingSerializer from '../../src/serializers/coding-serializer';
import * as primitives from '../../src/utils/primitives';

describe('CodingSerializer', () => {
  describe('addAlias', () => {
    it('should add alias', () => {
      CodingSerializer.addAlias('string', primitives.Str);
      expect(CodingSerializer.getStruct('string')).to.be.eql(primitives.Str);
    });

    it('should add rules', () => {
      var rules = {
        encode: value => {
          return value;
        },
        decode: value => {
          return value;
        },
      };
      CodingSerializer.addAlias('int', primitives.Int, rules);
      expect(CodingSerializer.getRule('int')).to.be.eql(rules);
    });

    it('should throw error if alias is not String', () => {
      for (let key of testUtils.getTestDataFor('str')) {
        expect(() => {
          CodingSerializer.addAlias(key, primitives.Str, {
            encode: () => {},
            decode: () => {},
          });
        }).to.throw(Error);
      }
    });

    it('should throw error if struct is not an object', () => {
      for (let key of testUtils.getTestDataFor(['obj', 'array', 'fn'])) {
        expect(() => {
          CodingSerializer.addAlias('fakeAlias', key, {
            encode: () => {},
            decode: () => {},
          });
        }).to.throw(Error);
      }
    });

    it('should throw error if encode or decode rule is not specified', () => {
      var testRules = testUtils.getTestDataFor(['undef']);
      testRules.push({ encode: () => {} });
      testRules.push({ decode: () => {} });
      testRules.push({ encode: '', decode: () => {} });
      for (let rules of testRules) {
        expect(() => {
          CodingSerializer.addAlias('fakeAlias', primitives.Str, rules);
        }).to.throw(Error);
      }
    });
  });
});
