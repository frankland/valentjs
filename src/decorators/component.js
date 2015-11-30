import { getControllerName } from '../utils/classname';

export default options => target => {
  let controllerName = getControllerName(target);
  valent.component(controllerName, target, options);
};
