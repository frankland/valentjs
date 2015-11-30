export default class TranslateException extends Error {
  constructor(name, type, error) {
    super();

    this.message = `could not transalte "${name}" type - ${error}`;
  }
}
