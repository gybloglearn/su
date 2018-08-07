(function () {
  'use strict';

  angular
    .module('app')
    .controller('WeeksumController', WeeksumController);

  WeeksumController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'WeeksumService'];
  function WeeksumController($state, $cookies, $rootScope, $filter, $mdSidenav, WeeksumService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.enddate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.maxdate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    vm.createdates=createdates;
    vm.load = false;


    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function createdates() {
      vm.days = [];
      vm.loaddays = [];
      var differencedate = 0;
      vm.startdatenum = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
      differencedate = Math.round((new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000));
      console.log(differencedate);
      for (var i = 0; i <= differencedate; i++) {
        vm.days[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.loaddays[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
      }
      loadetf();
    }

    function loadetf() {
      vm.load = true;
      vm.data = [];
      var gradedata = [];
      var edate = $filter('date')(new Date(vm.enddate).getTime()+(24*3600*1000), 'yyyy-MM-dd');
      WeeksumService.getetf(vm.startdatenum,edate ).then(function (response) {
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
        WeeksumService.getmodulhistory(vm.startdatenum,edate).then(function (response) {
          gradedata = response.data;
          for (var i = 0; i < vm.data.length; i++) {
            for (var j = 0; j < gradedata.length; j++) {
              if (vm.data[i].PhaseName == "Grade" && vm.data[i].jobid == gradedata[j].jobid) {
                vm.data[i].grade = gradedata[j].Grade;
              }
            }
          }
          console.log(vm.data);
          loadbundle()
        });
      });
    }

    function loadbundle() {
      vm.bundledata = [];
      vm.xAxisData = [];
      vm.bundleChartData = []; vm.pstart = []; vm.centri = []; vm.bp = []; vm.goodgrade = []; vm.scrapgrade = []; vm.target = [];
      var counter = 0;
      for (var i = 0; i < vm.loaddays.length; i++) {
        WeeksumService.getbundlefile(vm.loaddays[i]).then(function (rsp) {
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
            var k = $filter('unique')($filter('orderBy')(vm.bundledata,'SPL_end'), 'SPL_end');
            console.log(k);
            for (var ki = 0; ki < k.length; ki++) {
              vm.xAxisData.push(k[ki].SPL_end);
              vm.bundleChartData.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.bundledata, { SPL_end: k[ki].SPL_end }), 'AEQ')) });
              vm.pstart.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Static potting init 1500', day: k[ki].SPL_end }), 'AEQ')) });
              vm.centri.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Centrifuge end', day: k[ki].SPL_end }), 'AEQ')) });
              vm.bp.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'BP end', day: k[ki].SPL_end }), 'AEQ')) });
              //              vm.grade.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Grade', day: k[ki].SPL_end }), 'AEQ')) });
              //--FONTOS!!-- év elején átírtni!!
              var targ = 0;
              switch ($filter('date')(k[ki].SPL_end, "MM")) {
                case '01': targ = 60; break;
                case '02': targ = 60; break;
                case '03': targ = 60; break;
                case '04': targ = 60; break;
                case '05': targ = 70; break;
                case '06': targ = 80; break;
                case '07': targ = 80; break;
                case '08': targ = 80; break;
                case '09': targ = 80; break;
                case '10': targ = 80; break;
                case '11': targ = 74; break;
                case '12': targ = 74; break;
              }
              vm.target.push({ name: k[ki].SPL_end, y: targ });
              vm.scrapgrade.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Grade', grade: 'Scrap', day: k[ki].SPL_end }), 'AEQ')) });
              vm.goodgrade.push({ name: k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, { PhaseName: 'Grade', grade: '!Scrap', day: k[ki].SPL_end }), 'AEQ')) });
            }
          }
          console.log(vm.xAxisData);
          vm.chartconfig = {
            chart: { type: 'column' },
            title: { text: 'ZW1500 Termékvonal' },
            subTitle: { text: 'MES adatok megjelenítése' },
            plotOptions: {
              column: {
                stacking: 'normal'
              }
            },
            xAxis: { type: 'category', categories: vm.xAxisData },
            series: [
              { name: 'SPL end', data: vm.bundleChartData, stack: 'spl', color: 'rgb(54,147,248)' },
              { name: 'Potting Start', data: vm.pstart, stack: 'potting', color: 'rgb(255,152,33)' },
              { name: 'Centrifuga End', data: vm.centri, stack: 'centrifuge', color: 'rgb(156,151,255)' },
              { name: 'BP End', data: vm.bp, stack: 'bp', color: 'rgb(0,92,185)' },
              { name: 'Scrap', data: vm.scrapgrade, stack: 'grade', color: 'rgb(222,37,51)' },
              { name: 'Grade', data: vm.goodgrade, stack: 'grade', color: 'rgb(70,173,0)' },
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
      //createdates();
    }
  }
})();