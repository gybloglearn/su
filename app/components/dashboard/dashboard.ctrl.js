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
          //zw500
          sm: 0,
          potting: 0,
          cl: 0,
          bp: 0,
          rework: 0,
          graded: 0,
          sap0500: 0,
          //zb
          zbsm: 0,
          zbpotting: 0,
          zbbp: 0,
          zbrework: 0,
          zbgraded: 0,
          sapZB: 0,
          //zl
          zlsm: 0,
          zlpotting: 0,
          zlbp: 0,
          zlrework: 0,
          zlgraded: 0,
          sapZL: 0,
          //zw1000
          spl1000: 0,
          pottingstatic1000: 0,
          centrifugeend1000: 0,
          bpend1000: 0,
          grade1000: 0,
          sap1000: 0,
          //zw1500
          spl1500: 0,
          pottingflip1500: 0,
          centrifugeend1500: 0,
          bpend1500: 0,
          grade1500: 0,
          sap1500: 0
        }
        vm.data.push(obj);
        vm.dates.push($filter('date')(firstnum, 'yyyy-MM-dd'));
        vm.datefile.push($filter('date')(firstnum, 'yyyyMMdd'));
        firstnum += 24 * 3600 * 1000;
      }
      var targetobj = {
        date: $filter('date')(firstnum, 'yyyy-MM-dd'),
        rewinder: 226 * 1.005 * 1.014 * 1.022 * 1.0178,
        spl36: 194 * 1.005 * 1.014 * 1.022,
        spl2345: 32 * 1.005 * 1.014 * 1.022,
        //zw500
        sm: 226 * 1.005 * 1.014,
        potting: 226 * 1.005,
        cl: 226 * 1.005,
        bp: 226 * 1.005,
        rework: 0,
        graded: 226,
        //zb
        zbsm: 0,
        zbpotting: 0,
        zbbp: 0,
        zbrework: 0,
        zbgraded: 0,
        //zl
        zlsm: 0,
        zlpotting: 0,
        zlbp: 0,
        zlrework: 0,
        zlgraded: 0,
        //zw1000
        spl1000: 70 * 1.003 * 1.006 * 1.007,
        pottingstatic1000: 70 * 1.003 * 1.006,
        centrifugeend1000: 70 * 1.003 * 1.006,
        bpend1000: 70 * 1.003,
        grade1000: 70,
        //zw1500
        spl1500: 80 * 1.008 * 1.007,
        pottingflip1500: 80 * 1.008,
        centrifugeend1500: 80 * 1.008,
        bpend1500: 80,
        grade1500: 80
      };

      vm.target = targetobj;

      loadrewinder();
      loadspinline();
      loadsm();
      lodpotting();
      //loadclorination();
      loadrework();
      loadmtf();
      load1000potting();
      load1000etf();
      load1500etf();
      loadbundle();
      loadsap();
    }


    function loadsap(){
      DashboardService.getsap().then( function (response) {
        var d = response.data;
        for(var j=0;j< d.data.length;j++){
          var t = $filter('date')(new Date(d.data[j].NAP).getTime(), 'yyyy-MM-dd');
          for(var i=0; i<vm.data.length;i++){
            if(t == vm.data[i].date){
              console.log(d.data[j]);
              vm.data[i].sap0500 = d.data[j].ZW0500Actual;
              vm.data[i].sap1000 = d.data[j].ZW1000Actual;
              vm.data[i].sap1500 = d.data[j].ZW1500Actual;
              vm.data[i].sapZB = d.data[j].ZBActual;
              vm.data[i].sapZL = d.data[j].ZLActual;
            }
          }
        }
      });
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      DashboardService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }
    function load1000Partnumbers() {
      vm.partnumberszw1000 = [];
      DashboardService.get1000partnumber().then(function (response) {
        vm.partnumberszw1000 = response.data;
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
            if (vm.data[i].date == response.data[j].Day && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].sm += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && (response.data[j].type == "3149069" || response.data[j].type == "3160038")) {
              vm.data[i].zbsm += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].type == "3148766") {
              vm.data[i].zlsm += response.data[j].aeq;
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
            if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].potting = vm.data[i].potting + response.data[j].aeq;
            }
            else if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && (response.data[j].type == "3149069" || response.data[j].type == "3160038" || response.data[j].type == "3148766")) {
              vm.data[i].zbpotting += response.data[j].aeq * 4;
            }
            else if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type == "3148766") {
              vm.data[i].zlpotting += response.data[j].aeq;
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
            response.data[j].shiftday = $filter('date')(new Date(response.data[j].shiftstart).getTime(), 'yyyy-MM-dd');
            if (vm.data[i].date == response.data[j].shiftday) {
              if(response.data[j].state == "BP"){
                if (response.data[j].BaaNCode != "3149069" && response.data[j].BaaNCode != "3160038" && response.data[j].BaaNCode != "3148766") {
                  vm.data[i].bp += response.data[j].aeq;
                }
                else if ((response.data[j].BaaNCode == "3149069" || response.data[j].BaaNCode == "3160038")) {
                  vm.data[i].zbbp += response.data[j].aeq;
                }
                else if (response.data[j].BaaNCode == "3148766") {
                  vm.data[i].zlbp += response.data[j].aeq;
                }
              }
              if(response.data[j].state == "Rework") {
                if (response.data[j].BaaNCode != "3149069" && response.data[j].BaaNCode != "3160038" && response.data[j].BaaNCode != "3148766") {
                  vm.data[i].rework += response.data[j].aeq;
                }
                else if ((response.data[j].BaaNCode == "3149069" || response.data[j].BaaNCode == "3160038" || response.data[j].BaaNCode == "3148766")) {
                  vm.data[i].zbrework += response.data[j].aeq;
                }
                else if (response.data[j].BaaNCode == "3148766") {
                  vm.data[i].zlrework += response.data[j].aeq;
                }
              }
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
            if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].graded += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && (response.data[j].type == "3149069" || response.data[j].type == "3160038" || response.data[j].type == "3148766")) {
              vm.data[i].zbgraded += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type == "3148766") {
              vm.data[i].zlgraded += response.data[j].aeq;
            }
          }
        }
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
          var takeoutnum = new Date(response.data[j].Brick_Takeout).getHours() * 60 + new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugestopnum = new Date(response.data[j].Centrifuga_Stop).getHours() * 60 + new Date(response.data[j].Centrifuga_Stop).getMinutes();
          var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (takeoutnum < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugestopnum < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          if (gradenum < 350) {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
          }

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].Brick_Takeout_Day) {
              vm.data[k].pottingstatic1000 += response.data[j].aeq
            }

            if (vm.data[k].date == response.data[j].Centrifuga_Stop_Day) {
              vm.data[k].centrifugeend1000 += response.data[j].aeq
            }

            if (vm.data[k].date == response.data[j].Grade_Day) {
              vm.data[k].grade1000 += response.data[j].aeq
            }
          }
        }
        vm.loading = false;
      });
    }

    function load1000etf() {
      var sdate = $filter('date')(new Date(vm.startdatenum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      DashboardService.get1000etf(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumberszw1000.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumberszw1000[i].modul)) {
              response.data[j].aeq = vm.partnumberszw1000[i].aeq;
            }
          }

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].BP_end_shiftday) {
              vm.data[k].bpend1000 += response.data[j].aeq;
            }
          }
        }
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
              response.data[j].day = $filter('date')(new Date(response.data[j].startdate).getTime(), 'yyyy-MM-dd');
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