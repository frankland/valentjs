import diff from 'deep-diff';
import valueAt from 'lodash/object/get'
import log from 'log-with-style';

var header = 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px; color: #444; padding: 8px 0; line-height: 40px';

var ignored = ['$$hashKey'];

export default class ObjectDifference {
  static diff(left, right) {
    return diff(left, right);
  }

  static print(left, right, log) {
    var diff = ObjectDifference.diff(left, right);


    if (diff) {
      var table = {};
      for (var chunk of diff) {
        var lastKey = chunk.path[chunk.path.length - 1];

        if (ignored.indexOf(lastKey) == -1) {
          if (chunk.kind == 'A') {
            var path = chunk.path.join('.');
            //console.log(`%c Changed values in array "${path}" at "${chunk.index}" index`, 'background: #3399ff; color: #fff');
            if (chunk.item.kind == 'N') {
              log(`Added element to array _${path}_:`, chunk.item.rhs);

            } else if (chunk.item.kind == 'E') {
              log(`Added element to array _${path}_ at _${chunk.index}_ index:`, chunk.item.lhs, chunk.item.rhs);
            } else if (chunk.item.kind == 'D') {
              log(`Deleted element from array _${path}_ ar _${chunk.index}_ index:`, chunk.item.lhs);
            }
            //console.log(valueAt(left, path), valueAt(right, path));
          } else if (chunk.kind == 'E') {
            var path = chunk.path.join('.');

            log(`Changed property _${path}_`, chunk.lhs, chunk.rhs);

          } else if (chunk.kind == 'N') {
            var path = chunk.path ? chunk.path.join('.') : 'root';
            log(`Added property _${path}_`, chunk.rhs);

          } else if (chunk.kind == 'D') {
            log(`Deleted property _${path}_`, chunk.lhs);
          }
        }
      }

      if (Object.keys(table).length) {
        //console.table(table);
      }
    }
  }
}
