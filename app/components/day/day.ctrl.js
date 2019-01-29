(function () {
  'use strict';

  angular
    .module('app')
    .controller('DayController', DayController);

  DayController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DayService'];
  function DayController($state, $cookies, $rootScope, $filter, $mdSidenav, DayService) {
    var vm = this;
    vm.date = new Date();
    vm.datenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.shifts = [1, 3];
    vm.load = false;
    vm.getrewinder = getrewinder;
    vm.target = target;
    vm.iconize = iconize;
    vm.rewindertarget = rewindertarget;
    vm.actshiftnum = "";
    vm.meteraeq = "aeq";
    vm.rewindernum = 152000;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function create_rewinders() {
      vm.rewinders = [];
      for (var i = 1; i < 18; i++) {
        if (i == 1) {
          vm.rewinders.push("Rewinder0" + i);
        }
        else {
          vm.rewinders.push("Rewinder" + i);
        }
      }
    }

    function getplans() {
      vm.allplans = [];
      DayService.getplan().then(function (resp) {
        vm.allplans = resp.data;
      });
    }

    function getrewinder() {
      vm.datenum = $filter('date')(new Date(vm.date), 'yyyy-MM-dd');
      vm.data = [];
      vm.load = true;
      DayService.get(vm.datenum).then(function (response) {
        var d = response.data;
        for (var j = 0; j < d.length; j++) {
          if (d[j].MachineName == "Rewinder1") {
            d[j].MachineName = "Rewinder01";
          }
          d[j].ShiftNum = d[j].ShiftNum * 1;
          d[j].ProducedLength = d[j].ProducedLength * 1;
          d[j].ProducedLength_aeq = d[j].ProducedLength / 8900;
        }
        vm.data = d;
        vm.load = false;
        console.log(vm.data);
        rewindertarget();
      });
    }

    function rewindertarget() {
      vm.rwtarget = 0;
      var mdate=$filter('date')(new Date(vm.maxdate).getTime(), 'yyyy-MM-dd');
      var ddate=$filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');

      if (mdate == ddate) {
        var num = new Date().getHours() * 60 + new Date().getMinutes();
        if (vm.actshiftnum == 1) {
          if (num >= 350 && num <= 1070) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num - 350);
          }
        }
        else if (vm.actshiftnum == 3) {
          if (num > 1070) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num - 1070);
          }
          else if (num < 350) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num + 370);
          }
        }
        else {
          if (num >= 350 && num <= 1070) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num - 350);
          }
          else if (num > 1070) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num - 350);
          }
          else if (num < 350) {
            vm.rwtarget = (vm.rewindernum / 1440) * (num + 1090);
          }
        }
      }
      else {
        if (vm.actshiftnum == 1 || vm.actshiftnum == 3) {
          vm.rwtarget = vm.rewindernum / 2;
        }
        else {
          vm.rwtarget = vm.rewindernum;
        }
      }
    }

    function target(shiftnum) {
      var mdate=$filter('date')(new Date(vm.maxdate).getTime(), 'yyyy-MM-dd');
      var ddate=$filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      var target = 0;
      var dayaeq = 0;
      var daymeter = 0;
      if (vm.meteraeq == "aeq") {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.datenum && vm.allplans[i].enddate >= vm.datenum) {
            dayaeq = vm.allplans[i].aeq;
          }
        }

        if (mdate == ddate) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (dayaeq / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (dayaeq / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (dayaeq / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = dayaeq / 2;
          }
          else {
            target = dayaeq;
          }
        }
      }
      else {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.datenum && vm.allplans[i].enddate >= vm.datenum) {
            daymeter = vm.allplans[i].amount;
          }
        }

        if (mdate == ddate) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (daymeter / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (daymeter / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (daymeter / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = daymeter / 2;
          }
          else {
            target = daymeter;
          }
        }
      }
      return target;
    }

    function iconize(number, shiftnum) {
      var mdate=$filter('date')(new Date(vm.maxdate).getTime(), 'yyyy-MM-dd');
      var ddate=$filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      var target = 0;
      var dayaeq = 0;
      var daymeter = 0;

      if (vm.meteraeq == "aeq") {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.datenum && vm.allplans[i].enddate >= vm.datenum) {
            dayaeq = vm.allplans[i].aeq;
          }
        }

        if (mdate == ddate) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (dayaeq / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (dayaeq / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (dayaeq / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = dayaeq / 2;
          }
          else {
            target = dayaeq;
          }
        }
      }
      else {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.datenum && vm.allplans[i].enddate >= vm.datenum) {
            daymeter = vm.allplans[i].amount;
          }
        }

        if (mdate == ddate) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (daymeter / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (daymeter / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (daymeter / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = daymeter / 2;
          }
          else {
            target = daymeter;
          }
        }
      }
      
      if (number > 0) {
       /* console.log(target);
        console.log(number);
        return number < target ? 'red' : 'green';*/
        if(number<target){
          return 'red';
        }
        else{
          return 'green'
        }
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
      create_rewinders();
      getplans();
      getrewinder();
    }
  }
})();