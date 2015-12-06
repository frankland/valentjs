import t from 'tcomb-validation';

var validate = t.validate;


/**
 * true/false
 * @param restrict
 */
export const isValidTransclude = restrict => validate(restrict, t.Bool).isValid();

/**
 * String or array of strings
 * @param compile
 */
export const isValidRequire = compile => validate(require, t.maybe(t.dict(t.list(t.Str), t.Str))).isValid();

export const isValidModule = module => validate(module, t.maybe(t.Str)).isValid();

export const isValidNamespace = module => validate(module, t.maybe(t.Str)).isValid();
