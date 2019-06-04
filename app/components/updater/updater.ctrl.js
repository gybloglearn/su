(function () {
  'use strict';

  angular
    .module('app')
    .controller('UpdaterController', UpdaterController);

  UpdaterController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'UpdateService'];
  function UpdaterController($state, $cookies, $rootScope, $filter, $mdSidenav, UpdateService) {
    var vm = this;

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }
		
		vm.sethuf = sethuf;
		vm.huf = "0";
		vm.month = "Hónap";
		vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
		vm.d = new Date();
		vm.nextupdate = $filter('date')(vm.d.setDate(vm.d.getDate() + 7), 'yyyy-MM-dd');
		function sethuf(){
			if(vm.quantity && vm.quality){
				vm.huf = "40.000";
			} else if (vm.quantity && !vm.quality){
				vm.huf = "30.000";
			} else {
				vm.huf = "20.000";
			}
		}

    vm.save = save;
		function save(){
			vm.k = {
				"month": vm.month,
				"today": vm.today,
				"nextupdate": vm.nextupdate,
				"quantity": vm.quantity,
				"pluszminusz": vm.pluszminusz,
				"quality": vm.quality,
				"huf": vm.huf
			};
			UpdateService.post(vm.k).then(function(response){
				console.log(response);
			});
		}
		
		activate();

    ////////////////

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
      }
    }
  }
})();
