(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter', 'DashboardService'];
  function DashboardController($state, $cookies, $rootScope, $filter, DashboardService) {
    var vm = this;
    vm.maxdate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.startdate = $filter('date')(new Date().getTime() - 7 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
    vm.create_dates = create_dates;
    vm.loading=false;

    activate();

    ////////////////

    function create_dates() {
      vm.loading=true;
      vm.dates = [];
      vm.loaddates = [];
      vm.size = 0;
      var stnum = new Date(vm.startdate).getTime();
      var endnum = new Date(vm.enddate).getTime();
      while (stnum <= endnum) {
        vm.dates.push($filter('date')(stnum, 'yyyy-MM-dd'));
        vm.loaddates.push($filter('date')(stnum, 'yyyyMMdd'));
        stnum += (24 * 3600 * 1000);
        vm.size++;
      }
      console.log(vm.size);
      getplans();
    }

    function getplans() {
      vm.allplans = [];
      DashboardService.getplan().then(function (resp) {
        vm.allplans = resp.data;
        load();
      });
    }

    function load() {
      vm.acttarget = 0;
      vm.data = [];
      vm.startdate = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      for (var i = 0; i < vm.allplans.length; i++) {
        if (vm.allplans[i].startdate <= vm.startdate && vm.allplans[i].enddate >= vm.enddate) {
          vm.acttarget = vm.allplans[i].aeq;
        }
      }
      for (var j = 0; j < vm.loaddates.length; j++) {
        DashboardService.get(vm.loaddates[j]).then(function (response) {
          var d = response.data;
          for (var k = 0; k < d.length; k++) {
            d[k].ProducedLength_aeq = d[k].ProducedLength / 8900;
            vm.data.push(d[k]);
          }
          console.log(vm.data);
          vm.loading=false;
        });
      }
      console.log(vm.acttarget);
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.shift = $filter('shift')(1, new Date());
      }
      create_dates();
    }
  }
})();