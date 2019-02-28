(function () {
  'use strict';

  angular
    .module('app')
    .controller('WwtpController', WwtpController);

  WwtpController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'WwtpdataService'];
  function WwtpController($state, $cookies, $rootScope, $filter, $mdSidenav, WwtpdataService) {
    var vm = this;
    vm.data = [];
    vm.load = load;

    $rootScope.close = function(){
      $mdSidenav('left').close();
    }
    $rootScope.open = function(){
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    function load(){
      var yAxises = [];
      var dataSeries = [];
      WwtpdataService.get().then(function (response){
        vm.data = response.data;
        console.log(vm.data);
      });
      if(vm.ch == 'Nyers víz'){
        yAxises = [
          {title: 'Nitrogén és szabad klór'},
          {title: 'Kémiai oxigén igény'}
        ];
        dataSeries = [
          {name: 'KOI', yAxis: 1, color: 'red', marker: {enabled: true, symbol:'circle'}},
          {name: 'KOI cél', yAxis: 1, color: 'red', marker: {enabled: false}},
          {name: 'TN', yAxis: 0, color: 'rgb(0,176,80)', marker: {enabled: true, symbol:'circle'}},
          {name: 'TN cél', yAxis: 0, color: 'rgb(0,176,80)', marker: {enabled: false}},
          {name: 'FCl', yAxis: 0, color: 'rgb(0,112,192)', marker: {enabled: true, symbol:'circle'}},
          {name: 'FCl cél', yAxis: 0, color: 'rgb(0,112,192)', marker: {enabled: false}},
          {name: 'FCl DeCL után', yAxis: 0, color: 'rgb(250,230,0)', marker: {enabled: true, symbol:'circle'}},
          {name: 'FCl DeCL után cél', yAxis: 0, color: 'rgb(250,230,0)', marker: {enabled: false}}
        ];
      } else {
        yAxises = [
          {title: 'Ammónia és kémiai oxigén igény'},
          {title: 'Hőmérséklet'}
        ];
        dataSeries = [
          {name: 'KOI', yAxis: 0, color: 'rgb(0,112,192)', marker: {enabled: true, symbol: 'circle'}},
          {name: 'KOI cél', yAxis: 0, color: 'rgb(0,112,192)', marker: {enabled: false}},
          {name: 'Ammónia', yAxis: 0, color: 'rgb(0,176,80)', marker: {enabled: true, symbol: 'circle'}},
          {name: 'Ammónia cél', yAxis: 0, color: 'rgb(0,176,80)', marker: {enabled: false}},
          {name: 'Hómérséklet', yAxis: 1, color: 'red', marker: {enabled: true, symbol: 'circle'}},
          {name: 'Hőmérséklet cél', yAxis: 1, color: 'red', marker: {enabled: false}},
        ]
      }

      vm.wwtpChart = {
        chart: { type: 'line', height: 600 },
        title: { text: '<p style="text-align: center">Napi Szennyvíztelepi adatok<br>(' + vm.ch + ')</p>', useHTML: true, align: "center" },
        tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}. hét</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{point.color};font-weight:bold">{point.y:.1f}</span></span><br/>' },
        xAxis: { type: 'category', tickInterval: 1, gridLineWidth: 1 },
        yAxis: yAxises,
        series: dataSeries
      };
    }


    function activate() {
      if (!$cookies.getObject('user', {path: '/'})) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user',{path: '/'});
        vm.user = $cookies.getObject('user', {path: '/'});
        vm.ch = 'Nyers víz';
        load();
      }
    }
  }
})();