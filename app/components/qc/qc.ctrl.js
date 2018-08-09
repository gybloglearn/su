(function () {
  'use strict';

  angular
    .module('app')
    .controller('QcController', QcController);

  QcController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'QcService'];
  function QcController($state, $cookies, $rootScope, $filter, $mdSidenav, QcService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (10 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.type = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.load = load;
    vm.loading = false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.loading = true;
      var sdate = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      vm.data = [];
      vm.xAxisData = [];
      QcService.get(sdate, edate, vm.acttype, vm.acttime).then(function (response) {
        var ki = response.data;
        var typedates = $filter('unique')(ki, 'Date');

        for (var i = 0; i < typedates.length; i++) {
          var obj = {
            date: typedates[i].Date,
            aplus: 0,
            aminus: 0,
            b: 0,
            scrap: 0,
            notgraded: 0,
            sum: 0
          }
          vm.data.push(obj);
        }

        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < ki.length; j++) {
            if (vm.data[i].date == ki[j].Date && ki[j].Label == "A+") {
              vm.data[i].aplus += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
            else if (vm.data[i].date == ki[j].Date && ki[j].Label == "A-") {
              vm.data[i].a += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
            else if (vm.data[i].date == ki[j].Date && ki[j].Label == "B") {
              vm.data[i].b += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
            else if (vm.data[i].date == ki[j].Date && ki[j].Label == "Rework") {
              vm.data[i].rework += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
            else if (vm.data[i].date == ki[j].Date && ki[j].Label == "Scrap") {
              vm.data[i].scrap += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
            else if (vm.data[i].date == ki[j].Date && ki[j].Label == "Not graded") {
              vm.data[i].notgraded += ki[j].Value;
              vm.data[i].sum += ki[j].Value;
            }
          }
        }
        createchart();
        vm.loading = false;
      });
    }

    function createchart(){
      vm.aplus = []; vm.aminus = []; vm.b = []; vm.notgraded = []; vm.scrap = [];

      for (var i = 0; i < vm.data.length; i++) {
        vm.xAxisData.push(vm.data[i].date);
        vm.aplus.push((vm.data[i].aplus / vm.data[i].sum) * 100);
        vm.aminus.push((vm.data[i].aminus / vm.data[i].sum) * 100);
        vm.b.push((vm.data[i].b / vm.data[i].sum) * 100);
        vm.scrap.push((vm.data[i].scrap / vm.data[i].sum) * 100);
        vm.notgraded.push((vm.data[i].notgraded / vm.data[i].sum) * 100);
      }
      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'ZW1000QC' },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        tooltip: {
          valueDecimals: 2
        },
        series: [
          { name: 'Scrap', data: vm.scrap, stack: 'all', color: '#ff0000' },
          { name: 'Not graded', data: vm.notgraded, stack: 'all', color: '#660066' },
          { name: 'B', data: vm.b, stack: 'all', color: '#ff9900' },
          { name: 'A', data: vm.a, stack: 'all', color: '#cccc00' },
          { name: 'A+', data: vm.aplus, stack: 'all', color: '#00cc00' },
        ],
        xAxis: { type: 'category', categories: vm.xAxisData },
        yAxis: {
          title: {
            text: "Százalék"
          },
          tickInterval: 20,
          max: 100
        },
      };
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