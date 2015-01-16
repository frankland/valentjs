export default function(Component, DiConstructor, additional = []){

  var dependencies = Component.config.dependencies;

  if (!angular.isArray(additional)) {
    throw new Error('Wrong additional deps. format for ngx DI enchant');
  }

  var inline = ['$injector'].concat(additional);

  var di = inline.concat(dependencies);

  di.push(DiConstructor);

  return di;
}
