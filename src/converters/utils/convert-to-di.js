export default function ConvertDi(Component, inline) {

  var dependencies = Component.config.dependencies;

  var items;
  if (!angular.isArray(inline)) {
    items = [inline];
  } else {
    items = inline;
  }

  return ['$injector'].concat(dependencies).concat(items);
}
