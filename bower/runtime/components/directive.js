import Component from './component';
import Controller from './controller';


function camelCase(input) {
  return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

function getTemplateUrl(name){
  return name + '.html';
}

class Directive extends Component{

  constructor(name) {
    super(camelCase(name));

    var templateUrl = getTemplateUrl(name);
    this.templateUrl(templateUrl);

    this.config.restrict = 'E';
    this.config.replace = true;
    this.config.scope = {};

    this.config.controller = new Controller();
  }

  dependencies(dependencies) {

    this.config.controller.dependencies(dependencies);
    return this;
  }

  defaults(defaults) {

    this.config.controller.defaults(defaults);
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

  link(link) {

    this.config.link = link;
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
}

export default Directive;
