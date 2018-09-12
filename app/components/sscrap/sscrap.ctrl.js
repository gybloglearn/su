(function () {
  'use strict';

  angular
    .module('app')
    .controller('SscrapController', SscrapController);

  SscrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'SscrapService'];
  function SscrapController($state, $cookies, $rootScope, $filter, $mdSidenav, SscrapService) {
    var vm = this;
    vm.startdate = new Date();
    vm.enddate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    vm.maxdate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    vm.sm = [];
    vm.load = load;
    vm.loading=false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadpartnumber() {
      vm.aeqs = [];
      SscrapService.getpartnumber().then(function (response) {
        vm.aeqs = response.data;
      })
    }

    function load() {
      vm.sm = [];
      var sdate=$filter('date')(new Date(vm.startdate).getTime(),'yyyy-MM-dd');
      var edate=$filter('date')(new Date(vm.enddate).getTime(),'yyyy-MM-dd');
      vm.loading=true;
      SscrapService.getsheet(sdate,edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].date=response.data[j].Day;
          response.data[j].id = response.data[j].MachineName[0] + response.data[j].MachineName[5] + response.data[j].MachineName[10];
          response.data[j].shiftnum = parseInt(response.data[j].ShiftNum);
          response.data[j].shift = $filter('shift')(response.data[j].ShiftNum, response.data[j].Day);
          response.data[j].Totalsheets = parseFloat(response.data[j].Totalsheets);
          if (response.data[j].ScrapSheets == "") {
            response.data[j].ScrapSheets = 0;
          }
          else {
            response.data[j].ScrapSheets = parseFloat(response.data[j].ScrapSheets);
          }
          response.data[j].Goodsheets = response.data[j].Totalsheets - response.data[j].ScrapSheets;
          for (var k = 0; k < vm.aeqs.length; k++) {
            if (response.data[j].type == vm.aeqs[k].id) {
              response.data[j].aeq = parseFloat(vm.aeqs[k].aeq);
            }
          }
          response.data[j].sumaeq = response.data[j].Totalsheets / response.data[j].SheetNum * response.data[j].aeq;
          response.data[j].goodaeq = (response.data[j].Totalsheets - response.data[j].ScrapSheets) / response.data[j].SheetNum * response.data[j].aeq;
          response.data[j].modul = Math.floor(response.data[j].Totalsheets / response.data[j].SheetNum);
          response.data[j].lsh = (response.data[j].Totalsheets - response.data[j].modul * response.data[j].SheetNum);
          vm.sm.push(response.data[j]);
        }
        scrapload();
      });
    }

    function scrapload() {
      var sdate=$filter('date')(new Date(vm.startdate).getTime(),'yyyy-MM-dd');
      var edate=$filter('date')(new Date(vm.enddate).getTime(),'yyyy-MM-dd');
      SscrapService.getscrap(sdate,edate).then(function (response) {
        for (var i = 0; i < vm.sm.length; i++) {
          vm.sm[i].bad = 0;
          for (var j = 0; j < response.data.length; j++) {
            if (response.data[j].chem == "DS- D12 FLOW") {
              response.data[j].chem = "CS-D12 FLOW";
            }
            if (response.data[j].chem == "DS- D13 CP5") {
              response.data[j].chem = "CS-D13 CP5";
            }

            if (vm.sm[i].Day == response.data[j].day && vm.sm[i].shift == response.data[j].shift && vm.sm[i].MachineName.includes(response.data[j].sm) && (vm.sm[i].PartGroup_Name == response.data[j].chem || vm.sm[i].PartGroup_Name == "DX" && response.data[j].chem == "D12 FLOW")) {
              vm.sm[i].bad += response.data[j].pc;
            }
          }
          console.log(vm.sm[i]);
        }
        vm.loading = false;
      });
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      loadpartnumber();
      load();
    }

  }
})();