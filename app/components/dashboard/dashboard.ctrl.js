(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$filter'];
  function DashboardController($state, $cookies, $rootScope, $filter) {
    var vm = this;
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    vm.startdate = $filter('date')(firstDay, 'yyyy-MM-dd');
    vm.enddate = $filter('date')(lastDay, 'yyyy-MM-dd');
    vm.mindate=new Date('2017-09-01');
    var napok = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"]
    var munkanapok = ["2018-03-10", "2018-04-21", "2018-10-13", "2018-11-10", "2018-12-01", "2018-12-15"];
    var pihenonapok = ["2018-03-15", "2018-03-16", "2018-03-30", "2018-04-02", "2018-04-30", "2018-05-01", "2018-05-21", "2018-08-20", "2018-10-22", "2018-10-23", "2018-11-01", "2018-11-02", "2018-12-24", "2018-12-31"];
    vm.data = [];
    vm.datediff = datediff;

    activate();

    ////////////////

    function datediff() {
      vm.differencedate = 0;
      vm.dates = [];
      vm.data = [];

      vm.differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i] = {}
        var a = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i].date = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i].day = napok[new Date(a).getDay()];
        vm.data[i].client = $filter('client')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].doctor = $filter('doctor')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var zwdeszak = $filter('shift')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var zwejszak = $filter('shift')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmdeszak = $filter('shiftfm')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmduszak = $filter('shiftfm')(2, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmejszak = $filter('shiftfm')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));

        if (zwdeszak == "A") {
          vm.data[i].zwa = "Nappal";
          vm.data[i].zwb = "Pihenő";
          vm.data[i].zwc = "Pihenő";
        }
        else if (zwdeszak == "B") {
          vm.data[i].zwb = "Nappal";
          vm.data[i].zwa = "Pihenő";
          vm.data[i].zwd = "Pihenő";
        }
        else if (zwdeszak == "C") {
          vm.data[i].zwc = "Nappal";
          vm.data[i].zwa = "Pihenő";
          vm.data[i].zwd = "Pihenő";
        }
        else if (zwdeszak == "D") {
          vm.data[i].zwd = "Nappal";
          vm.data[i].zwb = "Pihenő";
          vm.data[i].zwc = "Pihenő";
        }

        if (zwejszak == "A") {
          vm.data[i].zwa = "Éjszaka";
        }
        else if (zwejszak == "B") {
          vm.data[i].zwb = "Éjszaka";
        }
        else if (zwejszak == "C") {
          vm.data[i].zwc = "Éjszaka";
        }
        else if (zwejszak == "D") {
          vm.data[i].zwd = "Éjszaka";
        }

        if (fmdeszak == "A") {
          vm.data[i].fma = "Délelőtt";
        }
        else if (fmdeszak == "B") {
          vm.data[i].fmb = "Délelőtt";
        }
        else if (fmdeszak == "C") {
          vm.data[i].fmc = "Délelőtt";
        }

        if (fmduszak == "A") {
          vm.data[i].fma = "Délután";
        }
        else if (fmduszak == "B") {
          vm.data[i].fmb = "Délután";
        }
        else if (fmduszak == "C") {
          vm.data[i].fmc = "Délután";
        }

        if (fmejszak == "A") {
          vm.data[i].fma = "Éjszaka";
        }
        else if (fmejszak == "B") {
          vm.data[i].fmb = "Éjszaka";
        }
        else if (fmejszak == "C") {
          vm.data[i].fmc = "Éjszaka";
        }
        if (fmdeszak == "Pihenő") {
          vm.data[i].fma = "Pihenő";
          vm.data[i].fmb = "Pihenő";
          vm.data[i].fmc = "Pihenő";
        }
        for (var j = 0; j < pihenonapok.length; j++) {
          if (vm.dates[i] == pihenonapok[j]) {
            vm.data[i].fma = "Pihenő";
            vm.data[i].fmb = "Pihenő";
            vm.data[i].fmc = "Pihenő";
            vm.data[i].client = '';
            vm.data[i].doctor = '';
          }
        }
        for (var k = 0; k < munkanapok.length; k++) {
          if (vm.dates[i] == munkanapok[k]) {
            if (i > 0) {
              vm.data[i].fma = vm.data[i - 1].fma;
              vm.data[i].fmb = vm.data[i - 1].fmb;
              vm.data[i].fmc = vm.data[i - 1].fmc;
            }
            else{
              var dt=$filter('date')(new Date(vm.dates[0]).getTime()-24*3600*1000,'yyyy-MM-dd');
              var fdesh=$filter('shiftfm')(1, dt);
              var fdush=$filter('shiftfm')(2, dt);
              var fejsh=$filter('shiftfm')(3, dt);
              
              if (fdesh == "A") {
                vm.data[i].fma = "Délelőtt";
              }
              else if (fdesh == "B") {
                vm.data[i].fmb = "Délelőtt";
              }
              else if (fdesh == "C") {
                vm.data[i].fmc = "Délelőtt";
              }
      
              if (fdush == "A") {
                vm.data[i].fma = "Délután";
              }
              else if (fdush == "B") {
                vm.data[i].fmb = "Délután";
              }
              else if (fdush == "C") {
                vm.data[i].fmc = "Délután";
              }
      
              if (fejsh == "A") {
                vm.data[i].fma = "Éjszaka";
              }
              else if (fejsh == "B") {
                vm.data[i].fmb = "Éjszaka";
              }
              else if (fejsh == "C") {
                vm.data[i].fmc = "Éjszaka";
              }
            }
          }
        }

      }
      console.log(vm.data);
      //console.log(vm.dates);
    }

    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
        vm.shift = $filter('shift')(1, new Date());
      }
      datediff();
    }
  }
})();