import { expect } from 'chai';

import { RouteConfig } from '../../src/route/route-config';
import routeConfig from '../../src/route/route-config';


describe('Route Config', () => {
  it('should be an object', () => {
    expect(routeConfig).to.be.an('object');
  });

  it('should have default values', () => {
    var routeConfig = new RouteConfig();

    expect(routeConfig.getBase()).to.equal(null);
    expect(routeConfig.isHtml5Mode()).to.equal(true);
    expect(routeConfig.getOtherwise()).to.equal(null);
  });

  it('should return correct custom setting values', () => {
    var routeConfig = new RouteConfig();

    routeConfig.setBase('/test');
    routeConfig.disableHtml5Mode();

    routeConfig.addResolver('access.guest', () => {});
    routeConfig.addResolver('access.admin', () => {});

    expect(routeConfig.getBase()).to.equal('/test');
    expect(routeConfig.isHtml5Mode()).to.equal(false);

    expect(routeConfig.getResolvers()).to.be.an('object');
    expect(routeConfig.getResolvers()).have.all.keys(['access.guest', 'access.admin']);
  });

  it('should accept otherwise as string', () => {
    var routeConfig = new RouteConfig();

    routeConfig.setOtherwise('/404.html');

    expect(routeConfig.getOtherwise()).to.eql('/404.html');
  });

  it('should accept otherwise as RouteModel instance', () => {
    var routeConfig = new RouteConfig();

    routeConfig.setOtherwise('/404.html');

    expect(routeConfig.getOtherwise()).to.eql('/404.html');
  });

  it('should not accept otherwise as object', () => {
    var routeConfig = new RouteConfig();

    expect(() => routeConfig.setOtherwise({
      template: '404.html',
      controller: 'application.not-found.controller'
    })).to.throw(Error);
  });
});
