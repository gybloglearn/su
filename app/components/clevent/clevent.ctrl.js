(function () {
  'use strict';

  angular
    .module('app')
    .controller('CleventController', CleventController);

  CleventController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'CleventService'];
  function CleventController($state, $cookies, $rootScope, $filter, $mdSidenav, CleventService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (6 * 24 * 3600 * 1000));
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = new Date();
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.maxdate = new Date();
    vm.shifts = ["A", "B", "C", "D"];
    vm.units = ["Első egység", "Második egység", "Harmadik egység"];
    vm.actclor = "";
    vm.actssh = "";
    vm.actesh = "";
    vm.actunit = "";
    vm.beilleszt = beilleszt;
    vm.setChart = setChart;
    vm.loading = false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function beilleszt() {
      vm.startdatumszam = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.loading = true;
      vm.data = [];
      vm.actclor = "";
      vm.actssh = "";
      vm.actesh = "";
      var ed=$filter('date')(new Date(vm.enddate).getTime()+24*3600*1000, 'yyyy-MM-dd');
      CleventService.get(vm.startdatumszam, ed).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var numstart = new Date(vm.data[i].CL_Start).getHours() * 60 + new Date(vm.data[i].CL_Start).getMinutes();
          var numend = new Date(vm.data[i].CL_End).getHours() * 60 + new Date(vm.data[i].CL_End).getMinutes();
          var startshiftnum = 0;
          var endshiftnum = 0;

          if (350 <= numstart && numstart < 1070) {
            startshiftnum = 1
          }
          else {
            startshiftnum = 3;
          }

          if (numstart < 350) {
            vm.data[i].CL_Start = $filter('date')(new Date(vm.data[i].CL_Start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            vm.data[i].Start_shift = $filter('shift')(startshiftnum, vm.data[i].CL_Start);
          }
          else {
            vm.data[i].CL_Start = $filter('date')(new Date(vm.data[i].CL_Start).getTime(), 'yyyy-MM-dd');
            vm.data[i].Start_shift = $filter('shift')(startshiftnum, vm.data[i].CL_Start);
          }

          if (350 <= numend && numend < 1070) {
            endshiftnum = 1
          }
          else {
            endshiftnum = 3;
          }
          if (numend < 350) {
            vm.data[i].CL_End = $filter('date')(new Date(vm.data[i].CL_End).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            vm.data[i].End_shift = $filter('shift')(endshiftnum, vm.data[i].CL_End);
          }
          else if (vm.data[i].CL_End != "") {
            vm.data[i].CL_End = $filter('date')(new Date(vm.data[i].CL_End).getTime(), 'yyyy-MM-dd');
            vm.data[i].End_shift = $filter('shift')(endshiftnum, vm.data[i].CL_End);
          }
        }
        setChart(vm.data, vm.actunit, vm.actclor, vm.actssh, vm.actesh);
        vm.loading = false;
      });
    }

    function setChart(arr, un, cl, assh, aesh) {
      vm.selectclor = [];
      vm.selectclor = $filter('unique')(arr, 'MachineName');

      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: "Összesítő " + vm.actclor },
        series: [
          {
            name: 'Klórozó be',
            color: "#009999",
            data: setIn(arr, un, cl, assh),

          },
          {
            name: 'Klórozó ki',
            color: "#3366ff",
            data: setOut(arr, un, cl, aesh),

          }],
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: "Darab"
          }
        }
      }
    }

    function setIn(t, u, c, ssh) {
      var selectdata = [];
      var interarray = [];
      var days = $filter('unique')(t, 'CL_Start');
      days = $filter('orderBy')(days, 'CL_Start');
      if (u == "Első egység") {
        interarray = $filter('filter')(t, { MachineName: 'Chlorination 4' });
        t = interarray;
      }
      else if (u == "Második egység") {
        for (var i = 0; i < t.length; i++) {
          if (t[i].MachineName == "Chlorination Tank5" || t[i].MachineName == "Chlorination Tank6" || t[i].MachineName == "Chlorination Tank7" || t[i].MachineName == "Chlorination Tank8") {
            interarray.push(t[i]);
          }
        }
        t = interarray;
      }
      else if (u == "Harmadik egység") {
        for (var i = 0; i < t.length; i++) {
          if (t[i].MachineName == "Chlorination Tank11" || t[i].MachineName == "Chlorination Tank12" || t[i].MachineName == "Chlorination Tank13" || t[i].MachineName == "Chlorination Tank14") {
            interarray.push(t[i]);
          }
        }
        t = interarray;
      }
      t = $filter('filter')(t, { Start_shift: ssh });

      if (c == "") {
        for (var i = 0; i < days.length; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_Start == t[j].CL_Start) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_Start, y: db });
        }
      }
      else {
        for (var i = 0; i < days.length; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_Start == t[j].CL_Start && t[j].MachineName == c) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_Start, y: db });
        }
      }
      return selectdata;
    }

    function setOut(t, u, c, esh) {
      var selectdata = [];
      var interarray = [];
      var days = $filter('unique')(t, 'CL_End');
      days = $filter('orderBy')(days, 'CL_End');
      days.shift();
      if (u == "Első egység") {
        interarray = $filter('filter')(t, { MachineName: 'Chlorination 4' });
        t = interarray;
      }
      else if (u == "Második egység") {
        for (var i = 0; i < t.length; i++) {
          if (t[i].MachineName == "Chlorination Tank5" || t[i].MachineName == "Chlorination Tank6" || t[i].MachineName == "Chlorination Tank7" || t[i].MachineName == "Chlorination Tank8") {
            interarray.push(t[i]);
          }
        }
        t = interarray;
      }
      else if (u == "Harmadik egység") {
        for (var i = 0; i < t.length; i++) {
          if (t[i].MachineName == "Chlorination Tank11" || t[i].MachineName == "Chlorination Tank12" || t[i].MachineName == "Chlorination Tank13" || t[i].MachineName == "Chlorination Tank14") {
            interarray.push(t[i]);
          }
        }
        t = interarray;
      }
      t = $filter('filter')(t, { Start_shift: esh });

      if (c == "") {
        for (var i = 0; i < days.length - 1; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_End == t[j].CL_End) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_End, y: db });
        }
      }
      else {
        for (var i = 0; i < days.length - 1; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_End == t[j].CL_End && t[j].MachineName == c) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_End, y: db });
        }
      }
      return selectdata;
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      load();
    }
  }
})();