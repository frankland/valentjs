import { expect } from 'chai';

import ControllerFlow from '../../src/controller/controller-flow';

var controllerName = 'valent.controller';
var applicationName = 'valent';
var template = '<div>Hello World</div>';

class ValentController {
}


describe('Controller flow and model getters', () => {
  it('flow should be a function', () => {
    expect(ControllerFlow).to.be.a('function');
  });

  it('flow without controller name should throw Error', () => {
    expect(() => new ControllerFlow()).to.throw(Error);
  });

  it('flow should throw exception if template and templateUrl exists (RouteFlow behaviour)', () => {
    var controllerFlow = new ControllerFlow(controllerName);

    expect(() => controllerFlow
      .template(template)
      .templateUrl('/template/url.html')).to.throw(Error);
  });

  it('flow and model', () => {
    var controllerFlow = new ControllerFlow(controllerName);

    controllerFlow
      .at(applicationName)
      .src(ValentController)
      .url('/home/dashboard')
      .resolver('access.guest', () => true)
      .resolver('access.admin', () => false)
      .template(template);

    var controllerModel = controllerFlow.model;
    var routeModel = controllerModel.getRoute();

    expect(controllerModel.hasRoute()).to.equal(true);
    expect(controllerModel.getApplicationName()).to.equal(applicationName);
    expect(controllerModel.getSource()).to.eql(ValentController);

    //expect(controllerModel.getDependencies()).to.be.an('array');
    //expect(controllerModel.getDependencies()).to.eql(['access.guest', 'access.admin']);

    expect(routeModel.getApplicationName()).to.equal(applicationName);
    expect(routeModel.getUrls()).to.be.an('array');
    expect(routeModel.getUrls()).to.eql(['/home/dashboard']);

    expect(routeModel.getResolvers()).to.be.an('object');
    expect(routeModel.getResolvers()).have.all.keys(['access.guest', 'access.admin']);

    expect(routeModel.getTemplate()).to.be.equal(template);
  });
});
