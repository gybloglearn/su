(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter', 'FluxusService'];
  function DashboardController($state, $cookies, $rootScope, $filter, FluxusService) {
    var vm = this;
    vm.date = new Date();
    vm.datenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.beallit = beallit;
    vm.loading=false;

    activate();

    ////////////////

    function loadpartnumbers() {
      vm.partnumbers = [];
      FluxusService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function beallit() {
      vm.datenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd')
      createhours();
    }

    function createhours() {
      vm.cats = [];
      for (var i = 6; i < 24; i++) {
        vm.cats.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        vm.cats.push("0" + j);
      }
      loadfluxus()
    }

    function loadfluxus() {

      vm.loading = true;

      vm.data = [];
      vm.impdata = [];
      var sdate = $filter('date')(new Date(vm.date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      FluxusService.getetf(sdate, edate).then(function (response) {

        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.partnumbers.length; k++) {
            if (response.data[j].jobid.includes(vm.partnumbers[k].modul)) {
              response.data[j].aeq = vm.partnumbers[k].aeq;
              response.data[j].modulname = vm.partnumbers[k].name;
            }
          }
          response.data[j].Perm_gep = response.data[j].Perm_gép;

          var minutes = new Date(response.data[j].Perm_test).getMinutes();
          var impminutes = new Date(response.data[j].Impregnation_end).getMinutes();

          if (minutes >= 50) {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours() + 1;
          }
          else {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours()
          }
          if (response.data[j].Perm_test_shiftday == vm.datenum) {
            vm.data.push(response.data[j]);
          }

          if (impminutes >= 50) {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours() + 1;
          }
          else {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours()
          }
          if (response.data[j].Impregnation_end_shiftday == vm.datenum) {
            vm.impdata.push(response.data[j]);
          }
        }
        create_chart()
        vm.loading = false;
      });
    }

    function create_chart() {
      vm.chartdata =
        [
          { name: 'Fluxus', color: 'rgb(0,0,255)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Fluxus kumulált', color: 'rgb(0,0,255)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Impregnálás', color: 'rgb(102, 0, 102)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Impregnálás kumulált', color: 'rgb(102,0,102)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];
      for (var i = 0; i < vm.data.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.data[i].fluxus_hour == parseInt(vm.cats[j])) {
            vm.chartdata[0].data[j]++;
            //vm.chartdata[0].data[j] += vm.data[i].aeq;
          }

        }
      }
      for (var i = 0; i < vm.impdata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.impdata[i].impregnation_hour == parseInt(vm.cats[j])) {
            vm.chartdata[2].data[j]++;
            //vm.chartdata[1].data[j] += vm.impdata[i].aeq;
          }

        }
        for (var k = 0; k < 24; k++) {
          if(k > 0){
            vm.chartdata[1].data[k] = vm.chartdata[1].data[k-1] + vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[3].data[k-1] + vm.chartdata[2].data[k];
            vm.chartdata[4].data[k] = vm.chartdata[4].data[k-1] + 3.7;
          } else {
            vm.chartdata[1].data[k] = vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[2].data[k];
            vm.chartdata[4].data[k] = 3.7;
          }
        }
      }
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 360
        },
        title: { text: "Fluxus és impregnálás adatok órai lebontása" },
        tooltip: {
          valueDecimals: 0
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: [{ title:{text:'Darab'}}, {title: {text: 'Kumulált Darab'}, opposite: true}],
        series: vm.chartdata
      };
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
      loadpartnumbers();
      createhours();
    }
  }
})();