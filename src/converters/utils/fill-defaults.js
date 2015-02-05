export default function FillDefaults(Component, $scope) {

  if (Component.config.defaults) {
    var defaults = Component.config.defaults;

    for (var item of Object.keys(defaults)) {
      if (!$scope.hasOwnProperty(item)) {
        $scope[item] = defaults[item];
      }
    }
  }
}

