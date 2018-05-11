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

    function createchart() {
      var chdata = [];
      for (var i = 6; i >= 0; i--) {
        var actday = $filter('date')(new Date().getTime() - ((6 - i) * 24 * 3600 * 1000), 'MMdd');
        MtfService.getoldday(actday).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            for (var k = 0; k < response.data[j].data.length; k++) {
              response.data[j].data[k].date = $filter('date')(new Date(response.data[j].data[k].days).getTime(), 'yyyy-MM-dd');
              for (var l = 0; l < vm.aeqs.length; l++) {
                if (response.data[j].data[k].name.includes(vm.aeqs[l].name)) {
                  response.data[j].data[k].aeq = response.data[j].data[k].amount * vm.aeqs[l].amount;
                }
              }
              chdata.push(response.data[j].data[k]);
            }
          }

          vm.chartconfig = {
            chart: { type: 'column', height: 300 },
            title: { text: 'Előző 1 hét adatai' },
            xAxis: { type: 'category', crosshair: true },
            tooltip: { shared: true },
            yAxis: [
              {
                title: { text: 'BP-zett AEQ' },
                max: 250,
                min: 100
              },
              {
                title: { text: 'BÖKES / AEQ' },
                min: 10,
                max: 40,
                opposite: true
              }
            ],
            plotOptions: {
              series: {
                pointPadding: 0,
                groupPadding: 0
              }
            },
            series: [
              { name: 'BP-zett AEQ', color:'#44bb22', data: feltolt(chdata), yAxis: 0, dataLabels: { enabled: true, useHTML: true, format: '<b style="color:white">{y:.2f}</b>', inside: true, verticalAlign: 'bottom' } },
              { type: 'line', color: 'red', name: 'CÉL BP-zett AEQ', data: targetaeq(), yAxis: 0 },
              { type: 'line', color: '#2288dd', name: 'Bökés / AEQ', data: feltolt_bokes(chdata), yAxis: 1 },
              { type: 'line', color: '#005588', name: 'CÉL Bökés / AEQ', data: targetbokes(), yAxis: 1 },
            ],
          }
          createtabledata(chdata);
        });
      }
    }

    function feltolt(bpzett) {

      var bpaeq = [];
      for (var i = 0; i < 7; i++) {
        var obj = {};
        obj = {
          name: $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          y: 0
        };
        for (var k = 0; k < bpzett.length; k++) {
          if (obj.name == bpzett[k].date && bpzett[k].name.includes("_BP-OUT")) {
            obj.y += bpzett[k].aeq;
          }
        }
        obj.y > 225 ? obj.color='#44bb22' : obj.color='#bb4422';
        bpaeq.push(obj);
      }
      return bpaeq;
    }

    function feltolt_bokes(bokes) {
      var bok = [];
      for (var i = 0; i < 7; i++) {
        var obj = {};
        obj = {
          name: $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          y: 0
        }
        var bk = 0;
        var aq = 0;
        for (var k = 0; k < bokes.length; k++) {
          if (obj.name == bokes[k].date && bokes[k].name.includes("_BP-OUT")) {
            aq += bokes[k].aeq;
          }
          if (obj.name == bokes[k].date && bokes[k].name.includes("_BOK-BOKES")) {
            bk += bokes[k].amount;
          }
        }
        obj.y = bk / aq;
        bok.push(obj);
      }
      return bok;
    }

    function targetaeq() {
      var target = [];
      for (var i = 0; i < 7; i++) {
        var obj = {};
        obj = {
          name: $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          y: 225
        };
        target.push(obj);
      }
      console.log(target);
      return target;
    }

    function targetbokes() {
      var target = [];
      for (var i = 0; i < 7; i++) {
        var obj = {};
        obj = {
          name: $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          y: 30
        };
        target.push(obj);
      }
      return target;
    }

    function createtabledata(arr) {

      vm.tabledata = [];

      for (var i = 0; i < 7; i++) {
        var actday = $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        var naeq=0;
        var eaeq=0;
        var nbok=0;
        var ebok=0;
        for(var j=0;j<arr.length;j++){
          if(arr[j].date==actday && arr[j].shiftnum==1 && arr[j].name.includes("_BP-OUT")){
            naeq+=arr[j].aeq;
          }
          else if(arr[j].date==actday && arr[j].shiftnum==3 && arr[j].name.includes("_BP-OUT")){
            eaeq+=arr[j].aeq;
          }
          else if(arr[j].date==actday && arr[j].shiftnum==1 && arr[j].name.includes("_BOK-BOKES")){
            nbok+=arr[j].amount;
          }
          else if(arr[j].date==actday && arr[j].shiftnum==3 && arr[j].name.includes("_BOK-BOKES")){
            ebok+=arr[j].amount;
          }
        }
        var obj = {};
        obj = {
          day: actday,
          noonaeq:naeq,
          moonaeq:eaeq,
          dayaeq:naeq+eaeq,
          noonbok:nbok,
          moonbok:ebok,
          daybok:nbok+ebok
        };
        vm.tabledata.push(obj);
      }
      return vm.tabledata;
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
      createchart();
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