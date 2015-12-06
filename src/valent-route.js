import * as validation from './validation/structures';

export default class ValentController {
  constructor(name, url, options) {
    this.name = name;
    this.url = url;
    this.options = options;
  }

  static validate(name, url, options) {
    let isValidName = validation.isValidName(name);
    let isValidTemplate = validation.isValidTemplate(options.template);
    let isValidTemplateUrl = validation.isValidTemplateUrl(options.templateUrl);
    let isValidUrl = validation.isValidUrl(url);
    let isValidStruct = validation.isValidStruct(options.structure);
    let isValidResolvers = validation.isValidResolvers(options.resolvers);

    let errors = [];

    if (!isValidName) {
      errors.push('Component\'s name could not be empty or with spaces');
    }

    // if al least two template options are defined
    if ((isValidTemplate && isValidTemplateUrl) || (!isValidTemplate && !isValidTemplateUrl)) {
      errors.push('Should have only one - template, templateUrl or static render() option');
    }

    if (!isValidUrl) {
      errors.push('Url should be a string of list of strings');
    }

    if (!isValidStruct) {
      errors.push('Struct should be an object of tcomb models')
    }

    if (!isValidResolvers) {
      errors.push('Struct should be an object of functions')
    }

    return errors;
  }

  getName() {
    return this.name;
  }

  getController() {
    return this.Controller;
  }

  hasTemplate() {
    return !!this.options.template;
  }

  getTemplate() {
    return this.options.template;
  }

  hasTemplateUrl() {
    return !!this.options.templateUrl;
  }

  getTemplateUrl() {
    return this.options.templateUrl;
  }

  withoutTemplate() {
    return !this.hasTemplate() && !this.hasTemplateUrl();
  }

  getUrl() {
    return this.url;
  }

  hasResolvers() {
    return !!this.options.resolve;
  }

  getResolvers() {
    return this.options.resolve;
  }

  getParams() {
    return this.options.params || {};
  }

  getStructure() {
    return this.options.structure || {};
  }
}
