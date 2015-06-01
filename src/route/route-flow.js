import RouteModel from './route-model';

export default class RouteFlow {
  constructor(controller) {
    this.model = new RouteModel(controller);
  }

  /**
   * Set route module name
   * @param name
   * @returns {RouteFlow}
   */
  at(name) {
    this.model.setApplicationName(name);
    return this;
  }

  /**
   * Add url
   * @param url
   * @returns {RouteFlow}
   */
  url(url) {
    this.model.addUrl(url);
    return this;
  }

  /**
   * set url builder for route
   * @param builder
   * @returns {RouteFlow}
   */
  urlBuilder(builder) {
    this.model.setUrlBuilder(builder);
    return this;
  }


  /**
   * Add route resolve
   * @param key
   * @param expr
   * @returns {RouteFlow}
   */
  resolve(key, expr) {
    this.model.addResolve(key, expr);
    return this;
  }

  /**
   * Set template
   * @param template
   * @returns {RouteFlow}
   */
  template(template) {
    this.model.setTemplate(template);
    return this;
  }

  /**
   * Set template Url
   * @param templateUrl
   * @returns {RouteFlow}
   */
  templateUrl(templateUrl) {
    this.model.setTemplateUrl(templateUrl);
    return this;
  }
}
