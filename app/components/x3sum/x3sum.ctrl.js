(function () {
  'use strict';

  angular
    .module('app')
    .controller('X3sumController', X3sumController);

  X3sumController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'X3sumService'];
  function X3sumController($state, $cookies, $rootScope, $filter, $mdSidenav, X3sumService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (6 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.actstate = "A keretet elvitték (nyugtázás a fénykapunál)";
    vm.update_selectday = update_selectday;
    vm.setChart=setChart;
    vm.beilleszt=beilleszt;
    vm.loading = false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function beilleszt() {
      vm.startdatumszam = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
    }

    function update_selectday() {
      vm.dates = [];
      vm.selectday = [];
      var diff = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);

      for (var i = 0; i <= diff; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.startdate).getTime() + (i * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.selectday[i] = {}

        vm.selectday[i].day = $filter('date')(new Date(vm.startdate).getTime() + (i * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.selectday[i].dayshift = $filter('shift')(1, $filter('date')(new Date(vm.startdate).getTime() + (i * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.selectday[i].nightshift = $filter('shift')(3, $filter('date')(new Date(vm.startdate).getTime() + (i * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.selectday[i].daycases = [
          { state: "Klórozó robot a keretet berakta a klórozó kádba", db: 0 },
          { state: "A keret belépett az X3 cellába a V43 megállítóhoz", db: 0 },
          { state: " A mosószárak felmentek", db: 0 },
          { state: "A gél kimosó robot kihúzta a dugót", db: 0 },
          { state: " A gél kimosó robot felvette a keretet", db: 0 },
          { state: "Az 1-es kádba rakott modulon az áramlás felépült", db: 0 },
          { state: "A klórozó robot a keretet berakta az 1-es öblítő kádba", db: 0 },
          { state: "A keret elvihető (jelzés)", db: 0 },
          { state: "Adapter felszerelve", db: 0 },
          { state: "Adapter leszerelve", db: 0 },
          { state: "A 2-es kádba helyezett modulon az áramlás felépült", db: 0 },
          { state: " Keret az átrakó asztalon", db: 0 },
          { state: "A klórozó robot a keretet berakta a 2-es öblítő kádba", db: 0 },
          { state: "Keret kirakva a kihordó asztalra", db: 0 },
          { state: "A keretet elvitték (nyugtázás a fénykapunál)", db: 0 },
          { state: "A klórozó kádba helyezett modulon az áramlás felépült", db: 0 },
          { state: "Potting3-ban keret kiadási engedély", db: 0 }
        ];
        vm.selectday[i].nightcases = [
          { state: "Klórozó robot a keretet berakta a klórozó kádba", db: 0 },
          { state: "A keret belépett az X3 cellába a V43 megállítóhoz", db: 0 },
          { state: " A mosószárak felmentek", db: 0 },
          { state: "A gél kimosó robot kihúzta a dugót", db: 0 },
          { state: " A gél kimosó robot felvette a keretet", db: 0 },
          { state: "Az 1-es kádba rakott modulon az áramlás felépült", db: 0 },
          { state: "A klórozó robot a keretet berakta az 1-es öblítő kádba", db: 0 },
          { state: "A keret elvihető (jelzés)", db: 0 },
          { state: "Adapter felszerelve", db: 0 },
          { state: "Adapter leszerelve", db: 0 },
          { state: "A 2-es kádba helyezett modulon az áramlás felépült", db: 0 },
          { state: " Keret az átrakó asztalon", db: 0 },
          { state: "A klórozó robot a keretet berakta a 2-es öblítő kádba", db: 0 },
          { state: "Keret kirakva a kihordó asztalra", db: 0 },
          { state: "A keretet elvitték (nyugtázás a fénykapunál)", db: 0 },
          { state: "A klórozó kádba helyezett modulon az áramlás felépült", db: 0 },
          { state: "Potting3-ban keret kiadási engedély", db: 0 }
        ];
      }
      load();
    }

    function load() {
      vm.loading = true;
      vm.data = [];
      var edate = $filter('date')(new Date(vm.enddate).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
      X3sumService.getmulti(vm.startdatumszam, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].day = response.data[j].PLC_Timestamp.substr(0, 10);

          if ((new Date(response.data[j].PLC_Timestamp).getHours() * 60 + new Date(response.data[j].PLC_Timestamp).getMinutes()) >= 350 && (new Date(response.data[j].PLC_Timestamp).getHours() * 60 + new Date(response.data[j].PLC_Timestamp).getMinutes()) < 1070) {
            response.data[j].shiftnum = 1;
          }
          else {
            response.data[j].shiftnum = 3;
          }
          response.data[j].shift = $filter('shift')(response.data[j].shiftnum, $filter('date')(new Date(response.data[j].PLC_Timestamp), 'yyyy-MM-dd'));
          var dt = (new Date(response.data[j].PLC_Timestamp).getHours() * 60 + new Date(response.data[j].PLC_Timestamp).getMinutes());
          if (dt < 350) {
            response.data[j].day = $filter('date')(new Date(response.data[j].day).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          vm.data.push(response.data[j]);
        }
        for (var k = 0; k < vm.selectday.length; k++) {
          for (var l = 0; l < vm.data.length; l++) {
            if (vm.selectday[k].day == vm.data[l].day && vm.data[l].shiftnum == 1) {
              for (var m = 0; m < vm.selectday[k].daycases.length; m++) {
                if (vm.selectday[k].daycases[m].state == vm.data[l].Status_name1) {
                  vm.selectday[k].daycases[m].db++;
                }
              }
            }
            else if (vm.selectday[k].day == vm.data[l].day && vm.data[l].shiftnum == 3) {
              for (var m = 0; m < vm.selectday[k].nightcases.length; m++) {
                if (vm.selectday[k].nightcases[m].state == vm.data[l].Status_name1) {
                  vm.selectday[k].nightcases[m].db++;
                }
              }
            }
          }
        }
        console.log(vm.selectday);
        setChart(vm.selectday);
        vm.loading = false;
      });
    }

    function setChart(arr) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: vm.actstate },
        series: [
          {
            name: 'Nappali mennyiség',
            color: "#ff9933",
            data: day(arr),
            stack: 'Nap'
          },
          {
            name: 'ÉJszakai mennyiség',
            color: "#0066ff",
            data: night(arr),
            stack: 'Nap'
          }
        ],
        xAxis: [
          { categories: vm.dates },
        ],
        yAxis: {
          title: {
            text: "Keret"
          }
        },
      };
      console.log(vm.chartconfig);
    }

    function day(t) {
      var res = [];
      for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].daycases.length; j++) {
          if (t[i].daycases[j].state == vm.actstate) {
            res.push(t[i].daycases[j].db);
          }
        }
      }
      console.log(res);
      return res;
    }

    function night(t) {
      var res = [];
      for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].nightcases.length; j++) {
          if (t[i].nightcases[j].state == vm.actstate) {
            res.push(t[i].nightcases[j].db);
          }
        }
      }
      return res;
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      update_selectday();
    }
  }
})();