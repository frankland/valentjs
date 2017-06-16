import Exception from './exception';

export default class RegisterException extends Exception {
  constructor(name, type, errors) {
    let message = `Could not register ${type} - "${name}".`;

    for (let error of errors) {
      message += '\n - ' + error;
    }

    message += '\n';

    super(message);
  }
}
