(function () {
  'use strict';

  angular
    .module('app')
    .controller('QuicklinksController', QuicklinksController);

  QuicklinksController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'Login'];
  function QuicklinksController($state, $cookies, $rootScope, $filter, $mdSidenav, Login) {
    var vm = this;

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
      }
    }
  }
})();