(function () {
  'use strict';

  angular
    .module('app')
    .controller('WeeksumController', WeeksumController);

  WeeksumController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav','WeeksumService'];
  function WeeksumController($state, $cookies, $rootScope, $filter, $mdSidenav,WeeksumService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.enddate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.maxdate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    vm.createdates=createdates;
    vm.load=false;

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load1000Partnumbers() {
      vm.partnumbers = [];
      WeeksumService.get1000partnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function createdates() {
      vm.days = [];
      vm.loaddays = [];
      vm.data = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        var obj = {
          date: $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          splstart: 0,
          splend: 0,
          pottingin: 0,
          pottingp3: 0,
          pottingout: 0,
          centristart: 0,
          centriend: 0,
          bpstart: 0,
          bpend: 0,
          fluxus: 0,
          grade: 0,
          scrap: 0
        }
        vm.data.push(obj);
        vm.loaddays[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.days.push($filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
      }
      loadbundle();
    }

    function loadbundle() {
      vm.bundledata = [];

      for (var i = 0; i < vm.loaddays.length; i++) {
        vm.counter++;
        WeeksumService.getbundle(vm.loaddays[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            var stnum = new Date(response.data[j].SPL_start).getHours() * 60 + new Date(response.data[j].SPL_start).getMinutes();
            var endnum = new Date(response.data[j].SPL_end).getHours() * 60 + new Date(response.data[j].SPL_end).getMinutes();

            if (stnum < 350) {
              response.data[j].SPL_start_day = $filter('date')(new Date(response.data[j].SPL_start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].SPL_start_day = $filter('date')(new Date(response.data[j].SPL_start).getTime(), 'yyyy-MM-dd');
            }
            if (endnum < 350) {
              response.data[j].SPL_end_day = $filter('date')(new Date(response.data[j].SPL_end).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].SPL_end_day = $filter('date')(new Date(response.data[j].SPL_end).getTime(), 'yyyy-MM-dd');
            }

            for (var k = 0; k < vm.partnumbers.length; k++) {
              if (response.data[j].bundle.includes(vm.partnumbers[k].bundle)) {
                response.data[j].aeq = vm.partnumbers[k].aeq / 2;
              }
            }
            if (response.data[j].aeq) {
              vm.bundledata.push(response.data[j]);
            }
          }
        });
      }
      loadpotting();
    }

    function loadpotting() {
      vm.load = true;
      var sdate = $filter('date')(new Date(vm.startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      WeeksumService.getpotting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumbers[i].modul)) {
              response.data[j].aeq = vm.partnumbers[i].aeq;
            }
          }

          var pottingford = new Date(response.data[j].Potting_Flip).getHours() * 60 + new Date(response.data[j].Potting_Flip).getMinutes();
          var takeoutnum = new Date(response.data[j].Brick_Takeout).getHours() * 60 + new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugestartnum = new Date(response.data[j].Centrifuga_Start).getHours() * 60 + new Date(response.data[j].Centrifuga_Start).getMinutes();
          var centrifugestopnum = new Date(response.data[j].Centrifuga_Stop).getHours() * 60 + new Date(response.data[j].Centrifuga_Stop).getMinutes();
          //var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (pottingford < 350) {
            response.data[j].Potting_Flip_Day = $filter('date')(new Date(response.data[j].Potting_Flip).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Potting_Flip_Day = $filter('date')(new Date(response.data[j].Potting_Flip).getTime(), 'yyyy-MM-dd');
          }
          if (takeoutnum < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugestartnum < 350) {
            response.data[j].Centrifuga_Start_Day = $filter('date')(new Date(response.data[j].Centrifuga_Start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Start_Day = $filter('date')(new Date(response.data[j].Centrifuga_Start).getTime(), 'yyyy-MM-dd');
          }
          if (centrifugestopnum < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          /*if (gradenum < 350) {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
          }*/

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].Brick_Potting_Init__Day) {
              vm.data[k].pottingin += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Potting_Flip_Day) {
              vm.data[k].pottingp3 += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Brick_Takeout_Day) {
              vm.data[k].pottingout += response.data[j].aeq;
            }

            if (vm.data[k].date == response.data[j].Centrifuga_Start_Day) {
              vm.data[k].centristart += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Centrifuga_Stop_Day) {
              vm.data[k].centriend += response.data[j].aeq;
            }

            /*if (vm.data[k].date == response.data[j].Grade_Day && response.data[j].Grade != "Scrap") {
              vm.data[k].grade += response.data[j].aeq;
            }

            if (vm.data[k].date == response.data[j].Grade_Day && response.data[j].Grade == "Scrap") {
              vm.data[k].scrap += response.data[j].aeq;
            }*/
          }
        }
        loadetf();
      });
    }

    function loadetf() {
      var sdate = $filter('date')(new Date(vm.startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      WeeksumService.getetf(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumbers[i].modul)) {
              response.data[j].aeq = vm.partnumbers[i].aeq;
            }
          }
          var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (gradenum < 350) {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
          }
          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].BP_start_shiftday) {
              vm.data[k].bpstart += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].BP_end_shiftday) {
              vm.data[k].bpend += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Perm_test_shiftday) {
              vm.data[k].fluxus += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Grade_Day && response.data[j].Grade != "Scrap" && response.data[j].Grade != "") {
              vm.data[k].grade += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Grade_Day && response.data[j].Grade == "Scrap") {
              vm.data[k].scrap += response.data[j].aeq;
            }
          }
        }
        createbundledata();
      });
    }

    function createbundledata() {
      for (var i = 0; i < vm.data.length; i++) {
        for (var j = 0; j < vm.bundledata.length; j++) {
          if (vm.data[i].date == vm.bundledata[j].SPL_start_day) {
            vm.data[i].splstart += vm.bundledata[j].aeq;
          }
          if (vm.data[i].date == vm.bundledata[j].SPL_end_day) {
            vm.data[i].splend += vm.bundledata[j].aeq;
          }
        }
      }
      createchart();
    }

    function createchart() {
      var spldata = [];
      var pottingdata = [];
      var centrifugadata = [];
      var bpdata = [];
      var fluxusdata = [];
      var gradedata = [];
      var scrapdata = [];
      var target = [];

      for (var b = 0; b < vm.data.length; b++) {
        spldata.push(vm.data[b].splend);
        pottingdata.push(vm.data[b].pottingout);
        centrifugadata.push(vm.data[b].centriend);
        bpdata.push(vm.data[b].bpend);
        fluxusdata.push(vm.data[b].fluxus);
        gradedata.push(vm.data[b].grade);
        scrapdata.push(vm.data[b].scrap);
        var targ = 0;
        switch ($filter('date')(new Date(vm.data[b].date), "MM")) {
          case '06': targ = 69; break;
          case '07': targ = 80; break;
          case '08': targ = 80; break;
          default: targ = 80; break;
          //default: targ = 69; break;
        }
        target.push(targ);
      }
      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'ZW1000 Termékvonal' },
        subTitle: { text: 'MES adatok megjelenítése' },
        tooltip: {
          valueDecimals: 2
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        xAxis: { type: 'category', categories: vm.days },
        series: [
          { name: 'SPL end', data: spldata, stack: 'spl', color: 'rgb(54,147,248)' },
          { name: 'Potting end', data: pottingdata, stack: 'potting', color: 'rgb(255,152,33)' },
          { name: 'Centrifuga end', data: centrifugadata, stack: 'centrifuge', color: 'rgb(156,151,255)' },
          { name: 'BP end', data: bpdata, stack: 'bp', color: 'rgb(0,92,185)' },
          { name: 'Fluxus', data: fluxusdata, stack: 'fluxus', color: 'rgb(153, 102, 255)' },
          { name: 'Scrap', data: scrapdata, stack: 'grade', color: 'rgb(222,37,51)' },
          { name: 'Grade', data: gradedata, stack: 'grade', color: 'rgb(70,173,0)' },
          { name: 'Cél', type: 'line', color: 'Green', data: target }
        ]
      };
      vm.load = false;
    }

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
      }
      load1000Partnumbers();
    }
  }
})();