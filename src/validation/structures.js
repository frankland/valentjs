import t from 'tcomb-validation';

var validate = t.validate;

let templateStruct = t.union([
  t.Str,
  t.Function
]);

/**
 * Should be string and without spaces
 * @param name
 * @returns {*|boolean}
 */
export const isValidName = name => {
  let isValid = validate(name, t.Str).isValid();
  return isValid && name.indexOf(' ') == -1;
};

/**
 * Static controller's method. Should return string
 * @param render
 */
export const isValidRenderMethod = render => validate(render, t.Function).isValid();

/**
 * Controller's Constructor == Function
 * @param constructor
 */
export const isValidConstructor = constructor => validate(constructor, t.Function).isValid();

/**
 * Template could be a String of Function that returns string :)
 * @param template
 */
export const isValidTemplate = template => validate(template, templateStruct).isValid();

/**
 * Url == String
 * @param templateUrl
 */
export const isValidTemplateUrl = templateUrl => validate(templateUrl, t.Str).isValid();

/**
 * Directive bindings
 * if Object - isolated scope
 * otherwise - new scope will not be created
 * @param bindings
 */
export const isValidBindings = bindings => validate(bindings, t.maybe(t.Obj)).isValid();

/**
 * Object with Constructors at values
 * @type {{value, errors}|*}
 */
let interfacesStructure = t.dict(t.Str, t.Function);
export const isValidInterfaces = interfaces => {
  return validate(interfaces, t.maybe(interfacesStructure)).isValid();
};

export const isValidPipes = pipes => isValidInterfaces(pipes);
export const isValidOptions = options => isValidInterfaces(options);

/**
 * Do not recommend to use classes as components's restricts
 * @param restrict
 */
export const isValidRestrict = restrict => validate(restrict, t.maybe(t.enums.of(['A', 'E']))).isValid();

/**
 * Static controller's method
 * @param compile
 */
export const isValidCompileMethod = compile => validate(compile, t.maybe(t.Function)).isValid();



/**
 * String or array of strings
 * @param url
 */
export const isValidUrl = url => validate(url, t.union([t.list(t.Str), t.Str])).isValid();

export const isValidStruct = struct => validate(struct, t.maybe(t.dict(t.Str, t.Function))).isValid();

export const isValidResolvers = resolvers => validate(resolvers, t.maybe(t.dict(t.Str, t.Function))).isValid();
