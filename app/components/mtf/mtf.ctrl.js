(function () {
  'use strict';

  angular
    .module('app')
    .controller('MtfController', MtfController);

  MtfController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'MtfService'];
  function MtfController($state, $cookies, $rootScope, $filter, $mdSidenav, MtfService) {
    var vm = this;
    vm.maxdate = new Date();
    vm.date = new Date();
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.maxdatumszam=$filter('date')(new Date(vm.maxdate).getTime(), 'yyyy-MM-dd');
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
      vm.datumszam = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      vm.szak_de = $filter('shift')(1, vm.datumszam);
      vm.szak_du = $filter('shift')(2, vm.datumszam);
      vm.szak_ej = $filter('shift')(3, vm.datumszam);
      if (vm.maxdatumszam==vm.datumszam) {
        loadtoday();
      }
      else {
        loadoldday();
      }
    }

    function loadtoday() {
      vm.mtf = [];
      vm.datenum = $filter('date')(new Date().getTime() - (1000 * 3600) + (15 * 60 * 1000), 'MMddHH');

      MtfService.gettoday(vm.datenum).then(function (response) {
        for (i = 0; i < response.data[0].data.length; i++) {
          if (response.data[0].data[i].amount > 0) {
            if (response.data[0].data[i].name == "DS12FLOW_BOK-BOKES") {
              response.data[0].data[i].name = "Ds12 FLOW_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "C11 FLOW_BOK-BOKES") {
              response.data[0].data[i].name = "C11FLOW_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "DS13CP5_BOK-BOKES") {
              response.data[0].data[i].name = "DS- D13 CP5_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "C11 CP5_BOK-BOKES") {
              response.data[0].data[i].name = "C11CP5_BOK-BOKES";
            }
            vm.mtf.push(response.data[0].data[i]);
          }
        }
        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 7);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.mtf[i].name = mystring;
                vm.mtf[i].aeq = vm.mtf[i].amount * vm.aeqs[j].amount;
                vm.mtf[i].type = substring1;
              }
            }
          }
          else if (mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 10);
            vm.mtf[i].name = mystring;
            vm.mtf[i].type = substring2;
          }
        }
        vm.mtf = $filter('orderBy')(vm.mtf, 'name');

        for (var a = 0; a < vm.mtf.length - 1; a = a + 2) {
          vm.mtf[a].bokes = vm.mtf[a + 1].amount;
        }

        console.log(vm.mtf);
      });
    }

    function loadoldday() {
      vm.mtf = [];
      vm.datenum = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'MMdd');

      MtfService.getoldday(vm.datenum).then(function (response) {
        for (i = 0; i < response.data[0].data.length; i++) {
          if (response.data[0].data[i].amount > 0) {
            if (response.data[0].data[i].name == "DS12FLOW_BOK-BOKES") {
              response.data[0].data[i].name = "Ds12 FLOW_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "C11 FLOW_BOK-BOKES") {
              response.data[0].data[i].name = "C11FLOW_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "DS13CP5_BOK-BOKES") {
              response.data[0].data[i].name = "DS- D13 CP5_BOK-BOKES";
            }
            else if (response.data[0].data[i].name == "C11 CP5_BOK-BOKES") {
              response.data[0].data[i].name = "C11CP5_BOK-BOKES";
            }
            vm.mtf.push(response.data[0].data[i]);
          }
        }
        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 7);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.mtf[i].name = mystring;
                vm.mtf[i].aeq = vm.mtf[i].amount * vm.aeqs[j].amount;
                vm.mtf[i].type = substring1;
              }
            }
          }
          else if (mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 10);
            vm.mtf[i].name = mystring;
            vm.mtf[i].type = substring2;
          }
        }
        vm.mtf = $filter('orderBy')(vm.mtf, 'name');

        for (var a = 0; a < vm.mtf.length - 1; a = a + 2) {
          vm.mtf[a].bokes = vm.mtf[a + 1].amount;
        }

        console.log(vm.mtf);
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
      //loadtoday();
      change();
    }

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS12FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "DX", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS13CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 }
    ];

  }
})();