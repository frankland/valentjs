import Exception from './exception';

export default class TranslateException extends Exception {
  constructor(name, type, error) {
    super(`could not translate "${name}" ${type} - ${error}`);
  }
}
