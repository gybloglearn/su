(function () {
  'use strict';

  angular
    .module('app')
    .controller('FirstController', FirstController);

  FirstController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav','FirstService'];
  function FirstController($state, $cookies, $rootScope, $filter, $mdSidenav,FirstService) {
    var vm = this;
    var szoveg="Hello";
    var szam=4;
    var tomb1=[4,5,6];
    var obj={nev:"Gizike",kor:24,nem:"nő"};
    var objektumtomb=[{gep:"SM4",lapszam:200},{gep:"SM5",lapszam:300}];
    var bol=false;

    vm.sheetmakers=["SM1","SM2","SM4"];
    vm.names=["Laci","Mari","Lajos"];
    vm.name="Laci";

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function loadmoduls(){
      vm.moduls=[];
      FirstService.get().then(function(response){
        vm.moduls=response.data;
        select(vm.moduls);
      });
    }

    /*function kiiro(){
      console.log(objektumtomb);
    }*/

    function select(arr){
      console.log(arr);
      vm.flow=[];
      vm.cp5=[];
      vm.cp5db=0;
      vm.flowdb=0;

      for(var i=0;i<arr.length;i++){
        if(arr[i].name.includes("Flow")){
          vm.flowdb++;
          vm.flow.push(arr[i]);
          
        }
        else if(arr[i].name.includes("CP5")){
          vm.cp5db++;
        }
      }
      console.log(vm.flow);
    }

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
      }
      loadmoduls();
    }
  }
})();