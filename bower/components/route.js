class Route {

  constructor(name){
    this.module_name = name;
    this.config = {};

    this.config.base = '';
    this.config.resolve = {};
  }

  url(url){
    this.config.url = url;
    return this;
  }

  base (url){
    this.config.base = url;
  }

  resolve(key, expr){
    this.config.resolve[key] = expr;
    return this;
  }

  controller(controller){
    this.config.controller = controller;

    if (!this.config.templateUrl){
      this.config.templateUrl = controller.split('.').pop() + '.html';
    }

    return this;
  }

  templateUrl(templateUrl){
    this.config.templateUrl = templateUrl;
  }

  template(template){
    this.config.template = template;
  }

  statistics(){
    var group = 'Route for ' + this.config.base + this.config.url,
      resolve = Object.keys(this.config.resolve);

    console.group(group);
    console.log('controller: ' + this.config.controller);
    console.log('template: ' + this.config.templateUrl);

    if (resolve.length){
      console.log('resolve: ' + resolve);
    }
    console.groupEnd(group);
  }

  path(modulePath, src, output, root){
    this.paths = {
      modulePath: modulePath,
      src: src,
      output: output,
      root: root
    };


    return this;
  }
}

export default Route;
