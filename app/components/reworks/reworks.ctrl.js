(function () {
  'use strict';

  angular
    .module('app')
    .controller('ReworksController', ReworksController);

  ReworksController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ReworksService'];
  function ReworksController($state, $cookies, $rootScope, $filter, $mdSidenav, ReworksService) {
    var vm = this;
    vm.startdate = new Date();
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.startdatenum = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.getdata = getdata;
    vm.pns = [];

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadpns() {
      ReworksService.getpartnumber().then(function (resp) {
        for (var i = 0; i < resp.data.length; i++) {
          resp.data.aeq = parseFloat(resp.data.aeq);
        }
        vm.pns = resp.data;
      });
    }

    function getdata() {
      vm.startdatenum = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.data = [];
      if (vm.enddatenum == vm.startdatenum) {
        vm.enddatenum = $filter('date')(new Date(vm.enddatenum).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
      }
      ReworksService.get(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].aeq = response.data[i].cnt * parseFloat($filter('filter')(vm.pns, { id: response.data[i].BaaNCode })[0].aeq)
        }
        vm.data = response.data;
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
      loadpns();
      load();
    }
  }
})();