(function () {
  'use strict';

  angular
    .module('app')
    .controller('Zw1500scrapController', Zw1500scrapController);

  Zw1500scrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav'];
  function Zw1500scrapController($state, $cookies, $rootScope, $filter, $mdSidenav) {
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