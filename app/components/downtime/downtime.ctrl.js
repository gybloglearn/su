(function () {
  'use strict';

  angular
    .module('app')
    .controller('DowntimeController', DowntimeController);

  DowntimeController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DowntimeService'];
  function DowntimeController($state, $cookies, $rootScope, $filter, $mdSidenav, DowntimeService) {
    var vm = this;
    vm.maxdate = new Date();
    vm.sdate = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000);
    vm.edate = new Date();
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - (30 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.pottings = ["Potting4", "Potting3"];
    vm.place = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.categories = ["Száradási időre várás szárítóban", "Száradási időre várás forgatáson", "Száradási időre várás esztétikán", "Uretánkötési probléma forgatásnál", "Egyéb"];
    vm.selectinfo = selectinfo;
    vm.updatedowntime = updatedowntime;
    vm.remove = remove;
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
      vm.startdate = $filter('date')(new Date(vm.sdate), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(new Date(vm.edate), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.pottinginfo = [];
      vm.loading=true;

      DowntimeService.getAll().then(function (resp) {
        vm.pottinginfo = resp.data;
        selectinfo(vm.pottinginfo, vm.startdate, vm.enddate);
        vm.loading=false;
      });
    }

    function selectinfo(arr, stdate, enddate) {
      vm.selectpottinginfo = [];

      var stnum = new Date(stdate).getTime();
      var endnum = new Date(enddate).getTime() + (24 * 3600 * 1000);

      for (var i = 0; i < arr.length; i++) {
        var actnum = new Date(arr[i].start).getTime();
        if (actnum >= stnum && actnum < endnum) {
          vm.selectpottinginfo.push(arr[i]);
        }
      }
    }

    function updatedowntime() {
      DowntimeService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
      DowntimeService.erase(id).then(function (resp) {
        vm.pottinginfo.splice(index, 1);
      });
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