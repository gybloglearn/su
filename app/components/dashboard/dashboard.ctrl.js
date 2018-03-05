(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function DashboardController($state, $cookies, $rootScope, $filter) {
    var vm = this;

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