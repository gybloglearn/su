(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function DashboardController($state, $cookies, $rootScope, $filter) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      /*if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {*/
        vm.loading = true;
        /*$rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});*/
        vm.shift = $filter('shift')(1, new Date());
        vm.today = "2018-08-20"; //$filter('date')(new Date(), 'yyyy-MM-dd');
      //}
    }
  }
})();
