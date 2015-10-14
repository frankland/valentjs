let validate = (name, Controller, options) => {
  let errors = [];

  // --- VALIDATE NAME -----
  if (!name || name.indexOf(' ') != -1) {
    errors.push('route\'s name could not be empty or contain spaces');
  }

  // ----- VALIDATE URL -----
  if (options.url && !isString(options.url) && !isArray(options.url)) {
    errors.push('url should be defined as string or array');
  }

  return errors;
};

export default class ValentController {
  constructor(name, url, options) {
    let errors = validate(name, Controller, options);
    if (errors.length) {

      throw new Error({
        name,
        messages
      });
    }

    this.name = name;
    this.url = url;
    this.options = options;
  }
}
