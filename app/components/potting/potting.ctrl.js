(function () {
  'use strict';

  angular
    .module('app')
    .controller('PottingController', PottingController);

  PottingController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'PottingService'];
  function PottingController($state, $cookies, $rootScope, $filter, $mdSidenav, PottingService) {
    var vm = this;
    vm.datenumber = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.date = new Date();
    vm.maxdate = new Date();
    vm.pottinglist = ["Potting4", "Potting3", "Potting2"];
    vm.actpotting = "Potting4";
    vm.szak_de = $filter('shift')(1, vm.datenumber);
    vm.szak_du = $filter('shift')(2, vm.datenumber);
    vm.szak_ej = $filter('shift')(3, vm.datenumber);
    vm.load = load;
    vm.change = change;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function change() {
      vm.datenumber = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      vm.szak_de = $filter('shift')(1, vm.datenumber);
      vm.szak_du = $filter('shift')(2, vm.datenumber);
      vm.szak_ej = $filter('shift')(3, vm.datenumber);
      load();
    }

    function load() {
      vm.data = [];
      PottingService.get(vm.datenumber, vm.actpotting).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < aeqs.length; j++) {
            if (vm.data[i].type == aeqs[j].name) {
              vm.data[i].aeq = vm.data[i].amount * aeqs[j].amount;
            }
          }
        }
        console.log(vm.data);
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

    var aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS-D12 FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW220 FLOW", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D13 CP", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27_CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "A27_FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32_CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "B32_FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS-D11 FLOW", amount: 0 },
      { name: "DS-D11 CP5", amount: 0 },
      { name: "DS-D13 CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 },
      { name: "D11 K", amount: 0 },
      { name: "DX", amount: 0.74 }
    ];
  }
})();