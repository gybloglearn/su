(function () {
  'use strict';

  angular
    .module('app')
    .controller('AmountController', AmountController);

  AmountController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'AmountService'];
  function AmountController($state, $cookies, $rootScope, $filter, $mdSidenav, AmountService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.categories = ["Day", "Week", "Month", "Year"];
    vm.actcat = "Day";
    vm.load = load;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.startdatenum = $filter('date')(vm.startdate, 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(vm.enddate, 'yyyy-MM-dd');
      vm.sldata = [];
      vm.dates = [];

      AmountService.get(vm.startdatenum, vm.enddatenum, vm.actcat).then(function (response) {
        vm.sldata = response.data;
        vm.dates = $filter('unique')(vm.sldata, 'item1');
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
      load();
    }
  }
})();