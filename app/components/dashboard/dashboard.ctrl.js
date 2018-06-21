(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter', 'DashboardService'];
  function DashboardController($state, $cookies, $rootScope, $filter, DashboardService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.startdatenum = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.enddatenum = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.maxdate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    /*var sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    var pottings = ["Potting2", "Potting3", "Potting4"];*/
    vm.beallit = beallit;
    vm.loading = false;

    activate();

    ////////////////

    function beallit() {
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      createdataarray();
    }

    function createdataarray() {
      vm.loading = true;
      vm.data = [];
      vm.dates = [];
      vm.datefile = [];
      var firstnum = new Date(vm.startdatenum).getTime();
      var endnum = new Date(vm.enddatenum).getTime();

      while (firstnum <= endnum) {
        var obj = {
          date: $filter('date')(firstnum, 'yyyy-MM-dd'),
          rewinder: 0,
          spl36: 0,
          spl2345: 0,
          sm: 0,
          potting: 0,
          cl: 0,
          bp: 0,
          rework: 0,
          graded: 0,
          spl1000: 0,
          pottingstatic1000: 0,
          centrifugeend1000: 0,
          bpend1000: 0,
          grade1000: 0,
          spl1500: 0,
          pottingflip1500: 0,
          centrifugeend1500: 0,
          bpend1500: 0,
          grade1500: 0
        }
        vm.data.push(obj);
        vm.dates.push($filter('date')(firstnum, 'yyyy-MM-dd'));
        vm.datefile.push($filter('date')(firstnum, 'yyyyMMdd'));
        firstnum += 24 * 3600 * 1000;
      }
      loadrewinder();
      loadspinline();
      loadsm();
      lodpotting();
      //loadclorination();
      loadrework();
      loadmtf();
      load1000potting();
      load1500etf();
      loadbundle();
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      DashboardService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }
    function load1000Partnumbers() {
      vm.partnumberszw1000 = [];
      DashboardService.get1000partnumber().then(function (response) {
        vm.partnumberszw1000 = response.data;
        console.log(vm.partnumberszw1000);
      });
    }

    function loadrewinder() {
      angular.forEach(vm.dates, function (v, k) {
        DashboardService.getrewinder(v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].date == v) {
                vm.data[k].rewinder += response.data[j].ProducedLength / 9300;
              }
            }
          }
        });
      });
    }

    function loadspinline() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getspinline(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].item1) {
              if ((response.data[j].machine == "SpinLine #136" || response.data[j].machine == "SpinLine #236")) {
                vm.data[i].spl36 += response.data[j].textbox2;
              }
              else {
                vm.data[i].spl2345 += response.data[j].textbox2;
              }
            }
          }
        }
      });
    }

    function loadsm() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getsm(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = (response.data[j].Totalsheets / response.data[j].SheetNum) * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].Day) {
              vm.data[i].sm += response.data[j].aeq;
            }
          }
        }
      });
    }

    function lodpotting() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getpotting(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = response.data[j].Out * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq) {
              vm.data[i].potting = vm.data[i].potting + response.data[j].aeq;
            }
          }
        }
      });
    }

    function loadclorination() {
      DashboardService.getclorination(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].CL_End = $filter('date')(new Date(response.data[j].CL_End), 'yyyy-MM-dd');
          response.data[j].type = response.data[j].JobID.substring(2, 9);
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = 1 * vm.partnumbers[i].aeq;
            }
          }
        }
      });
    }

    function loadrework() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getrework(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].BaaNCode) {
              response.data[j].aeq = 1 * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].shiftday && response.data[j].state == "BP") {
              vm.data[i].bp += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].shiftday && response.data[j].state == "Rework") {
              vm.data[i].rework += response.data[j].aeq;
            }
          }
        }
      });
    }

    function loadmtf() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getmtf(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = response.data[j].GRADED * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].Day && response.data[j].aeq) {
              vm.data[i].graded += response.data[j].aeq;
            }
          }
        }
        vm.loading = false;
      });
    }

    function load1000potting() {
      var sdate = $filter('date')(new Date(vm.startdatenum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.get1000potting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumberszw1000.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumberszw1000[i].modul)) {
              response.data[j].aeq = vm.partnumberszw1000[i].aeq;
            }
          }
          var takeoutnum=new Date(response.data[j].Brick_Takeout).getHours()*60+new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugestopnum=new Date(response.data[j].Centrifuga_Stop).getHours()*60+new Date(response.data[j].Centrifuga_Stop).getMinutes();
          var gradenum=new Date(response.data[j].Gradedate).getHours()*60+new Date(response.data[j].Gradedate).getMinutes();

          if(takeoutnum<350){
            response.data[j].Brick_Takeout_Day=$filter('date')(new Date(response.data[j].Brick_Takeout).getTime()-(24*3600*1000),'yyyy-MM-dd');
          }
          else{
            response.data[j].Brick_Takeout_Day=$filter('date')(new Date(response.data[j].Brick_Takeout).getTime(),'yyyy-MM-dd');
          }

          if(centrifugestopnum<350){
            response.data[j].Centrifuga_Stop_Day=$filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime()-(24*3600*1000),'yyyy-MM-dd');
          }
          else{
            response.data[j].Centrifuga_Stop_Day=$filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(),'yyyy-MM-dd');
          }

          if(gradenum<350){
            response.data[j].Grade_Day=$filter('date')(new Date(response.data[j].Gradedate).getTime()-(24*3600*1000),'yyyy-MM-dd');
          }
          else{
            response.data[j].Grade_Day=$filter('date')(new Date(response.data[j].Gradedate).getTime(),'yyyy-MM-dd');
          }

          for(var k=0;k<vm.data.length;k++){
            if(vm.data[k].date==response.data[j].Brick_Takeout_Day){
              vm.data[k].pottingstatic1000+=response.data[j].aeq
            }

            if(vm.data[k].date==response.data[j].Centrifuga_Stop_Day){
              vm.data[k].centrifugeend1000+=response.data[j].aeq
            }

            if(vm.data[k].date==response.data[j].Grade_Day){
              vm.data[k].grade1000+=response.data[j].aeq
            }
          }
        }
        console.log(response.data);
      });
    }

    function load1500etf() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.get1500etf(vm.startdatenum, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          var number = 0;
          if (response.data[j].startdate != "") {
            number = new Date(response.data[j].startdate).getHours() * 60 + new Date(response.data[j].startdate).getMinutes();
            if (number < 350) {
              response.data[j].day = $filter('date')(new Date(response.data[j].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].day = $filter('date')(new Date(response.data[j].startdate), 'yyyy-MM-dd');
            }
          }
          response.data[j].Amount = 1;
          response.data[j].AEQ = 1.2;

          for (var i = 0; i < vm.data.length; i++) {
            if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Potting flip") {
              vm.data[i].pottingflip1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Centrifuge end") {
              vm.data[i].centrifugeend1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "BP end") {
              vm.data[i].bpend1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Grade") {
              vm.data[i].grade1500 += response.data[j].AEQ;
            }
          }
        }
        console.log(vm.data);
      });
    }

    function loadbundle() {
      angular.forEach(vm.datefile, function (v, k) {
        DashboardService.getbundlefile(v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            var num = new Date(response.data[j].SPL_end).getHours() * 60 + new Date(response.data[j].SPL_end).getMinutes();
            if (num < 350) {
              response.data[j].SPL_end = $filter('date')(new Date(response.data[j].SPL_end).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].SPL_end = $filter('date')(new Date(response.data[j].SPL_end).getTime(), 'yyyy-MM-dd');
            }
            if (response.data[j].bundle.includes("3132313")) {
              response.data[j].Amount = 1;
              response.data[j].AEQ = 1.2;
            }
            else {
              for (var k = 0; k < vm.partnumberszw1000.length; k++) {
                if (response.data[j].bundle.includes(vm.partnumberszw1000[k].bundle)) {
                  response.data[j].Amount = 1;
                  response.data[j].AEQ = vm.partnumberszw1000[k].aeq / 2;
                }
              }
            }
            for (var i = 0; i < vm.data.length; i++) {
              if (vm.data[i].date == response.data[j].SPL_end && response.data[j].bundle.includes("3132313")) {
                vm.data[i].spl1500 += response.data[j].AEQ;
              }
              else if (vm.data[i].date == response.data[j].SPL_end && !response.data[j].bundle.includes("3132313")) {
                vm.data[i].spl1000 += response.data[j].AEQ;
              }
            }
          }
        });
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
      loadPartnumbers();
      load1000Partnumbers();
      createdataarray();
    }
  }
})();