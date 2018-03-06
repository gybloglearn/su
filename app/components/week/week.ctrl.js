(function () {
  'use strict';

  angular
    .module('app')
    .controller('WeekController', WeekController);

  WeekController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ShiftreportsService', 'ModulListService', 'SmplansService'];
  function WeekController($state, $cookies, $rootScope, $filter, $mdSidenav, ShiftreportsService, ModulListService, SmplansService) {
    var vm = this;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    vm.data = [];
    vm.daystocover = [];
    vm.displaydata = [];
    vm.zwsm = ["SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.zwpo = ["Potting2", "Potting3", "Potting4"];

    vm.colorize = colorize;
    vm.targetize = targetize;
    vm.load = load;
    vm.changeDate = changeDate;
    vm.filterSMs = filterSMs;
    activate();

    ////////////////

    function changeDate() {
      vm.startdate = $filter('date')(vm.std, 'yyyy-MM-dd');
      load();
    }

    function colorize(number, field, shiftnum) {
      var target = 0;
      var div = shiftnum > 0 ? 2 : 1;
      switch (field) {
        case 'sm':
          //var number = $filter('sumField')($filter('filter')(vm.data, {machine: 'SheetMaker', shift: shiftnum}), 'sumaeq');
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1 - vm.rates.smscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'potting':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'bp':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'min':
          target = (vm.rates.min / div) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
      }
      if (number > 0) {
        return number < target ? 'red' : 'green';
      }
    }

    function targetize(field, shiftnum){
      var target = 0;
      var div = shiftnum > 0 ? 2 : 1;
      switch (field) {
        case 'sm':
          //var number = $filter('sumField')($filter('filter')(vm.data, {machine: 'SheetMaker', shift: shiftnum}), 'sumaeq');
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1 - vm.rates.smscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'potting':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'bp':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'min':
          target = (vm.rates.min / div) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
      }
     return target;
    }

    function targetSheets(sm){
      var target = 0;
      if(sm.constructor === Array){
        for(var s=0;s<sm.length;s++){
          var numb = $filter('filter')(vm.smplans, { machine: sm[s] })[0];
          target += parseFloat(numb.amount) / 60 * vm.passedmins[0];
        }
      } else {
        var numb = $filter('filter')(vm.smplans, { machine: sm })[0];
        target = parseFloat(numb.amount) / 60 * vm.passedmins[0];
      }
      return $filter('number')(target, 0);
    }

    function smcolor(sm, val) {
      var target = 0;
      var numb = $filter('filter')(vm.smplans, { machine: sm })[0];
      target = parseFloat(numb.amount) / 60 * vm.passedmins[0];
      if (val > 0) {
        return val < target ? 'red' : 'green';
      }
    }


    function loadPartnumbers() {
      vm.partnumbers = [];
      ModulListService.get().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function loadSMPlans() {
      vm.smplans = [];
      SmplansService.get().then(function (response) {
        vm.smplans = response.data;
        for (var i = 0; i < vm.smplans.length; i++) {
          vm.smplans[i].machine = vm.smplans[i].sm.replace('SM', 'SheetMaker');
        }
        vm.targetSheets = targetSheets;
        vm.smcolor = smcolor;
      });
    }

    function load() {
      vm.load = true;
      vm.data = [];
      vm.daystocover = [];
      vm.reworkobj = [
        { shiftnum: 1, shift: $filter('shift')(1, vm.startdate) },
        { shiftnum: 3, shift: $filter('shift')(3, vm.startdate) }
      ];
      vm.szamlalo = 0;
      var dt = "";
      var ds = 1;
      for (var i = 0; i < ds; i++) {
        dt = $filter('date')(new Date(vm.startdate).getTime() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
        vm.daystocover.push(dt);
      }
      vm.enddate = $filter('date')(new Date(vm.startdate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');

      //ZW500
      ShiftreportsService.getSM(vm.startdate, $filter('date')(new Date(vm.startdate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].MachineName != "SheetMaker1" && response.data[r].MachineName != "SheetMaker2") {
            response.data[r].machine = "Sheetmaker";
            response.data[r].partnumber = response.data[r].type;
            //response.data[r].shiftnum = response.data[r].ShiftNum;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, true);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].Totalsheets = parseInt(response.data[r].Totalsheets);
            response.data[r].ScrapSheets = response.data[r].ScrapSheets ? parseInt(response.data[r].ScrapSheets) : 0;
            response.data[r].sumgoodaeq = response.data[r].aeq * (response.data[r].Totalsheets - response.data[r].ScrapSheets);
            vm.data.push(response.data[r]);
          }
        }
      });
      ShiftreportsService.getPOTTING(vm.startdate, $filter('date')(new Date(vm.startdate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].MachineName != "Potting1-1" && response.data[r].MachineName != "Potting1-2") {
            response.data[r].machine = "Potting";
            response.data[r].partnumber = response.data[r].type;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].In = response.data[r].In != "" ? parseInt(response.data[r].In) : 0;
            response.data[r].P3 = response.data[r].P3 != "" ? parseInt(response.data[r].P3) : 0;
            response.data[r].Out = response.data[r].Out != "" ? parseInt(response.data[r].Out) : 0;
            response.data[r].suminaeq = response.data[r].aeq * response.data[r].In;
            response.data[r].sump3aeq = response.data[r].aeq * response.data[r].P3;
            response.data[r].sumoutaeq = response.data[r].aeq * response.data[r].Out;
            vm.data.push(response.data[r]);
          }
        }
      });

      ShiftreportsService.getMTF(vm.startdate, $filter('date')(new Date(vm.startdate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].PartGroup_Name != "UBB FLOW") {
            response.data[r].machine = "MTF";
            response.data[r].partnumber = response.data[r].type;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].BOKES = response.data[r].BOKES * 1;
            response.data[r].CHOUT = response.data[r].CHOUT != "" ? parseInt(response.data[r].CHOUT) : 0;
            response.data[r].BPOUT = response.data[r].BPOUT != "" ? parseInt(response.data[r].BPOUT) : 0;
            response.data[r].GRADED = response.data[r].GRADED != "" ? parseInt(response.data[r].GRADED) : 0;
            response.data[r].choutaeq = response.data[r].aeq * response.data[r].CHOUT;
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].BPOUT;
            response.data[r].gradeaeq = response.data[r].aeq * response.data[r].GRADED;
            vm.data.push(response.data[r]);
          }
        }
      });

      ShiftreportsService.getRework(vm.startdate, $filter('date')(new Date(vm.startdate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].BaaNCode != "3149069") {
            response.data[r].machine = "Rework";
            response.data[r].partnumber = response.data[r].BaaNCode;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].BaaNCode, false);
            for (var ob = 0; ob < vm.reworkobj.length; ob++) {
              if (response.data[r].shift == vm.reworkobj[ob].shift) {
                response.data[r].shiftnum = vm.reworkobj[ob].shiftnum;
              }
            }
            vm.data.push(response.data[r]);
          }
        }
        vm.load = false;
      });


      vm.rates = {
        smscrap: 0.8,
        modscrap: 0.5,
        min: 226,
        zbsmscrap: 5,
        zbmodscrap: 3,
        zbbp: 0,
        zbmin: 0,
        zw1000min: 56,
        zw1500min: 60
      }

      vm.passedmins = [];
      if ((new Date().getTime() - new Date(vm.startdate + " 05:50:00").getTime()) / 1000 / 60 > 1440) {
        vm.passedmins[1] = 720;
        vm.passedmins[3] = 720;
        vm.passedmins[0] = 1440;
      } else {
        vm.pms = (new Date().getTime() - new Date(vm.startdate + " 05:50:00").getTime()) / 1000 / 60;
        if (vm.pms < 720) {
          vm.passedmins[1] = vm.pms;
          vm.passedmins[3] = 0;
          vm.passedmins[0] = vm.pms;
        } else {
          vm.passedmins[1] = 720;
          vm.passedmins[3] = vm.pms - 720;
          vm.passedmins[0] = vm.pms;
        }
      }
    }

    function filterSMs(sms) {
      var result = [];
      var dt = $filter('filter')(vm.data, vm.search);
      for (var i = 0; i < dt.length; i++) {
        if (sms.indexOf(dt[i].MachineName) > -1) {
          result.push(dt[i]);
        }
      }
      return result;
    }

    function aeqser(type, forsheet) {
      var aeq = 0;
      for (var x = 0; x < vm.aeqs.length; x++) {
        if (vm.aeqs[x].name === type) {
          if (forsheet) {
            aeq = vm.aeqs[x].amount / vm.aeqs[x].sheets;
          } else {
            aeq = vm.aeqs[x].amount;
          }
        } else {
        }

      }
      return aeq;
    }

    function aeqserloadpartnumbers(type, forsheet) {
      var aeq = 0;
      for (var x = 0; x < vm.partnumbers.length; x++) {
        if (vm.partnumbers[x].id === type) {
          if (forsheet) {
            aeq = vm.partnumbers[x].aeq / vm.partnumbers[x].sheets;
          } else {
            aeq = vm.partnumbers[x].aeq * 1;
          }
        } else {
        }

      }
      return aeq;
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        //vm.enddate = $filter('date')(new Date(vm.startdate).getTime()+7*24*60*60*1000, 'yyyy-MM-dd');
        vm.std = vm.startdate;
        //vm.enddate = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
        vm.search = {};
        loadPartnumbers();
        loadSMPlans();
        vm.load();
      }
    }
  }
})();