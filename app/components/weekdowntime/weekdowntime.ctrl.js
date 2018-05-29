(function () {
  'use strict';

  angular
    .module('app')
    .controller('WeekdowntimeController', WeekdowntimeController);

  WeekdowntimeController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'WeekdowntimeService'];
  function WeekdowntimeController($state, $cookies, $rootScope, $filter, $mdSidenav, WeekdowntimeService) {
    var vm = this;
    vm.years = [2018];
    vm.actyear = new Date().getFullYear();
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"]
    vm.actsm = "";
    vm.actweek = "";
    vm.select_mainchart = select_mainchart;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function create_dates() {
      if (vm.actyear == vm.years[vm.years.length - 1]) {
        vm.firstday = vm.actyear + "-01-01";
        vm.lastday = vm.actyear + "-01-14";
        //vm.lastday = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      else {
        vm.firstday = vm.actyear + "-01-01";
        vm.lastday = vm.actyear + "-12-31";
      }
      getfiles();
    }

    function getfiles() {
      vm.data = [];
      var daynum = new Date(vm.firstday).getTime();
      var ld = new Date(vm.lastday).getTime();
      while (daynum <= ld) {
        WeekdowntimeService.getsmfile($filter('date')(daynum, 'yyyyMMdd')).then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            vm.data.push(response.data[i]);
          }
          select_mainchart();
        });
        daynum += (24 * 3600 * 1000)
      }
    }

    function select_mainchart() {
      //console.log(vm.data);
      vm.arrtabledata = $filter('filter')(vm.data, { Machine: vm.actsm });
      vm.cats = [];
      vm.chartData = [
        { name: "Tervezett veszteség", color: "#3366ff", data: [] },
        { name: "Szervezési veszteség", color: "#cc33ff", data: [] },
        { name: "Műszaki hiba", color: "#e60000", data: [] },
        { name: "Üresjárat", type: "line", color: "#0099ff", data: [] },
        { name: "Cél", type: "line", color: "#800000", data: []}
      ];
      var intercats = $filter('unique')(vm.data, 'week');
      for (var i = 0; i < intercats.length - 1; i++) {
        vm.cats.push(intercats[i].week);
      }

      var alltime = 0;
      if (vm.actsm == "") {
        alltime = 6 * 7 * 24 * 1440;
      }
      else {
        alltime = 7 * 24 * 1440;
      }
      console.log(alltime);
      for (var i = 0; i < vm.cats.length; i++) {
        vm.chartData[0].data.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.arrtabledata, { Ev_Group: "Tervezett veszteseg", week: vm.cats[i] }), 'Event_time') - $filter('sumField')($filter('filter')(vm.arrtabledata, { Event_SubGroup: "101 - üresjárat (nem kell gyártani)", week: vm.cats[i] }), 'Event_time')) / alltime * 100 });
        vm.chartData[1].data.push({ cat: vm.cats[i], y: $filter('sumField')($filter('filter')(vm.arrtabledata, { Ev_Group: "Szervezesi veszteseg", week: vm.cats[i] }), 'Event_time') / alltime * 100 });
        vm.chartData[2].data.push({ cat: vm.cats[i], y: $filter('sumField')($filter('filter')(vm.arrtabledata, { Ev_Group: "Muszaki technikai okok", week: vm.cats[i] }), 'Event_time') / alltime * 100 });
        vm.chartData[3].data.push({ cat: vm.cats[i], y: $filter('sumField')($filter('filter')(vm.arrtabledata, { Event_SubGroup: "101 - üresjárat (nem kell gyártani)", week: vm.cats[i] }), 'Event_time') / alltime * 100 });
        vm.chartData[4].data.push({ cat: vm.cats[i], y: (2*alltime)/(7*24*1440)});
      }
      console.log(vm.chartData);
      drowchart();
    }

    function drowchart() {
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 350
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { title: { text: 'Arány' } },
        title: { text: 'Kimutatás' },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: vm.chartData
      };
    }

    function select_shiftchart() {
      vm.shiftdata = $filter('filter')(vm.data, { Machine: vm.actsm, week: vm.actweek });
      vm.categ = ["A","B","C","D"];
      vm.chd = [
        { name: "Tervezett veszteség", color: "#3366ff", data: [] },
        { name: "Szervezési veszteség", color: "#cc33ff", data: [] },
        { name: "Műszaki hiba", color: "#e60000", data: [] },
        { name: "Üresjárat", type: "line", color: "#0099ff", data: [] }/*,
        { name: "Cél", type: "line", color: "#800000", data: [] }*/
      ];
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      create_dates();
    }
  }
})();