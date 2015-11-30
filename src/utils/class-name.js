import isFunction from 'lodash/lang/isFunction';
import endsWith from 'lodash/string/endsWith';
import Logger from '../utils/logger';

const CONSTRUCTOR_NAME_FUNC  = 'Function';
const CONTROLLER_NAME_SUFFIX = 'Controller';

let logger = Logger.create('class-name');

/**
 * Looks for class constructor name
 *
 * @param  {Object}
 * @return {string|null}
 * @throws {TypeError}
 */
export const getClassName = object => {
  if (!isFunction(object)) {
    throw new TypeError('Given argument is not a class');
  }
  
  let constructorName = object.prototype.constructor.name;
  
  // anonymous functions don't have constructor name
  if ((CONSTRUCTOR_NAME_FUNC === constructorName) || !constructorName.length) {
    return null;
  }
  
  return constructorName;
};

/**
 * Looks for a controller name
 *
 * @param {object}
 * @return {string}
 */
export const getControllerName = object => {
  let constructorName = getClassName(object);
  var controllerName = null;
  
  if (endsWith(constructorName, CONTROLLER_NAME_SUFFIX)) {
    logger.log(`Controller name should ends with "${CONTROLLER_NAME_SUFFIX}" suffix`);
    controllerName = constructorName;
  } else {
    controllerName = constructorName.slice(0, CONTROLLER_NAME_SUFFIX.length);
  }
  
  return controllerName.toLowerCase();
};