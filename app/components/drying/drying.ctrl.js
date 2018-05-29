(function () {
  'use strict';

  angular
    .module('app')
    .controller('DryingController', DryingController);

  DryingController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DryingService'];
  function DryingController($state, $cookies, $rootScope, $filter, $mdSidenav, DryingService) {
    var vm = this;
    vm.drylist = ["Drying3", "Drying2", "Arhívum"];
    vm.actdry = "Drying3";
    vm.load = load;
    vm.loading = false;
    vm.loadarchivefile = loadarchivefile;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      if (vm.actdry == "Drying3" || vm.actdry == "Drying2") {
        loaddrying();
      }
      else {
        loadarchive();
      }
    }

    function loaddrying() {
      vm.drydata = [];
      vm.loading = true;
      DryingService.get(vm.actdry).then(function (response) {
        vm.drydata = response.data;
        vm.loading = false;
      });
    }

    function loadarchivefile() {
      vm.drydata = [];
      vm.loading = true;
      DryingService.getArchive(vm.link).then(function (response) {
        vm.drydata = response.data;
        vm.loading = false;
      });
    }

    function loadarchive() {
      vm.drydata = [];

      var sttime = new Date('2017-12-12 05:50:00').getTime();
      var enddate = new Date().getTime();
      var loadstodo = Math.floor((enddate - sttime) / (6 * 60 * 60 * 1000));
      vm.loads = [];
      for (var i = 0; i < loadstodo; i++) {
        vm.loads.push({ name: $filter('date')(new Date(sttime + (i + 1) * 6 * 60 * 60 * 1000).getTime(), 'yyyy-MM-dd HH:mm'), link: $filter('date')(new Date(sttime + (i + 1) * 6 * 60 * 60 * 1000).getTime(), 'yyyyMMddHH') });
      }
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