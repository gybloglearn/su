(function () {
  'use strict';

  angular
    .module('app')
    .controller('UfController', UfController);

  UfController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'UfService'];
  function UfController($state, $cookies, $rootScope, $filter, $mdSidenav, UfService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.enddate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.startdatenum = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.beallit=beallit;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function beallit(){
      vm.startdatenum=$filter('date')(new Date(vm.startdate).getTime(),'yyyy-MM-dd');
      vm.enddatenum=$filter('date')(new Date(vm.enddate).getTime(),'yyyy-MM-dd');
      createdates();
    }

    function createdates() {
      vm.days = [];
      vm.loaddays = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        vm.days[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.loaddays[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
      }
      loadetf();
    }

    function loadetf() {
      vm.load = true;
      vm.data = [];
      var edt = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      UfService.getetf(vm.startdatenum, edt).then(function (response) {
        vm.data = response.data;

        for (var i = 0; i < vm.data.length; i++) {
          var number = 0;
          if (vm.data[i].startdate != "") {
            number = new Date(vm.data[i].startdate).getHours() * 60 + new Date(vm.data[i].startdate).getMinutes();
            if (number < 350) {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate), 'yyyy-MM-dd');
            }
          }
          vm.data[i].Amount = 1;
          vm.data[i].AEQ = 1.2;
        }
        loadbundle();
      });
    }

    function loadbundle() {
      vm.bundledata = [];
      vm.xAxisData = [];
      vm.bundleChartData = []; vm.pstart = []; vm.centri = []; vm.bp = []; vm.grade = []; vm.target = [];
      var counter = 0;
      for (var i = 0; i < vm.loaddays.length; i++) {
        UfService.getbundlefile(vm.loaddays[i]).then(function (rsp) {
          counter++;
          for (var j = 0; j < rsp.data.length; j++) {
            if (rsp.data[j].bundle.includes("3132313")) {
              rsp.data[j].SPL_Start_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_start);
              rsp.data[j].SPL_start = $filter('date')($filter('changeDate')(rsp.data[j].SPL_start), 'yyyy-MM-dd');
              rsp.data[j].SPL_Start_Shift = $filter('shift')(rsp.data[j].SPL_Start_Shiftnum, rsp.data[j].SPL_start);

              rsp.data[j].SPL_End_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_end);
              rsp.data[j].SPL_end = $filter('date')($filter('changeDate')(rsp.data[j].SPL_end), 'yyyy-MM-dd');
              rsp.data[j].SPL_Start_Shift = $filter('shift')(rsp.data[j].SPL_End_Shiftnum, rsp.data[j].SPL_end);

              rsp.data[j].Amount = 1;
              rsp.data[j].AEQ = 1.2;
              vm.bundledata.push(rsp.data[j]);
            }
          }
          if (counter == vm.loaddays.length) {
            var k = $filter('unique')(vm.bundledata, 'SPL_end');
            for (var ki = 0; ki < k.length - 1; ki++) {
              vm.xAxisData.push(k[ki].SPL_end);
              vm.bundleChartData.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.bundledata, { SPL_end: k[ki].SPL_end }), 'AEQ')) });
              vm.pstart.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Static potting init 1500', day: k[ki].SPL_end }), 'AEQ')) });
              vm.centri.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Centrifuge end', day: k[ki].SPL_end }), 'AEQ')) });
              vm.bp.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'BP end', day: k[ki].SPL_end }), 'AEQ')) });
              vm.grade.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Grade', day: k[ki].SPL_end }), 'AEQ')) });
              vm.target.push({ name: k[ki].SPL_end, y: 60 });
            }
          }
          vm.chartconfig = {
            chart: { type: 'column' },
            title: { text: 'ZW1500 Termékvonal' },
            subTitle: { text: 'MES adatok megjelenítése' },
            xAxis: { type: 'category', categories: vm.xAxisData },
            series: [
              { name: 'SPL end', data: vm.bundleChartData },
              { name: 'Potting Start', data: vm.pstart },
              { name: 'Centrifuga End', data: vm.centri },
              { name: 'BP End', data: vm.bp },
              { name: 'Grade', data: vm.grade },
              { name: 'Cél', type: 'line', color: 'Green', data: vm.target }
            ]
          };
          vm.load = false;
        });
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
      /*vm.chartconfig = {
        chart: {}
      };*/
      createdates();
    }
  }
})();