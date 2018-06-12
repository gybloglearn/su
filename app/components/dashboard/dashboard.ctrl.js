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
    var sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    var pottings = ["Potting2", "Potting3", "Potting4"];
    vm.beallit=beallit;
    vm.loading=false;

    activate();

    ////////////////

    function beallit(){
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      createdataarray();
    }

    function createdataarray() {
      vm.loading=true;
      vm.data = [];
      vm.dates = [];
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
          graded:0
        }
        vm.data.push(obj);
        vm.dates.push($filter('date')(firstnum, 'yyyy-MM-dd'));
        firstnum += 24 * 3600 * 1000;
      }
      loadrewinder();
      loadspinline();
      loadsm();
      lodpotting();
      //loadclorination();
      loadrework();
      loadmtf();
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      DashboardService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function loadrewinder() {
      angular.forEach(vm.dates, function (v, k) {
        DashboardService.getrewinder(v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            for (var k = 0; k < vm.data.length; k++) {
              if(vm.data[k].date==v){
              vm.data[k].rewinder += response.data[j].ProducedLength / 9300;}
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

    function loadmtf(){
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
        vm.loading=false;
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
      createdataarray();
    }
  }
})();