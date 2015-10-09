
valent.component('pl-chart', PlMultiselect, {
  params: {
    implements: {
      chartInstance: ChartInstance
    },
    optional: {
      chartTrend: Toggler,
      hide: '='
    }
  }
});




class ChartInstance {

}

class Picker {

}

class PlMultiselect {
  constructor() {
    let picker = params.get('picker');
  }

  static template(element) {
    return '<div></div>';
  }
}


