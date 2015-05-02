import diff from 'deep-diff';
import valueAt from 'lodash/object/get'

var ignored = ['$$hashKey'];

export default class ObjectDifference {
  static diff(left, right) {
    return diff(left, right);
  }

  static print(left, right) {
    var diff = ObjectDifference.diff(left, right);

    if (diff) {
      console.log('-----------------------------');
      var table = {};
      for (var chunk of diff) {
        var lastKey = chunk.path[chunk.path.length - 1];

        if (ignored.indexOf(lastKey) == -1) {
          if (chunk.kind == 'A') {
            var path = chunk.path.join('.');
            console.log(`%c Changed values in array "${path}" at "${chunk.index}" index`, 'background: #3399ff; color: #fff');
            if (chunk.item.kind == 'N') {
              console.log('added element', chunk.item.rhs);
            } else if (chunk.item.kind == 'E') {
              console.log('changed element', chunk.item.lhs, chunk.item.rhs);
            } else if (chunk.item.kind == 'D') {
              console.log('deleted element', chunk.item.lhs);
            }

            console.log(valueAt(left, path), valueAt(right, path));


          } else if (chunk.kind == 'E') {
            var path = chunk.path.join('.');

            console.log(`%c Changed property "${path}"`, 'background: #3399ff; color: #fff');
            console.log(chunk.lhs, chunk.rhs);

          } else if (chunk.kind == 'N') {
            var path = chunk.path ? chunk.path.join('.') : 'root';

            console.log(`%c Added property "${path}"`, 'background: #3399ff; color: #fff');
            console.log(chunk.rhs);

          } else if (chunk.kind == 'D') {
            console.log(`%c Deleted property "${path}"`, 'background: #3399ff; color: #fff');
            console.log(chunk.lhs);
          }
        }
      }

      if (Object.keys(table).length) {
        //console.table(table);
      }
    }
  }
}
