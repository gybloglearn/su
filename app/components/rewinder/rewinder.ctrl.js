(function () {
  'use strict';

  angular
    .module('app')
    .controller('RewinderController', RewinderController);

  RewinderController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'RewinderService'];
  function RewinderController($state, $cookies, $rootScope, $filter, $mdSidenav, RewinderService) {
    var vm = this;
    vm.date = new Date();
    vm.datumszam = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.actmch = '';
    vm.actshift = '';
    vm.lodrewainder1 = lodrewainder1;
    vm.loaddetails = loaddetails;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function lodrewainder1() {
      vm.actmch = '';
      vm.actshift = '';
      var dt = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      vm.datumszam = dt;
      vm.rw1data = [];
      vm.uniquerw1 = [];
      vm.selectdata = [];

      RewinderService.getrw1(dt).then(function (response) {
        vm.rw1data = response.data;
        vm.uniquerw1 = $filter('unique')(vm.rw1data, 'MachineName');
        for (var i = 0; i < vm.uniquerw1.length; i++) {
          var obj = {};
          obj = {
            nev: vm.uniquerw1[i].MachineName,
            meternappal: 0,
            cnappal: 0,
            meterejszaka: 0,
            cejszaka: 0,
            meternapi: 0,
            cnapi: 0,
          }
          vm.selectdata.push(obj);
        }
        for (var i = 0; i < vm.selectdata.length; i++) {
          for (var j = 0; j < vm.rw1data.length; j++) {
            if (vm.selectdata[i].nev == vm.rw1data[j].MachineName && vm.rw1data[j].ShiftNum == "1") {
              vm.selectdata[i].meternappal += vm.rw1data[j].ProducedLength * 1;
              vm.selectdata[i].cnappal += vm.rw1data[j].P_Count * 1;
              vm.selectdata[i].meternapi += vm.rw1data[j].ProducedLength * 1;
              vm.selectdata[i].cnapi += vm.rw1data[j].P_Count * 1;
            }
            else if (vm.selectdata[i].nev == vm.rw1data[j].MachineName && vm.rw1data[j].ShiftNum == "3") {
              vm.selectdata[i].meterejszaka += vm.rw1data[j].ProducedLength * 1;
              vm.selectdata[i].cejszaka += vm.rw1data[j].P_Count * 1;
              vm.selectdata[i].meternapi += vm.rw1data[j].ProducedLength * 1;
              vm.selectdata[i].cnapi += vm.rw1data[j].P_Count * 1;
            }
          }
        }
      });
    }
    function loaddetails() {
      var dt = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      vm.detailsdata = [];
      RewinderService.getrw2(dt, vm.actmch, vm.actshift).then(function (response) {
        vm.detailsdata = response.data;
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
      lodrewainder1();
    }
  }
})();