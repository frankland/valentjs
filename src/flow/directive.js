import Component from '../components/flow-component';
import Controller from './controller';

function camelCase(input) {
  return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

class Directive extends Component {

  constructor(name) {
    var directiveName = camelCase(name);
    super(directiveName);

    this.config.restrict = 'E';
    this.config.replace = true;
    this.config.scope = {};

    this.controllerName = `<${name}>`;
    this.config.controller = new Controller(this.controllerName);
  }

  dependencies(dependencies) {

    this.config.controller.dependencies(dependencies);
    return this;
  }

  defaults(defaults) {

    this.config.controller.defaults(defaults);
    return this;
  }

  transclude() {
    this.config.transclude = true;

    return this;
  }

  scope(scope) {

    this.config.scope = scope;
    return this;
  }

  restrict(restrict) {

    this.config.restrict = restrict;
    return this;
  }

  stateModel(stateModel){
    this.config.stateModel = stateModel;
    return this;
  }

  hasNgModel() {
    this.config.withNgModel = true;

    return this;
  }

  controller(controller) {

    this.config.controller.src(controller);
    return this;
  }

  template(template) {
    this.config.template = template;
    return this;
  }

  templateUrl(template) {
    this.config.templateUrl = template;
    return this;
  }

  logInfo() {
    var group = `${this.controllerName} at ${this.module}`;

    console.groupCollapsed(group);

    console.log(`restrict: ${this.config.restrict}`);
    console.log(`replace: ${this.config.replace}`);

    if (!!Object.keys(this.config.scope).length) {
      console.log(`scope:`, this.config.scope);
    }

    /**
     * TODO: add getters
     */
    if (!!Object.keys(this.config.controller.config.defaults).length) {
      console.log(`defaults:`, this.config.controller.config.defaults);
    }

    if (this.config.templateUrl) {
      console.log(`templateUrl: ${this.config.templateUrl}`);
    } else if (this.config.template) {
      console.log(`template: ${this.config.template.slice(0, 50).replace(/\n|\r|\r\n/mg, '')}`);
    } else {
      console.log(`template is wrong`);
    }

    console.groupEnd(group);
  }
}

export default Directive;
