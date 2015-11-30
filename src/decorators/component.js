import { getControllerName } from '../utils/class-name';

export default options => target => {
  let controllerName = getControllerName(target);
  valent.component(controllerName, target, options);
};
