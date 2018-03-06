(function () {
  'use strict';

  angular
    .module('app')
    .controller('DayController', DayController);

  DayController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ShiftreportsService', 'ModulListService'];
  function DayController($state, $cookies, $rootScope, $filter, $mdSidenav, ShiftreportsService, ModulListService) {
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

    // change query string data on datepicker value change
    function changeDate() {
      vm.search = {};
      vm.startdate = $filter('date')(vm.std.getTime() + (5 * 60 * 60 * 1000 + 50 * 60 * 1000), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(vm.std.getTime() + (5 * 60 * 60 * 1000 + 50 * 60 * 1000) + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
      vm.load();
    }
    // CREATE drill down chart data
    function getDrill(d, field, target) {
      var ret = [];
      var filtered = $filter('unique')($filter('filter')(d, vm.search), 'type');
      for (var x = 0; x < filtered.length; x++) {
        var y = 0;
        var aeq = 0;
        switch (field) {
          case 'Totalsheets':
            y = parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), 'Totalsheets')) - parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), 'ScrapSheets'));
            aeq = parseFloat($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), 'modulAeq')).toFixed(2);
            break;
          default:
            y = parseInt($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), field));
            aeq = parseFloat($filter('sumField')($filter('filter')(d, { type: filtered[x].type }), field + 'Aeq')).toFixed(2);
            break;
        }
        ret.push({ name: filtered[x].PartGroup_Name + ' (' + filtered[x].type + ')', y: y, aeq: aeq });
      }
      return ret;
    }
    // refresh CHARTS when changing filters
    function charter() {
      smCharter(); pottingCharter(); mtfCharter();
    }
    // sm chart options
    function smCharter() {
      var targetSheets = $filter('targetSet')(226/0.74*12, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
      var targetAeq = $filter('targetSet')(230, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
      vm.smChartOptions = {
        chart: { type: 'column',
          events: {
            drilldown: function(e){
              if(!e.seriesOptions){
                var ch = this;
                var drilldowns = {
                  'SheetMaker': {
                    id: 'totalSheets',
                    name: 'Jó lapok',
                    stack: 'A',
                    data: getDrill(vm.smData, 'Totalsheets')
                  },
                  'SheetMaker2': {
                    id: 'totalSheets',
                    name: 'Cél lapok',
                    color: '#ff0000',
                    type: 'column',
                    stack: 'B',
                    data: getDrill(vm.smData, 'Totalsheets')
                  }
                };
                var series = [drilldowns[e.point.name], drilldowns[e.point.name + '2']];
                ch.addSingleSeriesAsDrilldown(e.point, series[0]);
                ch.addSingleSeriesAsDrilldown(e.point, series[1]);
                ch.applyDrilldown();
              }
            }
          }
        },
        plotOptions: { series: { dataLabels: { enabled: false, format: '<b>{point.name}</b>: {point.percentage:.1f} %<br><i>{point.y}</i> lap' }, stacking: 'normal' } },
        tooltip: {shared: true, headerFormat: '<b>{point.key}</b><br/>', pointFormat: '<b style="color:{point.series.color}">{point.series.name}</b>: <i>{point.y}</i> lap - <i>{point.aeq} </i> AEQ - {point.percentage:.1f} %<br>' },
        title: { text: 'Napi SM Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        xAxis: { type: 'category' },
        series: [
          {
            name: 'Selejt',
            color: '#ffaa00',
            stack: 'A',
            data: [
              {
                name: 'SheetMaker', y: parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'ScrapSheets')), drilldown: 'scrapSheets', aeq: 0 },
            ]
          },
          {
            name: 'JÓ',
            stack: 'A',
            colorIndex: 1,
            data: [
              { name: 'SheetMaker', y: parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'Totalsheets')) - parseInt($filter('sumField')($filter('filter')(vm.smData, vm.search), 'ScrapSheets')), drilldown: true, aeq: parseFloat($filter('sumField')($filter('filter')(vm.smData, vm.search), 'modulAeq')).toFixed(2) }
            ]
          },
          {
            name: 'Cél',
            type: 'line',
            marker: {symbol: 'circle'},
            color: '#ff0000',
            stack: 'B',
            data: [
              { name: 'SheetMaker', y: targetSheets, aeq: targetAeq }
            ]
          }
        ],
        drilldown: {
          series: [
            {
              id: 'scrapSheets',
              name: 'Selejt lap típusok',
              color: '#ffaa00',
              data: getDrill(vm.smData, 'ScrapSheets')
            }
          ]
        }
      };
    }
    // potting Chart options
    function pottingCharter() {
      var targetModuls = $filter('targetSet')(226*1.005/0.74, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
      var targetAeq = $filter('targetSet')(226*1.005, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
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
        legend: { enabled: false },
        tooltip: { shared: true, headerFormat: '<b>{point.key}</b><br/>', pointFormat: '<b><span style="color:{point.color}">{point.altname}</span> <i>{point.y}</i></b> modul - <i>{point.aeq}</i> AEQ<br>' },
        title: { text: 'Napi Potting Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        yAxis: { title: { text: 'Modul Darab' } },
        xAxis: { title: { text: '' }, type: 'category' },
        series: [
          {
            name: 'Cél',
            marker: {enabled: false},
            type: 'line',
            color: '#ff0000',
            data: [
              { altname: 'Cél', name: 'BE', y: targetModuls, aeq: targetAeq },
              { altname: 'Cél', name: 'FORDÍT', y: targetModuls, aeq: targetAeq },
              { altname: 'Cél', name: 'KI', y: targetModuls, aeq: targetAeq }
            ]
          },
          {
            name: 'Potting moduls',
            colorByPoint: true,
            data: [
              { altname: 'BE', name: 'BE', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'In')), drilldown: 'InDetails', aeq: parseFloat($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'InAeq')).toFixed(2) },
              { altname: 'FORDÍT', name: 'FORDÍT', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'P3')), drilldown: 'P3Details', aeq: parseFloat($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'P3Aeq')).toFixed(2) },
              { altname: 'KI', name: 'KI', y: parseInt($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'Out')), drilldown: 'OutDetails', aeq: parseFloat($filter('sumField')($filter('filter')(vm.pottingData, vm.search), 'OutAeq')).toFixed(2) }
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
    }
    // mtf chart options
    function mtfCharter() {
      var targetModuls = $filter('targetSet')(226/0.74, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
      var targetAeq = $filter('targetSet')(226, new Date().toLocaleDateString() == vm.std.toLocaleDateString(),true);
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
        legend: { enabled: false },
        tooltip: { shared: true, headerFormat: '<b>{point.key}</b><br/>', pointFormat: '<b><span style="color:{point.color}">{point.altname}</span> <i>{point.y}</i></b> modul - <i>{point.aeq}</i> AEQ<br>' },
        title: { text: 'Napi MTF Összesítő' },
        subtitle: { text: 'MES rendszer szerint aktuálisan' },
        yAxis: { title: { text: 'Modul Darab' } },
        xAxis: { title: { text: '' }, type: 'category' },
        series: [
          {
            name: 'Cél',
            marker: {enabled: false},
            type: 'line',
            color: '#ff0000',
            data: [
              { altname: 'Cél', name: 'Potting KI', y: targetModuls, aeq: targetAeq },
              { altname: 'Cél', name: 'Klórozók KI', y: targetModuls, aeq: targetAeq },
              { altname: 'Cél', name: 'BP KI', y: targetModuls, aeq: targetAeq },
              { altname: 'Cél', name: 'Minősített', y: targetModuls, aeq: targetAeq }
            ]
          },
          {
            name: 'MTF',
            colorByPoint: true,
            data: [
              { altname: 'Potting KI', name: 'Potting KI', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'POTOUT')), drilldown: 'POTOUT', aeq: parseFloat($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'POTOUTAeq')).toFixed(2) },
              { altname: 'Klórozók KI', name: 'Klórozók KI', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'CHOUT')), drilldown: 'CHOUT', aeq: parseFloat($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'CHOUTAeq')).toFixed(2) },
              { altname: 'BP KI', name: 'BP KI', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'BPOUT')), drilldown: 'BPOUT', aeq: parseFloat($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'BPOUTAeq')).toFixed(2) },
              { altname: 'Minősített', name: 'Minősített', y: parseInt($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'GRADED')), drilldown: 'GRADED', aeq: parseFloat($filter('sumField')($filter('filter')(vm.mtfData, vm.search), 'GRADEDAeq')).toFixed(2) }
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
    // init load
    function load() {
      vm.loading = true;
      vm.modulData = []; vm.smData = []; vm.pottingData = []; vm.mtfData = [];
      smCharter(); pottingCharter(); mtfCharter();
      ModulListService.get().then(function (r) {
        vm.modulData = r.data;
      });
      ShiftreportsService.getSM(vm.startdate, vm.enddate).then(function (r) {
        for (var i = 0; i < r.data.length; i++) {
          r.data[i].Totalsheets = r.data[i].Totalsheets ? parseInt(r.data[i].Totalsheets) : 0;
          r.data[i].ScrapSheets = r.data[i].ScrapSheets ? parseInt(r.data[i].ScrapSheets) : 0;
          r.data[i].modulnumber = Math.floor((parseInt(r.data[i].Totalsheets) - parseInt(r.data[i].ScrapSheets)) / parseInt(r.data[i].SheetNum));
          r.data[i].modulAeq = r.data[i].modulnumber * parseFloat($filter('filter')(vm.modulData, { id: r.data[i].type })[0].aeq);
          vm.smData.push(r.data[i]);
          if (i == r.data.length - 1) {
            vm.loading = false;
            smCharter();
          }
        }
      });
      ShiftreportsService.getPOTTING(vm.startdate, vm.enddate).then(function (r) {
        for (var i = 0; i < r.data.length; i++) {
          r.data[i].In = r.data[i].In ? parseInt(r.data[i].In) : 0;
          r.data[i].P3 = r.data[i].P3 ? parseInt(r.data[i].P3) : 0;
          r.data[i].Out = r.data[i].Out ? parseInt(r.data[i].Out) : 0;
          var aeq = parseFloat($filter('filter')(vm.modulData, { id: r.data[i].type })[0].aeq);
          r.data[i].InAeq = r.data[i].In * aeq;
          r.data[i].P3Aeq = r.data[i].P3 * aeq;
          r.data[i].OutAeq = r.data[i].Out * aeq;
          vm.pottingData.push(r.data[i]);
          if (i == r.data.length - 1) {
            pottingCharter();
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
          var aeq = parseFloat($filter('filter')(vm.modulData, { id: r.data[i].type })[0].aeq);
          r.data[i].POTOUTAeq = r.data[i].POTOUT * aeq;
          r.data[i].CHOUTAeq = r.data[i].CHOUT * aeq;
          r.data[i].BPOUTAeq = r.data[i].BPOUT * aeq;
          r.data[i].GRADEDAeq = r.data[i].GRADED * aeq;
          vm.mtfData.push(r.data[i]);
          if (i == r.data.length - 1) {
            mtfCharter();
          }
        }
      });
    }
    // Activate
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