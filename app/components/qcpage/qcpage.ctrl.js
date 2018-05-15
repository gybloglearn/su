(function () {
  'use strict';

  angular
    .module('app')
    .controller('QcpageController', QcpageController);

  QcpageController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'QcpageService'];
  function QcpageController($state, $cookies, $rootScope, $filter, $mdSidenav, QcpageService) {
    var vm = this;
    vm.types = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.startdatenum = $filter('date')(new Date().getTime() - (10 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = new Date($filter('date')(new Date().getTime() - (10 * 24 * 3600 * 1000), 'yyyy-MM-dd'));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.load = load;
    vm.beallit = beallit;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function beallit() {
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      load();
    }

    function load() {

      vm.data = [];
      vm.selectdata = [];
      vm.cats = [];

      QcpageService.get(vm.startdatenum, vm.enddatenum, vm.acttype, vm.acttime).then(function (response) {
        vm.data = response.data;
        console.log(vm.data);
        var interdata = $filter('unique')(vm.data, "Date");
        for (var i = 0; i < interdata.length; i++) {
          var obj = {};
          obj = {
            date: interdata[i].Date,
            aplus: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date, Label: "A+" }, true), 'Value')),
            a: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date, Label: "A" }, true), 'Value')),
            b: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date, Label: "B" }, true), 'Value')),
            notgraded: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date, Label: "Not graded" }, true), 'Value')),
            scrap: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date, Label: "Scrap" }, true), 'Value')),
            all: parseFloat($filter('sumField')($filter('filter')(vm.data, { Date: interdata[i].Date }), 'Value')),
          }
          vm.selectdata.push(obj);
          vm.cats.push(interdata[i].Date);
        }
        console.log(vm.selectdata);
        create_chartdata();
      });
    }

    function create_chartdata() {
      vm.chartData = [
        { name: "Scrap", color: "#ff0000", data: [] },
        { name: "Not graded", color: "#660066", data: [] },
        { name: "B", color: "#ff9900", data: [] },
        { name: "A-", color: "#cccc00", data: [] },
        { name: "A+", color: "#00cc00", data: [] }
      ]

      for (var i = 0; i < vm.selectdata.length; i++) {
        vm.chartData[0].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].scrap / vm.selectdata[i].all) * 100 });
        vm.chartData[1].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].notgraded / vm.selectdata[i].all) * 100 });
        vm.chartData[2].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].b / vm.selectdata[i].all) * 100 });
        vm.chartData[3].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].a / vm.selectdata[i].all) * 100 });
        vm.chartData[4].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].aplus / vm.selectdata[i].all) * 100 });
      }
      drowchart();
    }

    function drowchart() {
      vm.QCchartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        tooltip: {
          valueDecimals: 2
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { title: { text: 'Százalék' } },
        title: { text: "ZW1000QC-chart" },
        series: vm.chartData
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
      load();
    }
  }
})();