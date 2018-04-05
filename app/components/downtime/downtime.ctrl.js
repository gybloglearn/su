(function () {
  'use strict';

  angular
    .module('app')
    .controller('DowntimeController', DowntimeController);

  DowntimeController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DowntimeService'];
  function DowntimeController($state, $cookies, $rootScope, $filter, $mdSidenav, DowntimeService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - 14 * 24 * 3600 * 1000);
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.startdatenum=$filter('date')(vm.startdate,'yyyy-MM-dd');
    vm.enddatenum=$filter('date')(vm.enddate,'yyyy-MM-dd');
    vm.load=load;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.startdatenum=$filter('date')(vm.startdate,'yyyy-MM-dd');
      vm.enddatenum=$filter('date')(vm.enddate,'yyyy-MM-dd');
      vm.data = [];
      vm.group = [];
      vm.names = [];
      var groupfilter = [];
      var namefilter = [];
      var goodtime = 0;

      DowntimeService.get(vm.startdatenum, vm.enddatenum).then(function (response) {
        vm.data = response.data;
        groupfilter = $filter('unique')(vm.data, 'Reason_group_Name');
        namefilter = $filter('unique')(vm.data, 'reas_Name');

        goodtime = ((new Date(vm.enddatenum).getTime() - new Date(vm.startdatenum).getTime()) / 1000) * 2

        for (var i = 0; i < groupfilter.length; i++) {
          var obj = {};
          obj = {
            code: groupfilter[i].Reason_group_Name,
            amount: 0
          };
          vm.group.push(obj);
        }
        for (var i = 0; i < vm.group.length; i++) {
          for (var j = 0; j < vm.data.length; j++) {
            if (vm.group[i].code == vm.data[j].Reason_group_Name) {
              vm.group[i].amount += vm.data[j].Duration_s_ * 1;
              goodtime -= vm.data[j].Duration_s_ * 1;
            }
          }
        }
        var goodobj = {};
        goodobj = {
          code: "Elérhető idő",
          amount: goodtime
        }
        vm.group.push(goodobj);

        var gr = [];
        var chartdrill = [];
        var colors = [];
        colors["Elérhető idő"] = "rgb(100,200,50)";
        colors["Váratlan gépleállás"] = "rgb(255,0,0)";
        colors["Tervezett állás"] = "rgb(50,100,200)";
        colors["Fonatoló hiba"] = "rgb(150,150,150)";
        colors["Operátor hiba"] = "rgb(200,50,200)";
        for (var i = 0; i < vm.group.length; i++) {
          gr.push({ name: vm.group[i].code, y: vm.group[i].amount, drilldown: vm.group[i].code, color: colors[vm.group[i].code] });
          chartdrill.push({ name: vm.group[i].code, id: vm.group[i].code, data: [] });
        }
        for (var i = 0; i < chartdrill.length; i++) {
          for (var j = 0; j < namefilter.length; j++) {
            var t = [];
            var szam = 0;
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].reas_Name == namefilter[j].reas_Name && vm.data[k].Reason_group_Name == chartdrill[i].name) {
                szam += vm.data[k].Duration_s_ * 1;
              }
            }
            t = [namefilter[j].reas_Name, szam];
            chartdrill[i].data.push(t);
          }
        }

        setChartpie(gr, chartdrill);
      });
    }

    function setChartpie(dt, dd) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 600,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Hiba eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: false
          }
        },
        series: [
          {
            name: "adatok",
            data: dt
          }
        ],
        drilldown: {
          series: dd
        }
      };
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