(function () {
  'use strict';

  angular
    .module('app')
    .controller('NewrouteController', NewrouteController);

  NewrouteController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function NewrouteController($state, $cookies, $rootScope, $filter) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login');
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
      }
    }
  }
})();