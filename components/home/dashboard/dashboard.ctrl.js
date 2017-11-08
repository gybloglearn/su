(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeDashboardController', HomeDashboardController);

  HomeDashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function HomeDashboardController($state, $cookies, $rootScope, $filter) {
    var vm = this;

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