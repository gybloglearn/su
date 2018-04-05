(function () {
  'use strict';

  angular
    .module('app')
    .run(runFunction);

  runFunction.$inject = ['$cookies', '$location', '$state', '$rootScope', '$mdSidenav', 'Login'];
  function runFunction($cookies, $location, $state, $rootScope, $mdSidenav, Login) {
    var vm = this;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function activate() {
      var url = $location.path();
      url = url.slice(1);
      if (!$cookies.getObject('user')) {
        if (url != 'login') {
          $cookies.put('redir', url);
          $state.go('login');
        }
      } else {
        var u = $cookies.getObject('user');
        /*$rootScope.quicklinks = [];
        Login.getQL(u.username).then(function (resp) {
          if (resp.data.length > 0) {
            $rootScope.quicklinks = resp.data;
          }
        });*/
        if (url != 'login') {
          if (url == '' || url == '/') {
            $state.go('dashboard');
          } else {
            $state.go(url);
          }
        } else {

        }
      }
    }
  }
})();