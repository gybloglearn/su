(function () {
  'use strict';

  angular
    .module('app')
    .controller('PlanController', PlanController);

  PlanController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'PlanService'];
  function PlanController($state, $cookies, $rootScope, $filter, $mdSidenav, PlanService) {
    var vm = this;
    vm.data = [];
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.updateplan = updateplan;
    vm.remove = remove;
    vm.reloadwebpage = reloadwebpage;
    vm.mutat = false;
    vm.showmessage = false;
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.moduls = [];
    vm.planlist = [];

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function show() {
      vm.mutat = true;
      vm.data = [];
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        vm.data.push({
          "id": vm.id = new Date().getTime() + i,
          "sm": vm.sheetmakers[i],
          "amount": vm.darab,
        });
      }
    }

    function save() {
      //for (var i = 0; i < vm.data.length; i++) {
      PlanService.post(vm.data).then(function (response) {
        vm.showmessage = true;
        vm.data = {};
      });
      //}
      $timeout(function () {
        vm.showmessage = false;
      }, 5000);
    }

    function load() {
      PlanService.getAll().then(function (response) {
        vm.planlist = response.data;
        console.log(vm.planlist);
      });
    }
    function updateplan() {
      PlanService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
      PlanService.erase(id).then(function (resp) {
        vm.planlist.splice(index, 1);
      });

    }

    function reloadwebpage() {
      $state.go('plan', { reload: true });
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