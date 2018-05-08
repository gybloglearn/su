(function () {
  'use strict';

  angular
    .module('app')
    .controller('ModuldataController', ModuldataController);

  ModuldataController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ModuldataService'];
  function ModuldataController($state, $cookies, $rootScope, $filter, $mdSidenav, ModuldataService) {
    var vm = this;
    vm.code = '';
    vm.check = check;
    var beviheto = false;
    var code_part;
    vm.load = load;
    vm.create_code = create_code;
    vm.egyedi = [];
    vm.machine = [];
    vm.phase = [];
    vm.loading = false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load(code) {
      vm.loading = true;
      vm.dis = true;
      vm.data = [];
      ModuldataService.get(code).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        vm.machine = $filter('unique')(vm.data, 'machinename');
        vm.phase = $filter('unique')(vm.data, 'phasename');
        vm.loading = false;
      });
    }

    function check(input) {
      if (input.length == 10 && isFinite(input)) {
        beviheto = true;
        vm.in = "Helyes adat";
      }
      else {
        vm.in = "Helytelen adat";
        beviheto = false;
      }
      if (beviheto == true) {
        code_part = vm.valid;
      }
    }


    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.code = new_code;
      vm.load(new_code);
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      ModuldataService.getpartnumber().then(function (response) {
        vm.egyedi = response.data;
      });

      /*if ($stateParams.modulid) {
        var modid = $stateParams.modulid;
        vm.code = modid;
        vm.part = modid.substr(2, 7);
        vm.valid = modid.substr(9, 18);
        load(modid);
      }*/
    }
  }
})();