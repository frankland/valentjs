export default function FillDefaults(Component, $scope) {

  if (Component.config.defaults) {
    var defaults = Component.config.defaults;

    for (var item of Object.keys(defaults)) {
      $scope[item] = defaults[item];
    }
  }
}

