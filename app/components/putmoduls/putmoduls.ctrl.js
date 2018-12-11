(function () {
  'use strict';

  angular
    .module('app')
    .controller('PutmodulsController', PutmodulsController);

  PutmodulsController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'PutmodulsService'];
  function PutmodulsController($state, $cookies, $rootScope, $filter, $mdSidenav, PutmodulsService) {
    var vm = this;
    vm.loadpositions=loadpositions;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadpositions(){
      vm.data=[];
      PutmodulsService.get().then(function (response) {
        vm.data.push($filter('filter')(response.data,{ code: '1', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '2', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '3', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '4', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '5', outname: "" }));
      });
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      loadpositions();
    }
  }
})();