import { expect } from 'chai';

import RouteFlow from '../../src/route/route-flow';
import RouteConvert from '../../src/angular/converters/route-converter';
import { RouteConfig } from '../../src/route/route-config';

var controllerName = 'valent.controller';
var template = '<div>Hello World</div>';

describe('Route Convert', () => {
  it('convert route config with template', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .url('/home')
      .resolve('access.guest', () => 'granted')
      .template(template);

    var model = routeFlow.model;

    var config = RouteConvert.getConfig(model);
    expect(config).have.all.keys(['controller', 'reloadOnSearch', 'resolve', 'template']);

    expect(config.controller).to.equal(controllerName);
    expect(config.reloadOnSearch).to.equal(false);
    expect(config.resolve).to.be.an('object');
    expect(config.resolve).to.have.all.keys(['access.guest']);
    expect(config.template).to.equal(template);
  });

  it('convert route config with template', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .url('/home')
      .resolve('access.guest', () => 'granted')
      .templateUrl('/template/url.html');

    var model = routeFlow.model;

    var config = RouteConvert.getConfig(model);
    expect(config).have.all.keys(['controller', 'reloadOnSearch', 'resolve', 'templateUrl']);

    expect(config.templateUrl).to.equal('/template/url.html');
  });

  it('convert should throw error if no template or templateUrl', () => {
    var routeFlow = new RouteFlow(controllerName);

    routeFlow
      .url('/home');

    var model = routeFlow.model;

    expect(() => RouteConvert.getConfig(model)).to.throw(Error);
  });

  it('otherwise as string', () => {
    expect(RouteConvert.convertOtherwise('/404.html')).to.eql({
      redirectTo: '/404.html'
    });
  });

  it('otherwise as not object or string', () => {
    expect(() => RouteConvert.convertOtherwise([1, 2, 3])).to.throw(Error);
  });
});
