(function () {
  'use strict';

  angular
    .module('app')
    .controller('RewindersumController', RewindersumController);

  RewindersumController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'RewindersumService'];
  function RewindersumController($state, $cookies, $rootScope, $filter, $mdSidenav, RewindersumService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
    vm.enddate = new Date(new Date().getTime() - 24 * 3600 * 1000);
    vm.startdatumszam = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
    vm.maxdate = new Date(new Date().getTime() - 24 * 3600 * 1000);
    vm.loading=false;
    vm.load = load;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.data = [];
      vm.startdatumszam = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
      vm.loading=true;

      var datediff = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000) + 1;
      for (var i = datediff; i > 0; i--) {
        var actnum = $filter('date')(new Date(vm.enddate).getTime() - (i - 1) * 24 * 3600 * 1000, 'yyyyMMdd');
        var counter = datediff;
        RewindersumService.get(actnum).then(function (response) {
          counter--;
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].shift = $filter('shift')(response.data[j].ShiftNum, response.data[j].date);
            response.data[j].ProducedLength = response.data[j].ProducedLength * 1;
            response.data[j].P_Count = response.data[j].P_Count * 1;
            vm.data.push(response.data[j])
          }
          if (counter == 0) {
            console.log(vm.data);
          }
          createchartdata(vm.data, datediff);
          vm.loading = false;
        });
      }
    }

    function createchartdata(arr, num) {

      vm.chartdata = [];
      for (var i = num; i > 0; i--) {
        var obj = {};
        obj = {
          date: $filter('date')(new Date(vm.enddate).getTime() - (i - 1) * 24 * 3600 * 1000, 'yyyy-MM-dd'),
          dayaeq: 0,
          daycount: 0,
          nightaeq: 0,
          nightcount: 0
        }
        vm.chartdata.push(obj);
      }
      for (var j = 0; j < vm.chartdata.length; j++) {
        for (var k = 0; k < arr.length; k++) {
          if (vm.chartdata[j].date == arr[k].date && arr[k].ShiftNum == "1") {
            vm.chartdata[j].dayaeq += (arr[k].ProducedLength / 9300);
            vm.chartdata[j].daycount += arr[k].P_Count;
          }
          else if (vm.chartdata[j].date == arr[k].date && arr[k].ShiftNum == "3") {
            vm.chartdata[j].nightaeq += (arr[k].ProducedLength / 9300);
            vm.chartdata[j].nightcount += arr[k].P_Count;
          }
        }
      }
      setChart(vm.chartdata, arr);
    }

    function setChart(ar1, ar2) {
      vm.chartconfig_col = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: "Összesítő" },
        series: [
          {
            name: 'Nappal AEQ',
            color: "#ff6600",
            data: nap_aeq(ar1),
            stack: 'AEQ'
          },
          {
            name: 'Éjjel AEQ',
            color: "#0066ff",
            data: ej_aeq(ar1),
            stack: 'AEQ'
          },
          {
            name: 'Nappal Dob',
            color: "#ffcc00",
            data: nap_dob(ar1),
            stack: 'Dob'
          },
          {
            name: 'Éjjel Dob',
            color: "#00ccff",
            data: ej_dob(ar1),
            stack: 'Dob'
          }],
        drilldown: {
          series: createdrilldown(ar1, ar2)
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: "AEQ-Dob"
          }
        }
      }
    }

    function nap_aeq(t) {
      var daeq = []
      for (var i = 0; i < t.length; i++) {
        daeq.push({ name: t[i].date, y: parseInt(t[i].dayaeq), drilldown: t[i].date + "nappalaeq" });
      }
      return daeq;
    }
    function ej_aeq(t) {
      var naeq = []
      for (var i = 0; i < t.length; i++) {
        naeq.push({ name: t[i].date, y: parseInt(t[i].nightaeq), drilldown: t[i].date + "éjjelaeq" });
      }
      return naeq;
    }
    function nap_dob(t) {
      var dd = []
      for (var i = 0; i < t.length; i++) {
        dd.push({ name: t[i].date, y: parseInt(t[i].daycount), drilldown: t[i].date + "nappaldob" });
      }
      return dd;
    }
    function ej_dob(t) {
      var nd = []
      for (var i = 0; i < t.length; i++) {
        nd.push({ name: t[i].date, y: parseInt(t[i].nightcount), drilldown: t[i].date + "éjjeldob" });
      }
      return nd;
    }
    function feltolt_x(t) {
      var dates = []
      for (var i = 0; i < t.length; i++) {
        dates.push(t[i].date);
      }
      return dates;
    }
    function createdrilldown(t1, t2) {
      var dd = [];



      for (var i = 0; i < t1.length; i++) {
        var naeq = [];
        var eaeq = [];
        var ndob = [];
        var edob = [];
        for (var j = 0; j < t2.length; j++) {
          if (t1[i].date == t2[j].date && t2[j].ShiftNum == "1") {
            naeq.push([t2[j].MachineName, parseInt(t2[j].ProducedLength / 9300)]);
            ndob.push([t2[j].MachineName, parseInt(t2[j].P_Count)]);
          }
          else if (t1[i].date == t2[j].date && t2[j].ShiftNum == "3") {
            eaeq.push([t2[j].MachineName, parseInt(t2[j].ProducedLength / 9300)]);
            edob.push([t2[j].MachineName, parseInt(t2[j].P_Count)]);
          }
        }
        dd.push({ name: t1[i].date + "nappalaeq", id: t1[i].date + "nappalaeq", data: naeq });
        dd.push({ name: t1[i].date + "éjjelaeq", id: t1[i].date + "éjjelaeq", data: eaeq });
        dd.push({ name: t1[i].date + "nappaldob", id: t1[i].date + "nappaldob", data: ndob });
        dd.push({ name: t1[i].date + "éjjeldob", id: t1[i].date + "éjjeldob", data: edob });
      }
      return dd;
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