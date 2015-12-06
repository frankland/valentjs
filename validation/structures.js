'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var validate = _tcombValidation2['default'].validate;

var templateStruct = _tcombValidation2['default'].union([_tcombValidation2['default'].Str, _tcombValidation2['default'].Function]);

/**
 * Should be string and without spaces
 * @param name
 * @returns {*|boolean}
 */
var isValidName = function isValidName(name) {
  var isValid = validate(name, _tcombValidation2['default'].Str).isValid();
  return isValid && name.indexOf(' ') == -1;
};

exports.isValidName = isValidName;
/**
 * Static controller's method. Should return string
 * @param render
 */
var isValidRenderMethod = function isValidRenderMethod(render) {
  return validate(render, _tcombValidation2['default'].Function).isValid();
};

exports.isValidRenderMethod = isValidRenderMethod;
/**
 * Controller's Constructor == Function
 * @param constructor
 */
var isValidConstructor = function isValidConstructor(constructor) {
  return validate(constructor, _tcombValidation2['default'].Function).isValid();
};

exports.isValidConstructor = isValidConstructor;
/**
 * Template could be a String of Function that returns string :)
 * @param template
 */
var isValidTemplate = function isValidTemplate(template) {
  return validate(template, templateStruct).isValid();
};

exports.isValidTemplate = isValidTemplate;
/**
 * Url == String
 * @param templateUrl
 */
var isValidTemplateUrl = function isValidTemplateUrl(templateUrl) {
  return validate(templateUrl, _tcombValidation2['default'].Str).isValid();
};

exports.isValidTemplateUrl = isValidTemplateUrl;
/**
 * Directive params
 * if Object - isolated scope
 * otherwise - new scope will not be created
 * @param params
 */
var isValidParams = function isValidParams(params) {
  return validate(params, _tcombValidation2['default'].maybe(_tcombValidation2['default'].Obj)).isValid();
};

exports.isValidParams = isValidParams;
/**
 * Object with Constructors at values
 * @type {{value, errors}|*}
 */
var interfacesStructure = _tcombValidation2['default'].dict(_tcombValidation2['default'].Str, _tcombValidation2['default'].Function);
var isValidInterfaces = function isValidInterfaces(interfaces) {
  return validate(interfaces, _tcombValidation2['default'].maybe(interfacesStructure)).isValid();
};

exports.isValidInterfaces = isValidInterfaces;
var isValidPipes = function isValidPipes(pipes) {
  return isValidInterfaces(pipes);
};
exports.isValidPipes = isValidPipes;
var isValidOptions = function isValidOptions(options) {
  return isValidInterfaces(options);
};

exports.isValidOptions = isValidOptions;
/**
 * Do not recommend to use classes as components's restricts
 * @param restrict
 */
var isValidRestrict = function isValidRestrict(restrict) {
  return validate(restrict, _tcombValidation2['default'].maybe(_tcombValidation2['default'].enums.of(['A', 'E'])));
};

exports.isValidRestrict = isValidRestrict;
/**
 * Static controller's method
 * @param compile
 */
var isValidCompileMethod = function isValidCompileMethod(compile) {
  return validate(compile, _tcombValidation2['default'].maybe(_tcombValidation2['default'].Function));
};

exports.isValidCompileMethod = isValidCompileMethod;
/**
 * String or array of strings
 * @param url
 */
var isValidUrl = function isValidUrl(url) {
  return validate(url, _tcombValidation2['default'].union([_tcombValidation2['default'].list(_tcombValidation2['default'].Str), _tcombValidation2['default'].Str]));
};

exports.isValidUrl = isValidUrl;
var isValidStruct = function isValidStruct(struct) {
  return validate(struct, _tcombValidation2['default'].maybe(_tcombValidation2['default'].dict(_tcombValidation2['default'].Str, _tcombValidation2['default'].Function)));
};

exports.isValidStruct = isValidStruct;
var isValidResolvers = function isValidResolvers(resolvers) {
  return validate(resolvers, _tcombValidation2['default'].maybe(_tcombValidation2['default'].dict(_tcombValidation2['default'].Str, _tcombValidation2['default'].Function)));
};
exports.isValidResolvers = isValidResolvers;