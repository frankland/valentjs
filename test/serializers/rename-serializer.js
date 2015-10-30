import { expect } from 'chai';
import testUtils from '../test-utils'
import RenameSerializer from '../../src/serializers/rename-serializer';
//import t from 'tcomb';
import * as primitives  from '../../src/utils/primitives';


describe('RenameSerializer', () => {

  var struct = {
    someKey: ['s', primitives.ListNum],
    otherKey: ['o', primitives.Str]
  };
  var serializer = new RenameSerializer(struct);

  serializer.addRule(primitives.ListNum, {
    encode: (value) => {
      value.push('!');
      return value;
    },
    decode: (value) => {
      value.pop();
      return value;
    }
  });

  serializer.addRule(primitives.Str, {
    encode: (value) => {
      return '-' + value;
    },
    decode: (value) => {
      return value.substr(1);
    }
  });


  it('should throw if called without params', () => {
    expect(() => {
      new RenameSerializer();
    }).to.throw(Error);
  });

  it('should have defaults', () => {
    expect(serializer.renameOptions).to.be.an('Object');
  });

  describe('#getOriginalName', () => {

    it('should get original name', () => {
      expect(serializer.getOriginalName('s')).to.be.eql('someKey');
      expect(serializer.getOriginalName('sk')).to.be.eql(null);
    });

    it('should throw if "renamed" is not a string', () => {
      for (let wrongKey of testUtils.getTestDataFor('str')) {
        expect(() => {
          serializer.getOriginalName(wrongKey);
        }).to.throw(Error);
      }
    });

  });

  describe('#encode', () => {

    it('should encode correctly', () => {
      var params = {
        someKey: [1, 2, 3],
        otherKey: 'Foo'
      };

      expect(serializer.encode(params)).to.be.eql({
        s: [1, 2, 3, '!'],
        o: '-Foo'
      });
    });

    it('should throw if struct is wrong', () => {
      expect(() => {
        serializer.encode({someKey: [1, '']});
      }).to.throw(Error);
    });

  });

  describe('#decode', () => {

    it('should decode correctly', () => {
      expect(serializer.decode({
        s: [1, 2, 3, '!'],
        o: '-Foo'
      })).to.be.eql({
        someKey: [1, 2, 3],
        otherKey: 'Foo'
      });
    });

    it('should throw if struct is wrong', () => {

      expect(() => {
        serializer.encode({someKey: [1, '']});
      }).to.throw(Error);
    });

  });

});