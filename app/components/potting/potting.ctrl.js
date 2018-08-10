(function () {
  'use strict';

  angular
    .module('app')
    .controller('PottingController', PottingController);

  PottingController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'PottingService'];
  function PottingController($state, $cookies, $rootScope, $filter, $mdSidenav, PottingService) {
    var vm = this;
    vm.date = new Date();
    vm.datenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.beallit = beallit;
    vm.loading=false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadpartnumbers() {
      vm.partnumbers = [];
      PottingService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
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
      loadpotting();
    }

    function loadpotting(){
      vm.loading = true;

      vm.pottingdata = [];
      vm.centridata = [];
      var sdate = $filter('date')(new Date(vm.date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      PottingService.getpotting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.partnumbers.length; k++) {
            if (response.data[j].jobid.includes(vm.partnumbers[k].modul)) {
              response.data[j].aeq = vm.partnumbers[k].aeq;
              response.data[j].modulname = vm.partnumbers[k].name;
            }
          }
          var pottingendminutes = new Date(response.data[j].Brick_Takeout).getHours()*60+new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugaminutes = new Date(response.data[j].Centrifuga_Stop).getHours()*60+new Date(response.data[j].Centrifuga_Stop).getMinutes();

          if (pottingendminutes < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout_Day).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout_Day).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugaminutes < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          if (pottingendminutes >= 50) {
            response.data[j].Brick_Takeout_Hour = new Date(response.data[j].Brick_Takeout).getHours() + 1;
          }
          else {
            response.data[j].Brick_Takeout_Hour = new Date(response.data[j].Brick_Takeout).getHours()
          }
          if (response.data[j].Brick_Takeout_Day == vm.datenum) {
            vm.pottingdata.push(response.data[j]);
          }

          if (centrifugaminutes >= 50) {
            response.data[j].Centrifuga_Stop_Hour = new Date(response.data[j].Centrifuga_Stop).getHours() + 1;
          }
          else {
            response.data[j].Centrifuga_Stop_Hour = new Date(response.data[j].Centrifuga_Stop).getHours()
          }
          if (response.data[j].Centrifuga_Stop_Day == vm.datenum) {
            vm.centridata.push(response.data[j]);
          }
        }
        create_chart()
        vm.loading = false;
      });
    }

    function create_chart() {
      vm.chartdata =
        [
          { name: 'Potting', color: 'rgb(0,0,255)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Potting kumulált', color: 'rgb(0,0,255)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Centrifuga', color: 'rgb(102, 0, 102)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Centrifuga kumulált', color: 'rgb(102,0,102)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];
      for (var i = 0; i <vm.pottingdata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.pottingdata[i].Brick_Takeout_Hour  == parseInt(vm.cats[j])) {
            vm.chartdata[0].data[j]++;
            //vm.chartdata[0].data[j] += vm.data[i].aeq;
          }

        }
      }
      for (var i = 0; i < vm.centridata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.centridata[i].Centrifuga_Stop_Hour == parseInt(vm.cats[j])) {
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
        title: { text: "Potting és centrifuga adatok órai lebontása" },
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
      }
      loadpartnumbers();
      createhours();
    }
  }
})();