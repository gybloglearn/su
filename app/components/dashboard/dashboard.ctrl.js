(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter', 'UpdateService'];
  function DashboardController($state, $cookies, $rootScope, $filter, UpdateService) {
    var vm = this;

    activate();

		UpdateService.get().then(function(response){
			console.log(response.data);
			vm.month = response.data.month;
			vm.today = response.data.today;
			vm.nextupdate = response.data.nextupdate;
			vm.quantity = response.data.quantity;
			vm.quality = response.data.quality;
			vm.pluszminusz = response.data.pluszminusz;
			vm.huf = response.data.huf;
		});

    ////////////////

    function activate() {
      /*if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {*/
        vm.loading = true;
        /*$rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});*/
        vm.shift = $filter('shift')(1, new Date());
        vm.today = "2018-08-20"; //$filter('date')(new Date(), 'yyyy-MM-dd');
      //}
    }
  }
})();
