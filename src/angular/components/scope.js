var scopes = new WeakMap();
var queue = new WeakMap();

export default class Scope {
  static attach(context, scope) {
    scopes.set(context, scope);

    if (queue.has(context)) {
      var resolve = queue.get(context);
      resolve(scope);
      queue.delete(context);
    }
  }

  static has(context) {
    return scopes.has(context);
  }

  static get(context) {
    return new Promise((resolve, reject) => {
      if (scopes.has(context)) {
        var scope = scopes.get(context);
        resolve(scope);
      } else {

        // TODO: fix for case if scope is not yet created but already deleted!
        queue.set(context, resolve);
      }
    });
  }


  static delete(context) {
    scopes.delete(context);
  }
}
