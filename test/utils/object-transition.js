import { expect } from 'chai';

import ObjectTransition from '../../src/utils/object-transition';

describe('Object transition', () => {
  it('should not change source object without .push()', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(o1).to.eql({});
  });

  it('should change source object after .push()', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    objectTransition.push();

    expect(o1).to.eql({
      foo: {
        bar: 1,
      },
      test: 2,
    });
  });

  it('should change source object after .push() with arguments', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.push('foo.bar', 3);

    expect(o1).to.eql({
      foo: {
        bar: 3,
      },
    });
  });

  it('should clear all commits before push if .clear() was called', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    objectTransition.clear();

    objectTransition.push();

    expect(o1).to.eql({});
  });

  it('should check if commits contains key and return boolean', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(objectTransition.has('foo.bar')).to.equal(true);
    expect(objectTransition.has('test')).to.equal(true);
    expect(objectTransition.has('foo2')).to.equal(false);
  });

  it('should return value by key in commits', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(objectTransition.get('foo.bar')).to.equal(1);
    expect(objectTransition.get('test')).to.equal(2);
    expect(objectTransition.get('foo2')).to.equal(undefined);
  });
});
