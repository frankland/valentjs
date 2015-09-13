import diff from 'deep-diff';
import valueAt from 'lodash/object/get'

var ignored = ['$$hashKey'];

export default class ObjectDifference {
  constructor(logger) {
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = console.log.bind(console);
    }
  }

  static diff(left, right) {
    return diff(left, right);
  }

  print(left, right) {
    var diff = ObjectDifference.diff(left, right);

    if (diff) {
      for (var chunk of diff) {
        var lastKey = chunk.path[chunk.path.length - 1];

        if (ignored.indexOf(lastKey) == -1) {
          if (chunk.kind == 'A') {
            var path = chunk.path.join('.');
            if (chunk.item.kind == 'N') {
              this.logger.log(`Added element to array _${path}_:`, chunk.item.rhs);

            } else if (chunk.item.kind == 'E') {
              this.logger.log(`Added element to array _${path}_ at _${chunk.index}_ index:`, chunk.item.lhs, chunk.item.rhs);
            } else if (chunk.item.kind == 'D') {
              this.logger.log(`Deleted element from array _${path}_ at _${chunk.index}_ index:`, chunk.item.lhs);
            }

          } else if (chunk.kind == 'E') {
            var path = chunk.path.join('.');

            this.logger.log(`Changed property _${path}_`, chunk.lhs, chunk.rhs);

          } else if (chunk.kind == 'N') {
            var path = chunk.path ? chunk.path.join('.') : 'root';
            this.logger.log(`Added property _${path}_`, chunk.rhs);

          } else if (chunk.kind == 'D') {
            this.logger.log(`Deleted property _${path}_`, chunk.lhs);
          }
        }
      }
    }
  }
}
