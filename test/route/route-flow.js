import { expect } from 'chai';

import RouteFlow from '../../src/route/route-flow';

var controllerName = 'valent.controller';
var applicationName = 'valent';
var template = '<div>Hello World</div>';

describe('Route flow', () => {
  it('should be a function', () => {
    expect(RouteFlow).to.be.a('function');
  });

  it('should contain RouteModel', () => {
    var routeFlow = new RouteFlow(controllerName);
    expect(routeFlow.model).to.be.an('object');
  });

  it('should throw Error is controller name is not described', () => {
    expect(() => new RouteFlow()).to.throw(Error);
  });

  it('should throw exception if both template and templateUrl are defined', () => {
    var routeFlow = new RouteFlow(controllerName);

    expect(() => routeFlow
      .template(template)
      .templateUrl('/template/url.html')).to.throw(Error);
  });

  it('should contain RouteModel with correct values', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .at(applicationName)
      .url('/home')
      .url('/home/:state')
      .resolver('access.guest', () => 'granted')
      .resolver('access.admin', () => 'rejected')
      .template(template);

    var model = routeFlow.model;

    expect(model.getUrls()).to.an('array');
    expect(model.getUrls()).to.eql(['/home', '/home/:state']);
    expect(model.getResolvers()).to.be.an('object');
    expect(model.getResolvers()).have.all.keys(['access.guest', 'access.admin']);
    expect(model.getTemplate()).to.equal(template);
  });

  it('should correctly setup custom urlBuilder', () => {
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
