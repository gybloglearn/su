(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeDashboardController', HomeDashboardController);

  HomeDashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function HomeDashboardController($state, $cookies, $rootScope, $filter) {
    var vm = this;

    vm.data = [
      { name: "Greg", score: 98 },
      { name: "Ari", score: 96 },
      { name: 'Q', score: 75 },
      { name: "Loser", score: 48 }
    ];

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