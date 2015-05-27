import { expect } from 'chai';

import ObjectTransition from '../../src/utils/object-transition';


describe('Object transition', () => {
  it('commit without push', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(o1).to.eql({});
  });

  it('push', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    objectTransition.push();

    expect(o1).to.eql({
      foo: {
        bar: 1
      },
      test: 2
    });
  });

  it('push and commit', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.push('foo.bar', 3);

    expect(o1).to.eql({
      foo: {
        bar: 3
      }
    });
  });

  it('clear', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    objectTransition.clear();

    objectTransition.push();

    expect(o1).to.eql({});
  });

  it('state has', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(objectTransition.has('foo.bar')).to.equal(true);
    expect(objectTransition.has('test')).to.equal(true);
    expect(objectTransition.has('foo2')).to.equal(false);
  });

  it('state has', () => {
    var o1 = {};
    var objectTransition = new ObjectTransition(o1);

    objectTransition.commit('foo.bar', 1);
    objectTransition.commit('test', 2);

    expect(objectTransition.get('foo.bar')).to.equal(1);
    expect(objectTransition.get('test')).to.equal(2);
    expect(objectTransition.get('foo2')).to.equal(undefined);
  });
});
