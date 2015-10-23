export default class TranslateException extends Error {
  constructor(name, error) {
    super();

    this.message = `could not transalte "${name}" - ${error}`;
  }
}
