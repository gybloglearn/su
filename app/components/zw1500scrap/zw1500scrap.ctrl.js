(function () {
  'use strict';

  angular
    .module('app')
    .controller('Zw1500scrapController', Zw1500scrapController);

  Zw1500scrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'Zw1500scrapService'];
  function Zw1500scrapController($state, $cookies, $rootScope, $filter, $mdSidenav, Zw1500scrapService) {
    var vm = this;
    vm.times = ["nap", "hét", "hónap"];
    vm.acttime = "nap";
    vm.startdate = new Date(new Date().getTime() - (10 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.startdatenum = $filter('date')(new Date().getTime() - (10 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = load;
    vm.beallit = beallit;
    vm.loading=false;

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
      vm.loading=true;

      Zw1500scrapService.get(vm.startdatenum, vm.enddatenum, vm.acttime).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].amount = response.data[i].amount * 1;
          if (response.data[i].gradename == "") {
            response.data[i].gradename = "scrap"
          }
        }
        vm.data = response.data
        var interdata = $filter('unique')(vm.data, "item");
        var kuma = 0;
        var kumb = 0;
        for (var i = 0; i < interdata.length; i++) {
          kuma += parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, gradename: "scrap" }), 'amount'));
          kumb += parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item }), 'amount'));

          var obj = {};
          obj = {
            date: interdata[i].item,
            ah: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "AH" }, true), 'amount')),
            egyeb: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "Egyéb" }, true), 'amount')),
            gh: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "GH" }, true), 'amount')),
            oh: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "OH" }, true), 'amount')),
            ohsl: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "OHSL" }, true), 'amount')),
            seh: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "SEH" }, true), 'amount')),
            sl: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "SL" }, true), 'amount')),
            vegyes: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, ScrapReason: "Vegyes (OH+GH)" }, true), 'amount')),
            allscrap: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item, gradename: "scrap" }), 'amount')),
            all: parseFloat($filter('sumField')($filter('filter')(vm.data, { item: interdata[i].item }), 'amount')),
            kumulalt: (kuma / kumb) * 100
          }
          vm.selectdata.push(obj);
          vm.cats.push(interdata[i].item);
        }
        create_chartdata();
        vm.loading=false;
      });
    }

    function create_chartdata() {

      vm.chartData = [
        { name: "Vegyes (OH+GH)", color: "#92d151", data: [] },
        { name: "SL", color: "#c0514d", data: [] },
        { name: "SEH", color: "#ffff01", data: [] },
        { name: "OHSL", color: "#c0514d", data: [] },
        { name: "OH", color: "#4572a7", data: [] },
        { name: "GH", color: "#e46d0a", data: [] },
        { name: "Egyéb", color: "#7030a0", data: [] },
        { name: "AH", color: "#7030a0", data: [] },
        { name: "Kumulált", type: "line", color: "#e46d0a", data: [] },
        { name: "Cél", type: "line", color: "#ff0000", data: [] },
      ];

      for (var i = 0; i < vm.selectdata.length; i++) {
        vm.chartData[0].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].vegyes / vm.selectdata[i].all) * 100 });
        vm.chartData[1].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].sl / vm.selectdata[i].all) * 100 });
        vm.chartData[2].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].seh / vm.selectdata[i].all) * 100 });
        vm.chartData[3].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].ohsl / vm.selectdata[i].all) * 100 });
        vm.chartData[4].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].oh / vm.selectdata[i].all) * 100 });
        vm.chartData[5].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].gh / vm.selectdata[i].all) * 100 });
        vm.chartData[6].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].egyeb / vm.selectdata[i].all) * 100 });
        vm.chartData[7].data.push({ cat: vm.selectdata[i].date, y: (vm.selectdata[i].ah / vm.selectdata[i].all) * 100 });
        vm.chartData[8].data.push({ cat: vm.selectdata[i].date, y: vm.selectdata[i].kumulalt });
        vm.chartData[9].data.push({ cat: vm.selectdata[i].date, y: 0.8 });
      }
      drowchart();
    }

    function drowchart() {
      vm.Chartconfig = {
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
        title: { text: "ZW1500 Selejt (arány)" },
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