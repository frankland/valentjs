import merge from 'lodash/object/merge';
import assign from 'lodash/object/assign';
import getter from 'lodash/object/get';
import setter from 'lodash/object/set';

export default class ObjectDescription {
  static create() {
    var templates = Array.prototype.slice.call(arguments);
    var description = {};
    for (var config of templates) {
      description = assign(description, config);
    }

    var result = {};
    for (var path of Object.keys(description)) {
      var value = description[path];
      setter(result, path, value);
    }

    return result;
  }
}
