(function () {
  'use strict';

  angular
    .module('app')
    .controller('ScrapController', ScrapController);

  ScrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ScrapService'];
  function ScrapController($state, $cookies, $rootScope, $filter, $mdSidenav, ScrapService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - 14 * 24 * 3600 * 1000);
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.startdatenum = $filter('date')(vm.startdate, 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(vm.enddate, 'yyyy-MM-dd');
    vm.levels = ["J1", "J2", "J3", "Konyvelesre kesz", "Konyvelve", "Visszautasitva", "Penzugyi reviewed"];
    vm.actlevel = "Konyvelve";
    vm.load = load;
    vm.crdata = crdata;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.data = [];
     

      vm.startdatenum = $filter('date')(vm.startdate, 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(vm.enddate, 'yyyy-MM-dd');

      ScrapService.get(vm.startdatenum, vm.enddatenum, vm.actlevel).then(function (response) {
        vm.data = response.data;
        crdata(vm.data);
      });
    }

    function crdata(data) {
      vm.scrapfilter = [];
      vm.cikkfilter = [];
      vm.scrapdata = [];

      vm.scrapfilter = $filter('unique')(data, 'scrapName');
      vm.cikkfilter = $filter('unique')(data, 'CikkMegnevezes');

      for (var i = 0; i < vm.scrapfilter.length; i++) {
        var obj = {};
        obj = {
          code: vm.scrapfilter[i].scrapName,
          amount: 0
        };
        vm.scrapdata.push(obj);
      }
      for (var i = 0; i < vm.scrapdata.length; i++) {
        for (var j = 0; j < data.length; j++) {
          if (vm.scrapdata[i].code == data[j].scrapName) {
            vm.scrapdata[i].amount += data[j].Mennyiseg * 1;
          }
        }
      }
      var sc = [];
      var chartdrill = [];
      for (var i = 0; i < vm.scrapdata.length; i++) {
        sc.push({ name: vm.scrapdata[i].code, y: vm.scrapdata[i].amount, drilldown: vm.scrapdata[i].code });
        chartdrill.push({ name: vm.scrapdata[i].code, id: vm.scrapdata[i].code, data: [] });
      }
      for (var i = 0; i < chartdrill.length; i++) {
        for (var j = 0; j < vm.cikkfilter.length; j++) {
          var t = [];
          var szam = 0;
          for (var k = 0; k < data.length; k++) {
            if (data[k].CikkMegnevezes == vm.cikkfilter[j].CikkMegnevezes && data[k].scrapName == chartdrill[i].name) {
              szam += data[k].Mennyiseg * 1;
            }
          }
          t = [vm.cikkfilter[j].CikkMegnevezes, szam];
          chartdrill[i].data.push(t);
        }
      }
      setChartpie(sc, chartdrill);
    }

    function setChartpie(dt, dd) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 1100,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Scrap eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: false
          }
        },
        series: [
          {
            name: "adatok",
            data: dt
          }
        ],
        drilldown: {
          series: dd
        }
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
    }
  }
})();