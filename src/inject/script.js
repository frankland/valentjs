(function () {
    var errors = JSON.parse(BuildErrors);

    if (!!errors.length){
      var div = document.createElement('div');
      div.innerHTML = 'Build failed';

      for (var i = 0, size = errors.length; i < size; i++) {
        var error = errors[i];
        div.innerHTML += '<div>' + error + '</div>';
      }

      div.style.setProperty('position', 'absolute');
      div.style.setProperty('background-color', "rgba(160, 0,0, .75)");
      div.style.setProperty('top', '5px');
      div.style.setProperty('right', '5px');
      div.style.setProperty('padding', '15px');
      div.style.setProperty('color', '#fff');

      document.body.appendChild(div);
    }
})();


