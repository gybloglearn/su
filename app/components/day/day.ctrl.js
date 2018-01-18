(function () {
  'use strict';

  angular
    .module('app')
    .controller('DayController', DayController);

  DayController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ShiftreportsService', '$timeout'];
  function DayController($state, $cookies, $rootScope, $filter, $mdSidenav, ShiftreportsService, $timeout) {
    var vm = this;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    vm.load = load;
    vm.changeDate = changeDate;

    vm.charter = charter;

    function changeDate() {
      vm.search = {};
      vm.startdate = $filter('date')(vm.std.getTime() + (5 * 60 * 60 * 1000 + 50 * 60 * 1000), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(vm.std.getTime() + (5 * 60 * 60 * 1000 + 50 * 60 * 1000) + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
      vm.load();
    }

    function getDrill(d, field) {
      var ret = [];
      var filtered = $filter('unique')($filter('filter')(d, vm.search), 'type');
      for (var x = 0; x < filtered.length; x++) {
        var y = 0;
        switch (field) {
          case 'Totalsheets': y = parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), 'Totalsheets')) - parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), 'ScrapSheets')); break;
          default: y = parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), field)); break;
        }
        ret.push([filtered[x].PartGroup_Name + ' (' + filtered[x].type + ')', y]);
      }
      return ret;
    }

    function charter() {
      vm.smChartOptions = {
        chart: { type: 'pie', },
        plotOptions: { series: { dataLabels: { enabled: false, format: '<b>{point.name}</b>: {point.percentage:.1f} %<br><i>{point.y}</i> lap' } } },
        tooltip: { headerFormat:'<b>{point.key}</b><br/>', pointFormat: '{point.percentage:.1f} %<br><i>{point.y}</i> lap' },
        title: { text: 'Napi SM Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        series: [
          {
            name: 'Lapok',
            data: [
              { name: 'Selejt', y: parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'ScrapSheets')), drilldown: 'scrapSheets' },
              { name: 'JÓ', y: parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'Totalsheets')) - parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'ScrapSheets')), drilldown: 'goodSheets' }
            ]
          }
        ],
        drilldown: {
          series: [
            {
              id: 'scrapSheets',
              name: 'Selejt lap típusok',
              data: getDrill(vm.smData, 'ScrapSheets')
            },
            {
              id: 'goodSheets',
              name: 'Jó lap típusok',
              data: getDrill(vm.smData, 'Totalsheets')
            }
          ]
        }
      };

      vm.pottingChartOptions = {
        chart: { type: 'column' },
        plotOptions: {
          series: {
            dataLabels: { enabled: false },
            pointPadding: 0.1,
            groupPadding: 0,
            borderWidth: 0,
            shadow: false
          }
        },
        legend: {enabled: false},
        tooltip: { headerFormat: '<b>{point.key}</b><br/>',pointFormat: '<b><i>{point.y}</i></b> modul' },
        title: { text: 'Napi Potting Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        yAxis: { title: { text: 'Modul Darab' } },
        xAxis: { title: { text: '' }, type: 'category' },
        series: [
          {
            name: 'Potting',
            colorByPoint: true,
            data: [
              { name: 'BE', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'In')), drilldown: 'InDetails' },
              { name: 'FORDÍT', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'P3')), drilldown: 'P3Details' },
              { name: 'KI', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'Out')), drilldown: 'OutDetails' }
            ]
          }
        ],
        drilldown: {
          series: [
            { colorIndex: 0, name: 'Be részletek', id: 'InDetails', data: getDrill(vm.pottingData, 'In') },
            { colorIndex: 1, name: 'Fordít részletek', id: 'P3Details', data: getDrill(vm.pottingData, 'P3') },
            { colorIndex: 2, name: 'Ki részletek', id: 'OutDetails', data: getDrill(vm.pottingData, 'Out') }
          ]
        }
      };

      vm.mtfChartOptions = {
        chart: { type: 'bar' },
        plotOptions: {
          series: {
            dataLabels: { enabled: false },
            pointPadding: 0.1,
            groupPadding: 0,
            borderWidth: 0,
            shadow: false
          }
        },
        legend: {enabled: false},
        tooltip: { headerFormat: '<b>{point.key}</b><br/>',pointFormat: '<b><i>{point.y}</i></b> modul' },
        title: { text: 'Napi MTF Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        yAxis: { title: { text: 'Modul Darab' } },
        xAxis: { title: { text: '' }, type: 'category' },
        series: [
          {
            name: 'MTF',
            colorByPoint: true,
            data: [
              { name: 'Potting KI', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'POTOUT')), drilldown: 'POTOUT' },
              { name: 'Klórozók ki', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'CHOUT')), drilldown: 'CHOUT' },
              { name: 'BP Ki', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'BPOUT')), drilldown: 'BPOUT' },
              { name: 'Minősített', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'GRADED')), drilldown: 'GRADED' }
            ]
          }
        ],
        drilldown: {
          series: [
            { colorIndex: 0, name: 'Potting KI', id: 'POTOUT', data: getDrill(vm.mtfData, 'POTOUT') },
            { colorIndex: 1, name: 'Klórozók KI', id: 'CHOUT', data: getDrill(vm.mtfData, 'CHOUT') },
            { colorIndex: 2, name: 'BP KI', id: 'BPOUT', data: getDrill(vm.mtfData, 'BPOUT') },
            { colorIndex: 3, name: 'Minősített', id: 'GRADED', data: getDrill(vm.mtfData, 'GRADED') }
          ]
        }
      };

    }

    function load() {
      vm.loading = true;
      vm.smData = []; vm.pottingData = []; vm.mtfData = [];
      charter();
      ShiftreportsService.getSM(vm.startdate, vm.enddate).then(function (r) {
        for (var i = 0; i < r.data.length; i++) {
          r.data[i].Totalsheets = r.data[i].Totalsheets ? parseInt(r.data[i].Totalsheets) : 0;
          r.data[i].ScrapSheets = r.data[i].ScrapSheets ? parseInt(r.data[i].ScrapSheets) : 0;
          r.data[i].modulnumber = Math.floor((parseInt(r.data[i].Totalsheets) - parseInt(r.data[i].ScrapSheets)) / parseInt(r.data[i].SheetNum));
          vm.smData.push(r.data[i]);
          if (i == r.data.length - 1) {
            vm.loading = false;
            charter();
          }
        }
      });
      ShiftreportsService.getPOTTING(vm.startdate, vm.enddate).then(function (r) {
        for (var i = 0; i < r.data.length; i++) {
          r.data[i].In = r.data[i].In ? parseInt(r.data[i].In) : 0;
          r.data[i].P3 = r.data[i].P3 ? parseInt(r.data[i].P3) : 0;
          r.data[i].Out = r.data[i].Out ? parseInt(r.data[i].Out) : 0;
          vm.pottingData.push(r.data[i]);
          if (i == r.data.length - 1) {
            charter();
          }
        }
      });
      ShiftreportsService.getMTF(vm.startdate, vm.enddate).then(function (r) {
        for (var i = 0; i < r.data.length; i++) {
          r.data[i].POTOUT = r.data[i].POTOUT ? parseInt(r.data[i].POTOUT) : 0;
          r.data[i].CHOUT = r.data[i].CHOUT ? parseInt(r.data[i].CHOUT) : 0;
          r.data[i].PPE = r.data[i].PPE ? parseInt(r.data[i].PPE) : 0;
          r.data[i].PPU = r.data[i].PPU ? parseInt(r.data[i].PPU) : 0;
          r.data[i].BPOUT = r.data[i].BPOUT ? parseInt(r.data[i].BPOUT) : 0;
          r.data[i].BOKES = r.data[i].BOKES ? parseInt(r.data[i].BOKES) : 0;
          r.data[i].GRADED = r.data[i].GRADED ? parseInt(r.data[i].GRADED) : 0;
          vm.mtfData.push(r.data[i]);
          if (i == r.data.length - 1) {
            charter();
          }
        }
      });
    }

    activate();

    ////////////////

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.std = new Date();
        vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date().getTime() + (24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        vm.load();
      }
    }
  }
})();