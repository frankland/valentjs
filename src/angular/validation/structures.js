import t from 'tcomb-validation';

var validate = t.validate;


/**
 * true/false
 * @param restrict
 */
export const isValidTransclude = restrict => validate(restrict, t.maybe(t.Bool)).isValid();

/**
 * String or array of strings
 * @param req
 */
export const isValidRequire = req => validate(req, t.maybe(t.union([t.list(t.Str), t.Str]))).isValid();

export const isValidModule = module => validate(module, t.maybe(t.Str)).isValid();

export const isValidNamespace = namespace => validate(namespace, t.maybe(t.Str)).isValid();
