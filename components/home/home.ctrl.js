(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', Controller);

  Controller.$inject = ['$state', '$cookies', '$rootScope', '$mdDialog'];
  function Controller($state, $cookies, $rootScope, $mdDialog) {
    var vm = this;
    vm.user = $rootScope.user;
    vm.isOpen = false;
    vm.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    };

    activate();

    ////////////////

    function activate() {
      if(!$cookies.getObject('user', {path: '/'})){
        $state.go('login');
      } else {
        $rootScope.user=$cookies.getObject('user', {path: '/'});
        $state.go('home.dashboard');
      }
    }
  }
})();