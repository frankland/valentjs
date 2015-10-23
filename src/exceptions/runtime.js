export default class RuntimeException extends Error {
  constructor(name, error) {
    super();
    this.message = `could not init "${name}" - ${error}`;
  }

  //static at(name) {
  //  return (error) => {
  //    return new RuntimeException(name, error);
  //  }
  //}
}
