let validate = (route) => {
  let errors = [];


  return errors;
};

export default class Route {
  constructor(route) {
    let errors = validate(route);

    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.route = route;
  }

  getModule() {
    return this.route.options.module || null;
  }
}
