import { expect } from 'chai';

import RouteFlow from '../../src/route/route-flow';

var controllerName = 'valent.controller';
var applicationName = 'valent';
var template = '<div>Hello World</div>';

describe('Route flow and model getters', () => {
  it('flow should be a function', () => {
    expect(RouteFlow).to.be.a('function');
  });

  it('model from flow should be an object', () => {
    var routeFlow = new RouteFlow(controllerName);
    expect(routeFlow.model).to.be.an('object');
  });

  it('flow without controller name should throw Error', () => {
    expect(() => new RouteFlow()).to.throw(Error);
  });

  it('flow should throw exception if template and templateUrl exists', () => {
    var routeFlow = new RouteFlow(controllerName);

    expect(() => routeFlow
      .template(template)
      .templateUrl('/template/url.html')).to.throw(Error);
  });

  it('flow and model', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .at(applicationName)
      .url('/home')
      .url('/home/:state')
      .resolve('access.guest', () => 'granted')
      .resolve('access.admin', () => 'rejected')
      .template(template);

    var model = routeFlow.model;

    expect(model.getUrls()).to.an('array');
    expect(model.getUrls()).to.eql(['/home', '/home/:state']);
    expect(model.getResolve()).to.be.an('object');
    expect(model.getResolve()).have.all.keys(['access.guest', 'access.admin']);
    expect(model.getTemplate()).to.equal(template);
  });

  it('url builder', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .url('/home')
      .urlBuilder((name) => {
        return `/user/${name}`;
      });

    var model = routeFlow.model;

    var urlBuilder = model.getUrlBuilder();

    expect(urlBuilder('valent')).to.equal('/user/valent');
  });
});
