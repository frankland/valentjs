export default class RegisterException extends Error {
  constructor(name, type, errors) {
    super();

    this.message = `Could not register ${type} - "${name}".`;

    for (let error of errors) {
      this.message += "\n - " + error;
    }

    this.message += "\n";
  }
}
