import t from 'tcomb-validation';

var validate = t.validate;


/**
 * true/false
 * @param transclude
 */
export const isValidTransclude = transclude => validate(transclude, t.maybe(
  t.union([t.Bool,t.dict(t.Str, t.Str)])
)).isValid();

/**
 * String or array of strings
 * @param req
 */
export const isValidRequire = req => validate(req, t.maybe(t.union([t.list(t.Str), t.Str]))).isValid();

export const isValidModule = module => validate(module, t.maybe(t.Str)).isValid();

export const isValidNamespace = namespace => validate(namespace, t.maybe(t.Str)).isValid();
