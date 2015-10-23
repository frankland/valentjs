export default class RuntimeException extends Error {
  constructor(name, type, error) {
    super();
    this.message = `runtime error with "${name}" ${type} - ${error}`;
  }
}
