(function () {
  'use strict';

  angular
    .module('app')
    .controller('DowntimechlorController', DowntimechlorController);

  DowntimechlorController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DowntimechlorService'];
  function DowntimechlorController($state, $cookies, $rootScope, $filter, $mdSidenav, DowntimechlorService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (6 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.categories = ["Anyaghiány Pottingról", "Létszámhiány", "Kamlock csatlakozó hiba", "Szivárgás", "Szivattyú", "PH beállítás", "Érzékelő hiba", "Segédeszköz hiány", "Egyéb"];
    vm.cat = "";
    vm.filterload = filterload;
    vm.loading=false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.loading=true;
      vm.dbdata = [];
      DowntimechlorService.get().then(function (response) {
        vm.dbdata = response.data;
        for (var i = 0; i < vm.dbdata.length; i++) {
          var num = (new Date(vm.dbdata[i].start_date).getHours() * 60) + (new Date(vm.dbdata[i].start_date).getMinutes());
          if (num > 350) {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime(), 'yyyy-MM-dd');
          }
          else {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
        }
        filterload();
        vm.loading=false;
      });
    }

    function filterload() {
      vm.guidata = [];
      var dnum1 = new Date(vm.startdate).getTime();
      var dnum2 = new Date(vm.enddate).getTime();
      for (var i = 0; i < vm.dbdata.length; i++) {
        var dnum3 = new Date(vm.dbdata[i].day).getTime();
        if (dnum3 >= dnum1 && dnum3 <= dnum2) {
          vm.guidata.push(vm.dbdata[i]);
        }
      }
      vm.guidata = $filter('filter')(vm.guidata, { category: vm.cat });
      createchart();
    }

    function createchart() {
      vm.cats = [];

      vm.anyaghianypottingrol = [];
      vm.letszamhiany = [];
      vm.kamlockcsatlakozohiba = [];
      vm.szivargas = [];
      vm.szivattyu = [];
      vm.phbeallitas = [];
      vm.erzekelohiba = [];
      vm.segedeszkozhiany = [];
      vm.egyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        vm.anyaghianypottingrol.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Anyaghiány Pottingról', day: vm.cats[i] }), 'time')) * 1 });
        vm.letszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.kamlockcsatlakozohiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Kamlock csatlakozó hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.szivargas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szivárgás', day: vm.cats[i] }), 'time')) * 1 });
        vm.szivattyu.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szivattyú', day: vm.cats[i] }), 'time')) * 1 });
        vm.phbeallitas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'PH beállítás', day: vm.cats[i] }), 'time')) * 1 });
        vm.erzekelohiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Érzékelő hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.segedeszkozhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Segédeszköz hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.egyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-klórozó' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: 
          { title: { text: 'Perc' } },
        series: [
          { name: 'Anyaghiány Pottingról', data: vm.anyaghianypottingrol, stack: 'cl' },
          { name: 'Létszámhiány', data: vm.letszamhiany, stack: 'cl' },
          { name: 'Kamlock csatlakozó hiba', data: vm.kamlockcsatlakozohiba, stack: 'cl' },
          { name: 'Szivárgás', data: vm.szivargas, stack: 'cl' },
          { name: 'Szivattyú', data: vm.szivattyu, stack: 'cl' },
          { name: 'PH beállítás', data: vm.phbeallitas, stack: 'cl' },
          { name: 'Érzékelő hiba', data: vm.erzekelohiba, stack: 'cl' },
          { name: 'Segédeszköz hiány', data: vm.segedeszkozhiany, stack: 'cl' },
          { name: 'Egyéb', data: vm.egyeb, stack: 'cl' },
        ],
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