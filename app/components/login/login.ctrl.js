(function () {
  'use strict';

  angular
    .module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['Login', '$state', '$timeout', '$cookies', '$window', '$rootScope'];
  function LoginController(Login, $state, $timeout, $cookies, $window, $rootScope) {
    var vm = this;
    vm.err = {};
    vm.authenticate = authenticate;

    function authenticate() {
      Login.auth({ "uname": vm.data.uname, "passw": vm.data.passw }).then(function (resp) {
        if (resp.data.username) {
          $cookies.putObject('user', resp.data, { path: "/" });
          $rootScope.user = resp.data;
          $rootScope.quicklinks = [];
          Login.getQL($rootScope.user.username).then(function(resp){
            if(resp.data.length > 0){
              $rootScope.quicklinks = resp.data;
            }
          });
          var redir = $cookies.get('redir');
          if(!redir || redir == '') {
            $cookies.remove('redir');
            $state.go('dashboard');
          } else {
            $cookies.remove('redir');
            $state.go(redir);
          }
        }
      }).catch(function (error) {
        // handle error.
        vm.err.message = error.data;
        $timeout(function () {
          vm.err.message = '';
        }, 5000);
      });
    }
  }

  activate();

  ////////////////

  function activate() {

  }
})();