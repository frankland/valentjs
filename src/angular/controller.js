let validate = (controller) => {
  let errors = [];


  return errors;
};

export default class Controller {
  constructor(controller) {
    let errors = validate(controller);

    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.controller = controller;
  }

  getModule() {
    return this.controller.options.module || null;
  }
}
