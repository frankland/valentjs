import isFunction from 'lodahs/lang/isFunction';

let validate = (name, Component, options) => {
  let errors = [];

  if (!name || name.indexOf(' ') != -1) {
    errors.push('component\'s name could not be empty or contain spaces');
  }

  // --- VALIDATE COMPONENT CONSTRUCTOR -----
  if (!isFunction(Component)) {
    errors.push('controller should be a constructor');
  }

  // ----- VALIDATE TEMPLATES -----
  let template = options.template;
  let templateUrl = options.templateUrl;

  if (!template && !templateUrl && !isFunction(Component.render)) {
    errors.push('One of options.template, options.templateUrl or components\'s class static function "template()" should be defined');
  } else if (template) {

    if (!isString(template) && !isFunction(template)) {
      errors.push('template should be string or function');
    }

  } else if (templateUrl) {

    if (!isString(templateUrl)) {
      errors.push('templateUrl should be string');
    }
  }

  return errors;
};

export default class ValentComponent {
  constructor(name, Component, options) {
    let errors = validate(name, Component, options);
    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.name = name;
    this.options = options;
    this.Component = Component;
  }

  hasTemplate() {
    return !!this.options.template;
  }

  hasTemplateUrl() {
    return !!this.options.templateUrl;
  }

  hesTemplateMethod() {
    return isFunction(this.Component.render);
  }
}
