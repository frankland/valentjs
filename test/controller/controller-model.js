import { expect } from 'chai';

import ControllerModel from '../../src/controller/controller-model';
import RouteModel from '../../src/route/route-model';

var controllerName = 'valent.controller';
var applicationName = 'valent';
var applicationName2 = 'valent.route';

var template = '<div>Hello World</div>';

describe('Controller model', () => {
  it('controller and route application name (first set controller model)', () => {
    var controllerModel = new ControllerModel('home.dashboard');
    controllerModel.setApplicationName(applicationName);

    controllerModel.addUrl('/home/dashboard');

    var routeModel = controllerModel.getRoute();

    expect(routeModel.getApplicationName()).to.be.equal(applicationName);
    expect(controllerModel.getApplicationName()).to.be.equal(applicationName);
  });

  it('controller and route application name (first create route for controller)', () => {
    var controllerModel = new ControllerModel('home.dashboard');

    controllerModel.addUrl('/home/dashboard');

    var routeModel = controllerModel.getRoute();

    controllerModel.setApplicationName(applicationName);

    expect(routeModel.getApplicationName()).to.be.equal(applicationName);
    expect(controllerModel.getApplicationName()).to.be.equal(applicationName);
  });

  it('controller and route as separated model', () => {
    var controllerModel = new ControllerModel('home.dashboard');
    var routeModel = new RouteModel('home.dashboard');

    controllerModel.setRoute(routeModel);
    controllerModel.setApplicationName(applicationName);

    expect(routeModel.getApplicationName()).to.be.equal(applicationName);
    expect(controllerModel.getApplicationName()).to.be.equal(applicationName);
  });

  it('controller and route as separated model', () => {
    var controllerModel = new ControllerModel('home.dashboard');
    var routeModel = new RouteModel('home.dashboard');

    controllerModel.setApplicationName(applicationName);
    routeModel.setApplicationName(applicationName2);

    controllerModel.setRoute(routeModel);

    expect(controllerModel.getApplicationName()).to.be.equal(applicationName);
    expect(routeModel.getApplicationName()).to.be.equal(applicationName2);
  });
});
