(function () {
  'use strict';

  angular
    .module('app')
    .controller('DataController', DataController);

  DataController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DataService'];
  function DataController($state, $cookies, $rootScope, $filter, $mdSidenav, DataService) {
    var vm = this;
    vm.datum = new Date();
    vm.maxdate = new Date();
    vm.actsm = "SM4";
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.load = load;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadnumbers() {
      DataService.getAll().then(function (response) {
        vm.smnumbers = response.data;
        load();
      });
    }

    function load() {
      vm.data = [];
      vm.darab = [];
      vm.allando = [];
      vm.events = [];
      vm.egyedi = [];
      vm.sumszervezesi = 0;
      vm.sumtervezesi = 0;
      vm.summuszakiok = 0;
      var pieceterv = [];
      var pieceszerv = [];
      var piecemuszaki = [];
      vm.chartdrill = [];
      vm.today = (new Date().getHours() * 60 + new Date().getMinutes()) - 350;
      vm.datumszam = $filter('date')(new Date(vm.datum), 'yyyy-MM-dd');
      updtestand(vm.actsm);
      for (var i = 0; i < 24; i++) {
        vm.darab[i] = 0;
      }


      DataService.get(vm.datumszam, vm.actsm).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          hour_grop(vm.data[i].Event_type, vm.data[i].timestamp);
        }
        vm.sumtervezesi = ($filter('sumField')($filter('filter')(vm.data, { Ev_Group: "Tervezett veszteseg" }), 'Event_time')) / 60;
        vm.sumszervezesi = ($filter('sumField')($filter('filter')(vm.data, { Ev_Group: "Szervezesi veszteseg" }), 'Event_time')) / 60;
        vm.summuszakiok = ($filter('sumField')($filter('filter')(vm.data, { Ev_Group: "Muszaki technikai okok" }), 'Event_time')) / 60;
        vm.events = $filter('unique')(vm.data, 'Event_type');
        vm.egyedi = $filter('unique')(vm.data, 'Event_SubGroup');
        pieceterv = $filter('unique')($filter('filter')(vm.data, { Ev_Group: "Tervezett veszteseg" }), 'Event_SubGroup');
        pieceszerv = $filter('unique')($filter('filter')(vm.data, { Ev_Group: "Szervezesi veszteseg" }), 'Event_SubGroup');
        piecemuszaki = $filter('unique')($filter('filter')(vm.data, { Ev_Group: "Muszaki technikai okok" }), 'Event_SubGroup');
        vm.chartdrill.push({
          name: "Tervezesi veszteseg", tooltip: {
            pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.y:.2f} perc</b>',
          }, id: "Tervezesi veszteseg", data: []
        });
        vm.chartdrill.push({
          name: "Szervezesi veszteseg", tooltip: {
            pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.y:.2f} perc</b>',
          }, id: "Szervezesi veszteseg", data: []
        });
        vm.chartdrill.push({
          name: "Muszaki technikai okok", tooltip: {
            pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.y:.2f} perc</b>',
          }, id: "Muszaki technikai okok", data: []
        });

        for (var i = 0; i < pieceterv.length; i++) {
          vm.chartdrill[0].data.push([pieceterv[i].Event_SubGroup, ($filter('sumField')($filter('filter')(vm.data, { Event_SubGroup: pieceterv[i].Event_SubGroup }), 'Event_time')) / 60]);
        }
        for (var j = 0; j < pieceszerv.length; j++) {
          vm.chartdrill[1].data.push([pieceszerv[j].Event_SubGroup, ($filter('sumField')($filter('filter')(vm.data, { Event_SubGroup: pieceszerv[j].Event_SubGroup }), 'Event_time')) / 60]);
        }
        for (var k = 0; k < piecemuszaki.length; k++) {
          vm.chartdrill[2].data.push([piecemuszaki[k].Event_SubGroup, ($filter('sumField')($filter('filter')(vm.data, { Event_SubGroup: piecemuszaki[k].Event_SubGroup }), 'Event_time')) / 60]);
        }
        function compare (a,b){
          if (a[1] > b[1]) return -1;
          if (a[1] < b[1]) return 1;
          return 0;
        }
        vm.chartdrill[0].data.sort(compare);
        vm.chartdrill[1].data.sort(compare);
        vm.chartdrill[2].data.sort(compare);
        daytimechart();
        setMainchart();
        setPiechart();
      });
    }

    function updtestand(sheetm) {
      var num = 0;
      for (var i = 0; i < vm.smnumbers.length; i++) {
        if (sheetm == vm.smnumbers[i].sm) {
          num = vm.smnumbers[i].amount
        }
      }
      for (var i = 0; i < 24; i++) {
        vm.allando[i] = num * 1;
      }
    }

    function setMainchart() {
      vm.mainchartconfig = {
        chart: {
          type: 'column',
          height: 360
        },
        title: { text: vm.actsm + " SOE report" },
        subtitle: { text: 'Forrás: MES adatbázis' },
        series: [
          {
            type: "line",
            name: 'Órai cél',
            color: "#ff8800",
            data: vm.allando
          },
          {
            name: 'Termelt lap',
            color: "#00b300",
            data: vm.darab
          }
        ],
        xAxis: [
          { categories: feltolt_hour() },
        ],
        yAxis: {
          title: {
            text: "Darab"
          }
        },
      };
    }

    function hour_grop(itemtype, itemstart) {
      var szamvaltozo = new Date(itemstart).getHours() * 60 + new Date(itemstart).getMinutes();
      for (var i = 0; i < 18; i++) {
        if (itemtype == "Sheet Production" && (szamvaltozo >= ((i + 5) * 60 + 50)) && szamvaltozo < ((i + 6) * 60 + 50)) {
          vm.darab[i]++
        }
      }
      for (var i = 18; i < 24; i++) {
        if (itemtype == "Sheet Production" && (szamvaltozo >= ((i - 18) * 60 - 10)) && szamvaltozo < ((i - 17) * 60 - 10)) {
          vm.darab[i]++
        }
      }
    }

    function feltolt_hour() {
      var szamok = [];
      for (var i = 6; i < 24; i++) {
        szamok.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        szamok.push("0" + j);
      }
      return szamok;
    }

    function setPiechart() {
      vm.chartconfig_pie = {
        chart: {
          type: 'column',
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>',
        },
        title: { text: "Állásidők eloszlása" },
        subtitle: { text: "Összes eltelt idő: " + vm.today + "perc" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [
          {
            data: [{
              name: 'Elérhető idő',
              color: "#00b300",
              y: vm.today - (vm.sumszervezesi + vm.sumtervezesi + vm.summuszakiok)
            },
            {
              name: 'Szervezesi veszteseg',
              color: "#cc33ff",
              y: vm.sumszervezesi,
              drilldown: 'Szervezesi veszteseg'
            },
            {
              name: 'Tervezett veszteseg',
              color: "#3366ff",
              y: vm.sumtervezesi,
              drilldown: 'Tervezesi veszteseg'
            },
            {
              name: 'Műszaki technikai okok',
              color: "#e60000",
              y: vm.summuszakiok,
              drilldown: 'Muszaki technikai okok'
            }],
            type: 'pie'
          }
        ],
        drilldown: {
          series: vm.chartdrill
        },
        xAxis: {
          type: 'category',
          showEmpty: false
        },
        yAxis: {
          showEmpty: false,
          title: {
            text: "Idő(perc)"
          }
        },
      };
    }

    function daytimechart() {
      var tday = $filter('date')(new Date(), 'yyyy-MM-dd');
      if (vm.datumszam < tday) {
        vm.today = 24 * 60;
      }
      else {
        vm.today = (new Date().getHours() * 60 + new Date().getMinutes()) - 350;
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
      loadnumbers();
    }
  }
})();