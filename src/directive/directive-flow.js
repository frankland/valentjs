import DirectiveModel from './directive-model';

export default class DirectiveFlow {

  constructor(name) {
    this.model = new DirectiveModel(name);
  }

  /**
   * Set directive module name
   * @param name
   * @returns {DirectiveFlow}
   */
  at(name) {
    this.model.setApplicationName(name);

    if (this.model.hasRoute()) {
      this.model.route.at(name);
    }

    return this;
  }

  /**
   * Set directive's controller dependencies
   */
  dependencies(dependencies) {
    this.model.addDependencies(dependencies);

    return this;
  }

  /**
   * Set if directive with transclude
   * @returns {DirectiveFlow}
   */
  transclude(transclude) {
    this.model.setTransclude(transclude);
    return this;
  }

  /**
   * Describe directive attributes
   * @param scope
   * @returns {DirectiveFlow}
   */
  scope(scope) {
    this.model.setScope(scope);
    return this;
  }

  /**
   *
   * @param require
   */
  require(require) {
    this.model.require(require);
    return this;
  }

  /**
   * Set directive restrict
   * @param restrict
   * @returns {DirectiveFlow}
   */
  restrict(restrict) {
    this.model.setRestrict(restrict);

    return this;
  }

  /**
   * Set directive pipes
   * @param pipes
   * @returns {DirectiveFlow}
   */
  pipes(pipes) {
    this.model.setPipes(pipes);

    return this;
  }


  /**
   * Set directive's controller class
   * @param controller
   * @returns {DirectiveFlow}
   */
  controller(controller) {
    this.model.setController(controller);

    return this;
  }

  /**
   * Set template
   * @param template
   * @returns {DirectiveFlow}
   */
  template(template) {
    this.model.setTemplate(template);

    return this;
  }

  /**
   * Set template Url
   * @param templateUrl
   * @returns {DirectiveFlow}
   */
  templateUrl(templateUrl) {
    this.model.setTemplateUrl(templateUrl);

    return this;
  }

  as(name) {
    this.model.setControllerNamespace(name);
    return this;
  }
}
