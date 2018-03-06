(function () {
  'use strict';

  angular
    .module('app')
    .controller('SapController', SapController);

  SapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ShiftreportsService'];
  function SapController($state, $cookies, $rootScope, $filter, $mdSidenav, ShiftreportsService) {
    var vm = this;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    vm.qs = [
      {from: '01-01', to: '12-31'},
      {from: '01-01', to: '03-31'},
      {from: '04-01', to: '06-30'},
      {from: '07-01', to: '09-30'},
      {from: '10-01', to: '12-31'}
    ];
    vm.load = load;
    vm.colorize = colorize;

    activate();

    ////////////////

    function colorize(number){
      if(number < 0) {
        return 'red';
      } else {
        return 'green';
      }
    }

    function chartize(data, q) {
      var zw500p = [], zw500a = [], zw500d = [], zw500kd = [];
      var zw1000p = [], zw1000a = [], zw1000d = [], zw1000kd = [];
      var zw1500p = [], zw1500a = [], zw1500d = [], zw1500kd = [];
      var zbp = [], zba = [], zbd = [], zbkd = [];
      var zlp = [], zla = [], zld = [], zlkd = [];
      var zeroline = [];

      for (var i = 0; i < data.data.length; i++) {
        if (new Date(data.data[i].NAP).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000 && new Date(data.data[i].NAP).getTime() <= new Date(new Date().getFullYear() + "-" + vm.qs[vm.q].to).getTime() && new Date(data.data[i].NAP).getTime() >= new Date(new Date().getFullYear() + "-" + vm.qs[vm.q].from).getTime()) {
          zeroline.push({ x: new Date(data.data[i].NAP).getTime(), y: 0, color: '#005CB9' });

          zw500p.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW0500Plan, color: '#005CB9' });
          zw500a.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW0500Actual, highlight: data.data[i].ZW0500Diff < 0 ? '#de2533' : '#46ad00' });
          zw500d.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW0500Diff, color: data.data[i].ZW0500Diff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW0500Diff < 0 ? '#de2533' : '#46ad00' });
          zw500kd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW0500kummDIFF, color: data.data[i].ZW0500kummDIFF < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW0500kummDIFF < 0 ? '#de2533' : '#46ad00' });
          vm.zw500chconfig = returnChartConf('ZW500', data.crdate, zw500a, zw500d, zw500kd, zeroline, zw500p);

          zbp.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZBPlan, color: '#005CB9' });
          zba.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZBActual, highlight: data.data[i].ZBDiff < 0 ? '#de2533' : '#46ad00' });
          zbd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZBDiff, color: data.data[i].ZBDiff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZBDiff < 0 ? '#de2533' : '#46ad00' });
          zbkd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZBkummDiff, color: data.data[i].ZBkummDiff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZBkummDiff < 0 ? '#de2533' : '#46ad00' });
          vm.zbchconfig = returnChartConf('ZeeBlok', data.crdate, zba, zbd, zbkd, zeroline, zbp);

          zlp.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZLPlan, color: '#005CB9' });
          zla.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZLActual, highlight: data.data[i].ZLDiff < 0 ? '#de2533' : '#46ad00' });
          zld.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZLDiff, color: data.data[i].ZLDiff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZLDiff < 0 ? '#de2533' : '#46ad00' });
          zlkd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZLkummDIFF, color: data.data[i].ZLkummDIFF < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZLkummDIFF < 0 ? '#de2533' : '#46ad00' });
          vm.zlchconfig = returnChartConf('ZeeLung', data.crdate, zla, zld, zlkd, zeroline, zlp);

          zw1000p.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1000Plan, color: '#005CB9' });
          zw1000a.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1000Actual, highlight: data.data[i].ZW1000Diff < 0 ? '#de2533' : '#46ad00' });
          zw1000d.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1000Diff, color: data.data[i].ZW1000Diff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW1000Diff < 0 ? '#de2533' : '#46ad00' });
          zw1000kd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1000kummDIFF, color: data.data[i].ZW1000kummDIFF < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW1000kummDIFF < 0 ? '#de2533' : '#46ad00' });
          vm.zw1000chconfig = returnChartConf('ZW1000', data.crdate, zw1000a, zw1000d, zw1000kd, zeroline, zw1000p);

          zw1500p.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1500Plan, color: '#005CB9' });
          zw1500a.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1500Actual, highlight: data.data[i].ZW1500Diff < 0 ? '#de2533' : '#46ad00' });
          zw1500d.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1500Diff, color: data.data[i].ZW1500Diff < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW1500Diff < 0 ? '#de2533' : '#46ad00' });
          zw1500kd.push({ x: new Date(data.data[i].NAP).getTime(), y: data.data[i].ZW1500kummDIFF, color: data.data[i].ZW1500kummDIFF < 0 ? '#de2533' : '#46ad00', highlight: data.data[i].ZW1500kummDIFF < 0 ? '#de2533' : '#46ad00' });
          vm.zw1500chconfig = returnChartConf('ZW1500', data.crdate, zw1500a, zw1500d, zw1500kd, zeroline, zw1500p);

        }
      }

    }
    function returnChartConf(name, crdate, a, d, kd, z, p) {
      var chartconfig = {};
      chartconfig = {
        chart: { zoomType: 'x' },
        title: { text: 'SAP mennyiségek ' + name },
        subtitle: { text: 'frissítve: ' + crdate },
        rangeSelector: { selected: 0 },
        plotOptions: {
          column: { stacking: 'Normal' }, line: { stacking: 'Normal' }, series: {
            fillOpacity: 0.1
          },
        },
        tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{point.highlight};font-weight:bold">{point.y}</span></span><br/>' },
        xAxis: {
          crosshair: true,
          type: 'datetime',
          dateTimeLabelFormats: {
            month: '%e. %b',
            year: '%b'
          },
          title: {
            text: 'Dátum'
          }
        },
        yAxis: [
          { title: { text: 'AEQ / DAY' } },
          { opposite: true, title: { text: 'QTD difference to PLAN' } }
        ],
        series: [
          { name: name + ' aktuális', data: a, type: 'area', color: 'rgb(100,150,200)', lineWidth: 3 },
          { name: name + ' terv', data: p, type: 'area', color: 'rgb(150,200,50)', lineWidth: 3 },
          { name: name + ' Különbség', data: d, type: 'column', color: 'rgb(255,255,255)', yAxis: 1, lineWidth: 0, borderWidth: 0 },
          { name: name + ' Kumulált Különbség', data: kd, type: 'line', yAxis: 1, lineWidth: 3, color: '#005CB9', marker: { enabled: true, radius: 3 } },
          //{ name: '0', data: z, type: 'scatter', color: 'rgba(0,0,0,.6)', lineWidth: 3, yAxis: 1, marker: { enabled: false }, showInLegend: false, tooltip: { enabled: false } }
        ]
      }
      return chartconfig;
    }

    function load() {
      vm.data = [];
      ShiftreportsService.getSAP().then(function (r) {
        vm.data = r.data;
        for(var i=0; i<vm.data.data.length;i++){
          var q = 1;
          switch(parseInt($filter('date')(new Date(vm.data.data[i].NAP).getTime(), 'MM'))){
            case 1: case 2: case 3: q = 1; break;
            case 4: case 5: case 6: q = 2; break;
            case 7: case 8: case 9: q = 3; break;
            case 10: case 11: case 12: q = 4; break;
          }
          vm.data.data[i].Q = q;
          vm.data.data[i].HO = $filter('date')(new Date(vm.data.data[i].NAP).getTime(), 'MM');
          vm.data.data[i].WEEK = $filter('date')(new Date(vm.data.data[i].NAP).getTime(), 'ww');
        }
        chartize(vm.data, vm.q);
      });
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        var mth = new Date().getMonth();
        switch (mth) {
          case 0:
          case 1:
          case 2: vm.q = 1; break;
          case 3:
          case 4:
          case 5: vm.q = 2; break;
          case 6:
          case 7:
          case 8: vm.q = 3; break;
          case 9:
          case 10:
          case 11: vm.q = 4; break;
        }
        vm.load();
      }
    }
  }
})();