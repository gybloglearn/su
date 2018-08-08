(function () {
  'use strict';

  angular
    .module('app')
    .controller('ScrapController', ScrapController);

  ScrapController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ScrapService'];
  function ScrapController($state, $cookies, $rootScope, $filter, $mdSidenav, ScrapService) {
    var vm = this;
    vm.times = ["nap", "hét", "hónap"];
    vm.acttime = "nap";
    vm.startdate = new Date(new Date().getTime() - (10 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.load = load;
    vm.loading = false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load() {
      vm.loading=true;
      var sdate = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      vm.data = [];
      vm.xAxisData = [];

      ScrapService.get(sdate, edate, vm.acttime).then(function (response) {
        var arr = response.data;
        var typedates = $filter('unique')(arr, 'item');

        for (var i = 0; i < typedates.length; i++) {
          var obj = {
            date: typedates[i].item,
            aplus: 0,
            a: 0,
            b: 0,
            ah: 0,
            egyeb: 0,
            oh: 0,
            ohsl: 0,
            seh: 0,
            sl: 0,
            ohgh: 0,
            gh: 0,
            sumscrap: 0,
            sum: 0
          }
          vm.data.push(obj);
        }

        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (vm.data[i].date == arr[j].item && arr[j].gradename == "A+") {
              vm.data[i].aplus += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].gradename == "A") {
              vm.data[i].a += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].gradename == "B") {
              vm.data[i].b += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "AH") {
              vm.data[i].ah += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "Egyéb") {
              vm.data[i].egyeb += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "OH") {
              vm.data[i].oh += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "OHSL") {
              vm.data[i].ohsl += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "SEH") {
              vm.data[i].seh += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "SL") {
              vm.data[i].sl += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "OHGH") {
              vm.data[i].ohgh += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
            else if (vm.data[i].date == arr[j].item && arr[j].ScrapReason == "GH") {
              vm.data[i].gh += arr[j].amount * 1;
              vm.data[i].sum += arr[j].amount * 1;
              vm.data[i].sumscrap += arr[j].amount * 1;
            }
          }
        }
        vm.loading=false;
        createchart();
      });
    }

    function createchart() {
      console.log(vm.data);
      vm.ohgh = []; vm.sl = []; vm.seh = []; vm.ohsl = []; vm.oh = []; vm.gh = []; vm.egyeb = []; vm.ah = [];
      vm.kumohgh = []; vm.kumsl = []; vm.kumseh = []; vm.kumohsl = []; vm.kumoh = []; vm.kumgh = []; vm.kumegyeb = []; vm.kumah = []; vm.kumulalt = []; vm.standard = [];
      var kumall = 0;
      var kumscrap = 0;

      for (var i = 0; i < vm.data.length; i++) {
        kumall += vm.data[i].sum;
        kumscrap += vm.data[i].sumscrap;
        if (kumall == 0) {
          vm.data[i].kumulalt = 0;
        }
        else {
          vm.data[i].kumulalt = (kumscrap / kumall) * 100;
        }
        vm.xAxisData.push(vm.data[i].date);
        //darab diagram
        vm.ohgh.push(vm.data[i].ohgh);
        vm.sl.push(vm.data[i].sl);
        vm.seh.push(vm.data[i].seh);
        vm.ohsl.push(vm.data[i].ohsl);
        vm.oh.push(vm.data[i].oh);
        vm.gh.push(vm.data[i].gh);
        vm.egyeb.push(vm.data[i].egyeb);
        vm.ah.push(vm.data[i].ah);
        //kumulalt diagram
        vm.kumohgh.push((vm.data[i].ohgh / vm.data[i].sum) * 100);
        vm.kumsl.push((vm.data[i].sl / vm.data[i].sum) * 100);
        vm.kumseh.push((vm.data[i].seh / vm.data[i].sum) * 100);
        vm.kumohsl.push((vm.data[i].ohsl / vm.data[i].sum) * 100);
        vm.kumoh.push((vm.data[i].oh / vm.data[i].sum) * 100);
        vm.kumgh.push((vm.data[i].gh / vm.data[i].sum) * 100);
        vm.kumegyeb.push((vm.data[i].egyeb / vm.data[i].sum) * 100);
        vm.kumah.push((vm.data[i].ah / vm.data[i].sum) * 100);
        vm.kumulalt.push(vm.data[i].kumulalt);
        vm.standard.push(0.8);
      }
      //darab
      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'ZW1500 Selejt (darab)' },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: [
          { name: 'Vegyes (OH+GH)', data: vm.ohgh, stack: 'all', color: '#92d151' },
          { name: 'SL', data: vm.sl, stack: 'all', color: '#c0514d' },
          { name: 'SEH', data: vm.seh, stack: 'all', color: '#ffff01' },
          { name: 'OHSL', data: vm.ohsl, stack: 'all', color: '#c0514d' },
          { name: 'OH', data: vm.oh, stack: 'all', color: '#4572a7' },
          { name: 'GH', data: vm.gh, stack: 'all', color: '#e46d0a' },
          { name: 'Egyéb', data: vm.egyeb, stack: 'all', color: '#7030a0' },
          { name: 'AH', data: vm.ah, stack: 'all', color: '#7030a0' },
        ],
        xAxis: { type: 'category', categories: vm.xAxisData },
        yAxis: {
          title: {
            text: "Darab"
          }
        },
      };
      //kumulált
      vm.kumulaltchartconfig = {
        chart: { type: 'column' },
        title: { text: 'ZW1500 Selejt (arány)' },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        tooltip: {
          shared: true,
          valueDecimals: 2
        },
        series: [
          { name: 'Kumulált', type: "line", data: vm.kumulalt, color: '#e46d0a' },
          { name: 'Cél', type: "line", data: vm.standard, color: '#ff0000' },
          { name: 'Vegyes (OH+GH)', data: vm.kumohgh, stack: 'all', color: '#92d151' },
          { name: 'SL', data: vm.kumsl, stack: 'all', color: '#c0514d' },
          { name: 'SEH', data: vm.kumseh, stack: 'all', color: '#ffff01' },
          { name: 'OHSL', data: vm.kumohsl, stack: 'all', color: '#c0514d' },
          { name: 'OH', data: vm.kumoh, stack: 'all', color: '#4572a7' },
          { name: 'GH', data: vm.kumgh, stack: 'all', color: '#e46d0a' },
          { name: 'Egyéb', data: vm.kumegyeb, stack: 'all', color: '#7030a0' },
          { name: 'AH', data: vm.kumah, stack: 'all', color: '#7030a0' },
        ],
        xAxis: { type: 'category', categories: vm.xAxisData },
        yAxis: {
          title: {
            text: "Darab"
          }
        },
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