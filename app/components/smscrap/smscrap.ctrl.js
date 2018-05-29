(function () {
  'use strict';

  angular
    .module('app')
    .controller('SmscrapController', SmscrapController);

  SmscrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'SmscrapService'];
  function SmscrapController($state, $cookies, $rootScope, $filter, $mdSidenav, SmscrapService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.loading = false;
    vm.ok = false;
    vm.getproduct = getproduct;
    vm.create_chartdata = create_chartdata;
    vm.actsm = "";
    vm.actshift = "";
    vm.acttype = "";
    vm.actchem = "";
    vm.actcat = "";
    vm.actdescription = "";

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function getproduct() {
      vm.actsm = "";
      vm.actshift = "";
      vm.acttype = "";
      vm.actchem = "";
      vm.actcat = "";
      vm.actdescription = "";
      vm.ok = false;
      vm.fr = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.dt = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      vm.sms = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
      vm.smprod = [];
      for (var sz = 0; sz < vm.sms.length; sz++) {
        var d = SmscrapService.getprod(vm.fr, vm.dt, vm.sms[sz]);
        d.then(function (resp) {
          angular.forEach(resp.data, function (v, k) {
            v.days = $filter('date')(new Date(v.days).getTime(), 'yyyy-MM-dd');
            vm.smprod.push(v);
            if (v.shortname == 'SM9') {
              vm.ok = true;
            }
          });
          getscrap();
        });
      }
    }

    function getscrap() {
      vm.tabledata = [];
      vm.loading = true;
      var i = SmscrapService.getbtw(vm.fr, vm.dt);
      i.then(function (res) {
        vm.tabledata = res.data;
        create_chartdata(vm.tabledata);
        vm.loading=false;
      });
    }

    function create_chartdata() {
      vm.cats = [];
      vm.arrtabledata = $filter('filter')(vm.tabledata, { sm: vm.actsm, shift: vm.actshift, type: vm.acttype, chem: vm.actchem, category: vm.actcat, description: vm.actdescription });

      vm.chartData = [
        { name: "Lapparaméter", color: "rgb(250,193,145)", data: [] },
        { name: "Géphiba", color: "rgb(228,109,10)", data: [] },
        { name: "Szálhibák", color: "rgb(192,81,77)", data: [] },
        { name: "Egyéb hibák", color: "rgb(112,48,160)", data: [] },
        { name: "Robot hiba", color: "rgb(209,148,147)", data: [] },
        { name: "Cél", type: "line", color: "rgb(222, 37, 51)", marker: { symbol: "circle" }, data: [] },
        { name: "Napi", type: "line", color: "rgb(255, 152, 33)", marker: { symbol: "circle" }, data: [] },
        { name: "Kumulált", type: "line", color: "rgb(70, 173, 0)", marker: { symbol: "circle" }, data: [] }
      ];
      var sdn = new Date(vm.fr).getTime();
      var edn = new Date(vm.dt).getTime();
      var sumsc = 0;
      var sumtot = 0;
      while (sdn < edn) {
        vm.cats.push($filter('date')(sdn, 'yyyy-MM-dd'));
        var total = $filter('sumField')($filter('filter')(vm.smprod, { category: "TOTAL", days: $filter('date')(sdn, 'yyyy-MM-dd') }), 'amount') * 1;
        var scrapdaztotal = $filter('sumField')($filter('filter')(vm.arrtabledata, { day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') * 1;
        sumtot += total;
        sumsc += scrapdaztotal;
        vm.chartData[0].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: $filter('sumField')($filter('filter')(vm.arrtabledata, { category: "Lapparaméter", day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') / total * 100 });
        vm.chartData[1].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: $filter('sumField')($filter('filter')(vm.arrtabledata, { category: "Géphiba", day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') / total * 100 });
        vm.chartData[2].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: $filter('sumField')($filter('filter')(vm.arrtabledata, { category: "Szálhibák", day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') / total * 100 });
        vm.chartData[3].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: $filter('sumField')($filter('filter')(vm.arrtabledata, { category: "Egyéb hibák", day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') / total * 100 });
        vm.chartData[4].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: $filter('sumField')($filter('filter')(vm.arrtabledata, { category: "Robot hiba", day: $filter('date')(sdn, 'yyyy-MM-dd') }), 'pc') / total * 100 });
        vm.chartData[5].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0.75 });
        vm.chartData[6].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: scrapdaztotal / total * 100 });
        vm.chartData[7].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: sumsc / sumtot * 100 });
        sdn += (24 * 3600 * 1000);
      }
      if (vm.ok == true) {
        drowchart();
      }
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


    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      getproduct();
    }
  }
})();