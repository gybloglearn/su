(function () {
  'use strict';

  angular
    .module('app')
    .run(runFunction);

  runFunction.$inject = ['$cookies', '$location'];
  function runFunction($cookies, $location) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      var redir = '';
      var actR = $cookies.get('redir');
      var user = $cookies.getObject('iwpuser', {path: '/'});
      if (actR) {
        redir = actR;
        $cookies.remove('redir');
      } else {
        var url = $location.path();
        if(url == ""){
          url = "#/";
        } else if (url != "/login") {
          redir = url;
          $cookies.put('redir', redir);
        }
      }
    }
  }
})();
