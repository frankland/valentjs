import { expect } from 'chai';
import cloneDeep from 'lodash/lang/cloneDeep';
import testUtils from '../test-utils'
import UrlSerializer from '../../src/serializers/url-serializer';
import * as primitives  from '../../src/utils/primitives';


describe('UrlSerializer', () => {

  var struct = {
    id: primitives.Num,
    foo: ['f', primitives.ListNum],
    bar: ['b', primitives.Str]
  };

  var serializer = new UrlSerializer(struct);

  var original = {
    id: 42,
    foo: [1,2,3,5,8,13,21,34],
    bar: 'param'
  };

  var converted = {
    id: '42',
    f: '1~2~3~5~8~13~21~34',
    b: 'param'
  };

  describe('encode', () => {

    it('should encode params to link correctly', () => {
      expect(serializer.encode(original)).to.be.eql(converted);
    });

    it('should ignore not provided in struct keys', () => {
      var fakeOriginal = cloneDeep(original);
      fakeOriginal.extra = '';
      expect(serializer.encode(fakeOriginal)).to.be.eql(converted);
    });

    it('should throw error if struct is wrong', () => {
      var fakeOriginal = cloneDeep(original);
      fakeOriginal.id = 'WROOOONG!!';

      expect(() => {
        serializer.encode(fakeOriginal);
      }).to.throw(Error);
    });

  });

  describe('decode', () => {

    it('should decode link correctly', () => {
      expect(serializer.decode(converted)).to.be.eql(original);
    });

    it('should throw error if extra key', () => {
      var fakeConverted = cloneDeep(converted);
      fakeConverted.extra = '';
      expect(() => {
        serializer.decode(fakeConverted)
      }).to.throw(Error);
    });

    it('should throw error if struct is wrong', () => {
      var fakeConverted = cloneDeep(converted);
      fakeConverted.id = [];
      expect(() => {
        serializer.decode(fakeConverted);
      }).to.throw(Error);
    });

  });

});