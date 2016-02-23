import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import uniq from 'lodash/array/uniq';

import * as validation from './validation/structures';


let normalize = (ComponentClass, options) => {
  let renderMethod = ComponentClass.render;
  let normalized = Object.assign({}, options);

  if (isFunction(renderMethod)) {
    normalized.template = renderMethod;
  }

  return normalized;
};

export default class ValentComponent {
  constructor(name, ComponentClass, options) {
    this.name = name;
    this.options = normalize(ComponentClass, options);
    this.ComponentClass = ComponentClass;
  }

  static validate(name, ComponentClass, options) {
    let isValidName = validation.isValidName(name);
    let isValidController = validation.isValidConstructor(ComponentClass);
    let isValidTemplate = validation.isValidTemplate(options.template);
    let isValidTemplateUrl = validation.isValidTemplateUrl(options.templateUrl);
    let isValidRenderMethod = validation.isValidRenderMethod(ComponentClass.render);
    let isValidBindings = validation.isValidBindings(options.bindings);

    let isValidInterfaces = validation.isValidInterfaces(options.interfaces);
    let isValidPipes = validation.isValidPipes(options.pipes);
    let isValidOptions = validation.isValidOptions(options.options);

    let isValidRestrict = validation.isValidRestrict(options.restrict);
    //let isValidCompileMethod = validation.isValidCompileMethod(ComponentClass.compile);

    let errors = [];

    if (!isValidName) {
      errors.push('Component\'s name could not be empty or with spaces');
    }

    if (!isValidController) {
      errors.push('Component\'s class should be a constructor');
    }

    // if al least two template options are defined
    if (isValidTemplate == isValidTemplateUrl ? isValidTemplate : isValidRenderMethod) {
      errors.push('Should have only one - template, templateUrl or static render() option');
    }

    if (options.restrict == 'A' && (isValidTemplate || isValidTemplateUrl || isValidRenderMethod)) {
      errors.push('Attribute directives should be without template');
    }

    let keys = [];
    if (!isValidBindings) {
      errors.push('If bindings are defined - it should be an object');
    } else if (options.bindings) {
      let bindingsKeys = Object.keys(options.bindings);
      keys.concat(bindingsKeys);
    }

    if (!isValidInterfaces) {
      errors.push('Interfaces should be an object with constructors at values');
    } else if (options.interfaces) {
      let interfacesKeys = Object.keys(options.interfaces);
      keys.concat(interfacesKeys);
    }

    if (!isValidPipes) {
      errors.push('Pipes should be an object with constructors at values');
    } else if (options.pipes) {
      let pipesKeys = Object.keys(options.pipes);
      keys.concat(pipesKeys);
    }

    if (!isValidOptions) {
      errors.push('Options should be an object with constructors at values');
    } else if (options.options) {
      let optionsKeys = Object.keys(options.options);
      keys.concat(optionsKeys);
    }


    if (keys.length) {
      let uniqueKeys = uniq(keys);

      if (uniqueKeys.length == keys.length) {
        errors.push('Interfaces, options and pipes keys should not cross');
      }
    }

    if (!isValidRestrict) {
      errors.push('Restrict should be any of "E" or "A"');
    }

    return errors;
  }

  getName() {
    return this.name;
  }

  getController() {
    return this.ComponentClass;
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
    return !this.hasTemplate() && !this.hasTemplateUrl(); // && !this.hasRenderMethod();
  }

  hasCompileMethod() {
    return isFunction(this.ComponentClass.compile);
  }

  getCompileMethod() {
    return this.ComponentClass.compile;
  }

  getBindings() {
    return this.options.bindings;
  }

  hasInterfaces() {
    return !!this.getInterfaces();
  }

  getInterfaces() {
    return this.options.interfaces;
  }

  hasOptions() {
    return !!this.getOptions();
  }

  getOptions() {
    return this.options.options;
  }

  hasPipes() {
    return !!this.getPipes();
  }

  getPipes() {
    return this.options.pipes;
  }

  getRestrict() {
    return this.options.restrict;
  }

  isAttributeComponent() {
    let restrict = this.getRestrict();
    return restrict === 'A';
  }
}
