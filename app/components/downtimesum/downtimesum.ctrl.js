(function () {
  'use strict';

  angular
    .module('app')
    .controller('DowntimesumController', DowntimesumController);

  DowntimesumController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DowntimesumService'];
  function DowntimesumController($state, $cookies, $rootScope, $filter, $mdSidenav, DowntimesumService) {
    var vm = this;
    vm.maxdate = new Date();
    vm.sdate = new Date(new Date().getTime() - 6 * 24 * 3600 * 1000);
    vm.edate = new Date();
    vm.pottings = ["Potting4", "Potting3"];
    vm.place = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.categories = ["Száradási időre várás szárítóban", "Száradási időre várás forgatáson", "Száradási időre várás esztétikán", "Uretánkötési probléma forgatásnál", "Egyéb"];
    vm.shifts = ["A", "B", "C", "D"];
    vm.actshift = "";
    vm.actpotting = "";
    vm.selectinfo = selectinfo;

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
      DowntimesumService.getAll().then(function (response) {
        for (var i = 0; i < vm.people.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            var num = new Date(response.data[j].start).getHours() * 60 + new Date(response.data[j].start).getMinutes();
            if (num < 350) {
              response.data[j].day = $filter('date')(new Date(response.data[j].start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].day = $filter('date')(new Date(response.data[j].start), 'yyyy-MM-dd');
            }
            if (vm.people[i].sso == response.data[j].opid) {
              response.data[j].shift = vm.people[i].shift;
              vm.data.push(response.data[j]);
            }
          }
        }
        selectinfo();
      });
    }

    function selectinfo() {

      vm.selectdata = [];
      vm.dates = [];
      var differencedate = (new Date(vm.edate).getTime() - new Date(vm.sdate).getTime()) / (24 * 3600 * 1000);

      for (var i = 0; i <= differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.edate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
      }

      vm.selectdata=$filter('filter')(vm.data, { shift: vm.actshift, pottingid: vm.actpotting });

      createChart(vm.selectdata);
    }

    function createChart(ar) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: "Kieső idő - " + vm.actpotting + " - " + vm.actshift },
        series: [
          {
            name: 'Száradási időre várás szárítóban',
            color: "#ff0000",
            data: feltolt_szarito(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Száradási időre várás forgatáson',
            color: "#660066",
            data: feltolt_forgatas(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Száradási időre várás esztétikán',
            color: "#ff9900",
            data: feltolt_esztetika(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Uretánkötési probléma forgatásnál',
            color: "#3366ff",
            data: feltolt_uretantoltes(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Egyéb',
            color: "#ff33cc",
            data: feltolt_egyeb(ar),
            stack: 'Összes hiba'
          }
        ],
        xAxis: [
          {
            categories: vm.dates,
            title: { text: "Dátum" }
          },
        ],
        yAxis: {
          title: {
            text: "Perc"
          }
        },
      }
    }

    function feltolt_szarito(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás szárítóban") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_forgatas(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás forgatáson") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_esztetika(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás esztétikán") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_uretantoltes(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Uretánkötési probléma forgatásnál") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_egyeb(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Egyéb") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
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

    vm.people = [
      { sso: "212319674", shift: "A" },
      { sso: "113005432", shift: "A" },
      { sso: "113010453", shift: "A" },
      { sso: "113009480", shift: "B" },
      { sso: "212674695", shift: "B" },
      { sso: "212404564", shift: "B" },
      { sso: "212437547", shift: "C" },
      { sso: "113005514", shift: "C" },
      { sso: "212546986", shift: "C" },
      { sso: "113011028", shift: "D" },
      { sso: "113008226", shift: "D" },
      { sso: "113008995", shift: "D" }
    ];
  }
})();