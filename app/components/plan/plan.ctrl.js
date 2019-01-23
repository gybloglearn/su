(function () {
  'use strict';

  angular
    .module('app')
    .controller('PlanController', PlanController);

  PlanController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'PlanService'];
  function PlanController($state, $cookies, $rootScope, $filter, $mdSidenav, PlanService) {
    var vm = this;
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.amount = 0;
    vm.aeq = 0;
    vm.edit="";
    vm.createaeq = createaeq;
    vm.createamount = createamount;
    vm.save = save;
    vm.update=update;
    vm.remove = remove;
    vm.load = load;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function createaeq(am) {
      vm.aeq = am / 8900;
      vm.amount = am * 1;
    }

    function createamount(aeq) {
      vm.amount = aeq * 8900;
      vm.aeq = aeq * 1;
    }

    function load() {
      PlanService.get().then(function (response) {
        vm.data = response.data
      });
    }

    function save() {
      var data = [];
      var obj = {};
      obj = {
        "id": new Date().getTime(),
        "amount": vm.amount,
        "aeq": vm.aeq,
        "startdate": vm.startdate,
        "enddate": vm.enddate
      };
      data.push(obj);
      console.log(obj);
      PlanService.post(data[0]).then(function (resp) {
        data = [];
        vm.amount = 0;
        vm.aeq = 0;
        vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
      });
      load();
    }

    function update(it){
      console.log(it);
      PlanService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
      PlanService.erase(id).then(function (resp) {
        vm.data.splice(index, 1);
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