(function () {
  'use strict';

  angular
    .module('app')
    .controller('CheckmodulsController', CheckmodulsController);

  CheckmodulsController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'CheckmodulsService'];
  function CheckmodulsController($state, $cookies, $rootScope, $filter, $mdSidenav, CheckmodulsService) {
    var vm = this;
    vm.years=[2018,2019];
    vm.qual=["A","B"];
    vm.moduls = [
      { Label: "ZW1500-RL,600", Values: 3147303 },
      { Label: "MODULE,ZW1500,CLAMP", Values: 3157651 },
      { Label: "ZW1500 RMS adapteres", Values: 3157805 },
      { Label: "MODULE,ZW1500X,CLAMP", Values: 3157806 },
      { Label: "Module ZW 1500 X RMS", Values: 3161831 },
  ];

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load(){
      vm.data=[];
      CheckmodulsService.get().then(function (response){
        vm.data=response.data;
        for(var i=0;i<vm.data.length;i++){
          vm.data[i].inyear=new Date(vm.data[i].indate).getFullYear();
        }
        console.log(vm.data);
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