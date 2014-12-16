import { ResolveTemplateUrl } from '../url-utils';

class Route {

  constructor(name) {

    this.module_name = name;
    this.config = {};

    this.config.base = '';
    this.config.resolve = {};
  }

  url(url) {
    this.config.url = url;
    return this;
  }

  base(url) {
    this.config.base = url;
  }

  resolve(key, expr) {
    this.config.resolve[key] = expr;
    return this;
  }

  controller(controller) {
    this.config.controller = controller;

    if (!this.config.templateUrl) {
      this.config.templateUrl = controller.split('.').pop() + '.html';
    }

    return this;
  }

  templateUrl(templateUrl) {
    this.config.templateUrl = templateUrl;

    return this;
  }

  template(template) {
    this.config.template = template;

    return this;
  }

  generate(generate) {
    this.config.generate = generate;

    return this;
  }

  path(modulePath, src, output, root) {
    this.paths = {
      modulePath: modulePath,
      src: src,
      output: output,
      root: root
    };

    return this;
  }

  statistics() {
    var group = 'Route for ' + this.config.base + this.config.url,
        resolve = Object.keys(this.config.resolve);


    console.group(group);
    console.log('controller: ' + this.config.controller);

    if (this.config.templateUrl) {
      console.log('templateUrl: ' + ResolveTemplateUrl(this));
    } else if (this.config.template) {
      console.log('template: ' + this.template.slice(1, 20));
    } else {
      console.log('template is wrong');
    }


    if (resolve.length) {
      console.log('resolve: ' + resolve);
    }
    console.groupEnd(group);
  }
}

export default Route;
