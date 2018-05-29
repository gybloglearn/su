(function () {
  'use strict';

  angular
    .module('app')
    .controller('X3Controller', X3Controller);

  X3Controller.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'X3Service'];
  function X3Controller($state, $cookies, $rootScope, $filter, $mdSidenav, X3Service) {
    var vm = this;
    vm.chartstate = "A keretet elvitték (nyugtázás a fénykapunál)";
    vm.startdate = new Date();
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.startdatenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.beallit = beallit;
    vm.load = load;
    vm.loadall = loadall;
    vm.selectchart = selectchart;
    vm.loading=false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function beallit() {
      vm.startdate = vm.enddate;
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
    }

    function update_selectday() {
      vm.selectday = [];
      vm.cats = [];

      for (var i = 0; i < 24; i++) {
        vm.selectday[i] = {}
        if (i < 18) {
          vm.selectday[i].hour = i + 6;
          vm.cats.push(i + 6)
        }
        else {
          vm.selectday[i].hour = i - 18;
          vm.cats.push(i - 18)
        }
        vm.selectday[i].cases = [
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
    }

    function load() {
      vm.mtfld = true;
      update_selectday();
      vm.data = [];
      vm.charlist = [];
      vm.loading=true;


      X3Service.get(vm.startdatenum).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var actstate = vm.data[i].Status_name1;
          var acthour = new Date(vm.data[i].PLC_Timestamp).getHours();
          var actminute = new Date(vm.data[i].PLC_Timestamp).getMinutes();
          vm.charlist.push(actstate);
          if (actminute < 50) {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 17].cases.length; j++) {
                if (vm.selectday[acthour + 17].cases[j].state == actstate) {
                  vm.selectday[acthour + 17].cases[j].db++;
                }
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 6].cases.length; j++) {
                if (vm.selectday[acthour - 6].cases[j].state == actstate) {
                  vm.selectday[acthour - 6].cases[j].db++;
                }
              }
            }
          }
          else {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 18].cases.length; j++) {
                if (vm.selectday[acthour + 18].cases[j].state == actstate) {
                  vm.selectday[acthour + 18].cases[j].db++;
                }
              }

            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 5].cases.length; j++) {
                if (vm.selectday[acthour - 5].cases[j].state == actstate) {
                  vm.selectday[acthour - 5].cases[j].db++;
                }
              }
            }
          }
        }
        selectchart(vm.selectday);
        vm.loading= false;
      });
    }

    function loadall() {
      vm.alldata = [];

      X3Service.getall(vm.startdatenum).then(function (response) {
        vm.alldata = response.data;
      });
    }

    function selectchart(tomb) {
      var resault = [];
      for (var i = 0; i < 24; i++) {
        for (var j = 0; j < tomb[i].cases.length; j++) {
          if (tomb[i].cases[j].state == vm.chartstate) {
            resault.push(tomb[i].cases[j].db);
          }
        }
      }
      setChart(resault);
    }

    function setChart(re) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: vm.chartstate },
        series: [
          {
            name: 'Termelt mennyiség',
            color: "#00b300",
            data: re
          }
        ],


        xAxis: [
          { categories: vm.cats },
        ],
        yAxis: {
          title: {
            text: "Keret"
          }
        },
      };
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
      loadall();
    }
  }
})();