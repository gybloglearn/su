(function () {
  'use strict';

  angular
    .module('app')
    .controller('NeworderController', NeworderController);

  NeworderController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav'];
  function NeworderController($state, $cookies, $rootScope, $filter, $mdSidenav) {
    var vm = this;

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }

    vm.onlyweekdays = onlyweekdays;
    vm.goback = goback;

    activate();

    ////////////////

    function onlyweekdays(date){
      var day = date.getDay();
      return day !==0 && day !==6;
    }

    function goback(){
      $state.go($state.current, {}, {reload: true});
    }

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
        vm.shift = $filter('shift')(1, new Date());
        vm.new = {
          id: "new",
          requestor: $rootScope.user.displayname
        };
        var today = new Date();
        vm.mindeliverydate = new Date(
         today.getFullYear(),
         today.getMonth(),
         today.getDate()+14
        );
      }
    }
  }
})();