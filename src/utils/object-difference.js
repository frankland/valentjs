import deepDiff from 'deep-diff';
import valueAt from 'lodash/get';

let defaultOptions = {
  ignored: ['$$hashKey'],
};

export default (left, right, callOptions) => {
  let options = Object.assign({}, defaultOptions, callOptions);

  let description = [];
  let diff = deepDiff(left, right);

  if (diff) {
    for (let chunk of diff) {
      let lastKey = chunk.path[chunk.path.length - 1];

      if (options.ignored.indexOf(lastKey) == -1) {
        if (chunk.kind == 'A') {
          let path = chunk.path.join('.');

          if (chunk.item.kind == 'N') {
            description.push({
              description: `Added element to array _${path}_:`,
              value: chunk.item.rhs,
            });
          } else if (chunk.item.kind == 'E') {
            description.push({
              description: `Added element to array _${path}_ at _${chunk.index}_ index:`,
              value: [chunk.item.lhs, chunk.item.rhs],
            });
          } else if (chunk.item.kind == 'D') {
            description.push({
              description: `Deleted element from array _${path}_ at _${chunk.index}_ index:`,
              value: chunk.item.lhs,
            });
          }
        } else if (chunk.kind == 'E') {
          let path = chunk.path.join('.');

          description.push({
            description: `Changed property _${path}_`,
            value: [chunk.lhs, chunk.rhs],
          });
        } else if (chunk.kind == 'N') {
          let path = chunk.path ? chunk.path.join('.') : 'root';

          description.push({
            description: `Added property _${path}_`,
            value: chunk.rhs,
          });
        } else if (chunk.kind == 'D') {
          let path = chunk.path ? chunk.path.join('.') : 'root';

          description.push({
            description: `Deleted property _${path}_`,
            value: chunk.lhs,
          });
        }
      }
    }
  }
};
