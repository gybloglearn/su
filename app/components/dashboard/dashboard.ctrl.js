(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter', 'DashboardService'];
  function DashboardController($state, $cookies, $rootScope, $filter, DashboardService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.loadall = loadall;

    activate();

    ////////////////

    function loadall() {
      vm.loading = true;
      vm.data = [];
      vm.data[0] = [];
      vm.data[1] = [];
      vm.data[2] = [];
      vm.startdatenum = $filter('date')(vm.startdate, 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(vm.enddate, 'yyyy-MM-dd');
      loadsl();
      loaddowntime();
      loadscrap();
      console.log(vm.data);
    }

    function loadsl() {
      DashboardService.getsl(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].machine == "SpinLine #136" || response.data[i].machine == "SpinLine #236") {
            vm.data[0].push(response.data[i]);
          }
        }
        var t = new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime();
        var tim = t / 60 / 60 / 24 / 1000 + 1;
        vm.qtconf = {
          chart: { type: "column", marginTop: 20 },
          plotOptions: {},
          title: { text: "" },
          tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span style="color:{series.color}"> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} AEQ</span> ({point.meter:,.0f} m)</span><br/>' },
          series: [
            {
              name: "Tény", color: "rgb(100,150,200)",
              dataLabels: { enabled: true, useHTML: true, format: "<span style='font-weight: bold'>{point.y:.0f} AEQ</span>" },
              data: [
                { y: parseFloat($filter('sumField')($filter('filter')(vm.data[0], { machine: "SpinLine #136" }), 'textbox2')), meter: parseFloat($filter('sumField')($filter('filter')(vm.data[0], { machine: "SpinLine #136" }), 'val')) },
                { y: parseFloat($filter('sumField')($filter('filter')(vm.data[0], { machine: "SpinLine #236" }), 'textbox2')), meter: parseFloat($filter('sumField')($filter('filter')(vm.data[0], { machine: "SpinLine #236" }), 'val')) }
              ]
            },
            {
              name: "Terv", color: "rgb(50,200,100)",
              dataLabels: { enabled: true, useHTML: true, format: "<span style='font-weight: bold'>{point.y:.0f} AEQ</span>" },
              data: [
                { y: 110 * tim, meter: tim * 110 * 9300 },
                { y: 110 * tim, meter: tim * 110 * 9300 }
              ]
            }
          ],
          xAxis: { type: "category", categories: ["SpinLine #136", "SpinLine #236"] },
          legend: { verticalAlign: "top", x: 0, y: 20 }
        }
      });
    }
    function loaddowntime() {
      DashboardService.getdowntime(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Duration_s_ = response.data[i].Duration_s_ == '' ? 0 : parseInt(response.data[i].Duration_s_);
          vm.data[1].push(response.data[i]);
        }
        vm.loading = false;
        var t = new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime();
        var tim = t / 60 / 60 / 24 / 1000 + 1;
        vm.dtconf = {
          chart: { type: "column", marginTop: 20, zoomType: "y" },
          plotOptions: { column: { stacking: "normal", pointPadding: 0, borderWidth: 0 } },
          title: { text: "" },
          tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span style="color:{series.color}"> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span> ({point.min:,.0f} perc)</span><br/>' },
          series: [
            {
              name: "Váratlan Gépleállás",
              color: "rgb(255,0,0)",
              data: [
                { cat: 'SpinLine #136', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Váratlan gépleállás" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Váratlan gépleállás" }), 'Duration_s_')) / 60 },
                { cat: 'SpinLine #236', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Váratlan gépleállás" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Váratlan gépleállás" }), 'Duration_s_')) / 60 }
              ]
            },
            {
              name: "Tervezett állás",
              color: "rgb(50,100,200)",
              data: [
                { cat: 'SpinLine #136', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Tervezett állás" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Tervezett állás" }), 'Duration_s_')) / 60 },
                { cat: 'SpinLine #236', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Tervezett állás" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Tervezett állás" }), 'Duration_s_')) / 60 }
              ]
            },
            {
              name: "Fonatoló hiba",
              color: "rgb(150,150,150)",
              data: [
                { cat: 'SpinLine #136', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_')) / 60 },
                { cat: 'SpinLine #236', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_')) / 60 }
              ]
            },
            {
              name: "Operátor hiba",
              color: "rgb(200,50,200)",
              data: [
                { cat: 'SpinLine #136', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Operátor hiba" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101", Reason_group_Name: "Operátor hiba" }), 'Duration_s_')) / 60 },
                { cat: 'SpinLine #236', y: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Operátor hiba" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102", Reason_group_Name: "Operátor hiba" }), 'Duration_s_')) / 60 }
              ]
            },
            {
              name: "Elérhető idő",
              color: "rgb(100,200,50)",
              dataLabels: { enabled: true, useHTML: true, format: "<span style='font-weight: bold;'>{point.y:.2f} %</span>" },
              data: [
                { cat: 'SpinLine #136', y: 100 - parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: ((tim * 1440 * 60) - parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL101" }), 'Duration_s_'))) / 60 },
                { cat: 'SpinLine #236', y: 100 - parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102" }), 'Duration_s_')) / (tim * 1440 * 60) * 100, min: ((tim * 1440 * 60) - parseFloat($filter('sumField')($filter('filter')(vm.data[1], { Machine: "SPL102" }), 'Duration_s_'))) / 60 }
              ]
            }
          ],
          xAxis: { type: "category", categories: ["SpinLine #136", "SpinLine #236"] },
          yAxis: { min: 50, max: 120 },
          legend: { verticalAlign: "top", x: 0, y: 20, align: "right", backgroundColor: '#FFFFFF' }
        }
      });
    }
    function loadscrap() {
      DashboardService.getscrap(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].Cikkszam == "3111366" || response.data[i].Cikkszam == "3111377") {
            response.data[i].Mennyiseg = parseInt(response.data[i].Mennyiseg);
            vm.data[2].push(response.data[i]);
          }
        }
        vm.scconf = {
          chart: { type: "column", marginTop: 20 },
          plotOptions: { column: { stacking: "normal", pointPadding: 0, borderWidth: 0 } },
          title: { text: "" },
          series: [
            {
              name: "Selejt %",
              color: "orange",
              dataLabels: { enabled: true, useHTML: true, format: "<span style='font-weight:bold'>{point.y:.2f} %</span>" },
              tooltip: { headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span style="color:{series.color}"> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span><br> Braid: {point.brmeter:,.0f} m <br> Fiber: {point.fbmeter:,.0f} m </span><br/>' },
              data: [
                {
                  cat: 'Scrap',
                  y: parseFloat($filter('sumField')(vm.data[2], 'Mennyiseg')) / parseFloat($filter('sumField')(vm.data[0], 'val')) * 100,
                  fbmeter: parseFloat($filter('sumField')($filter('filter')(vm.data[2], { Cikkszam: "3111377" }), 'Mennyiseg')),
                  brmeter: parseFloat($filter('sumField')($filter('filter')(vm.data[2], { Cikkszam: "3111366" }), 'Mennyiseg'))
                },
              ]
            },
            {
              name: "Jó fiber %",
              color: "rgb(100,200,50)",
              dataLabels: { enabled: true, useHTML: true, format: "<span style='font-weight:bold'>{point.y:.2f} %</span>" },
              tooltip: { headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span style="color:{series.color}"> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span></span><br/>' },
              data: [
                {
                  cat: 'Scrap',
                  y: 100 - parseFloat($filter('sumField')(vm.data[2], 'Mennyiseg')) / parseFloat($filter('sumField')(vm.data[0], 'val')) * 100
                }
              ]
            }
          ],
          xAxis: { type: "category", categories: ["Összes selejt"] },
          yAxis:{min:60},
          legend: { verticalAlign: "top", x: 0, y: 20, align: "right", backgroundColor: '#FFFFFF' }
        }
      });
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.shift = $filter('shift')(1, new Date());
      }
      loadall();
    }
  }
})();