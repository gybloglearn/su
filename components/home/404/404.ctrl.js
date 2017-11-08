(function() {
  'use strict';

  angular
    .module('app')
    .controller('Home404Controller', Home404Controller);

  Home404Controller.$inject = ['$rootScope', '$state', '$cookies'];
  function Home404Controller($rootScope, $state, $cookies) {
    var vm = this;


    activate();

    ////////////////

    function activate() {
      if (!$cookies.getObject('iwpuser', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('iwpuser',{path: '/'});
        vm.user = $cookies.getObject('iwpuser', {path: '/'});
      }
    }
  }
})();