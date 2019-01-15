import Injector from '../services/injector';
import digest from '../services/digest';

let proxy = name => {
  console.info(`"${name}" could be implemented in child class`);
};

export default class BaseScreenController {
  digest = () => digest(this);

  injector = Injector;

  constructor(url) {
    this.url = url;

    this.createUrlLinks(url);

    this.url.watch((params, diff, options) => {
      this.onUrlChange(params, diff, options);
    });
  }

  onUrlChange(params, diff, options) {
    proxy('onUrlChange');
  }

  createUrlLinks(url) {
    proxy('createUrlLinks');
  }
}
