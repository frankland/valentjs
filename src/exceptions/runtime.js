import Exception from './exception';

export default class RuntimeException extends Exception {
  constructor(name, type, error) {
    super(`runtime error with "${name}" ${type} - ${error}`);
  }
}
