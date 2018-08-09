(function() {
  'use strict';

  angular
    .module('app')
    .factory('WeeksumService', WeeksumService);

  WeeksumService.$inject = ['$http'];
  function WeeksumService($http) {
    var service = {
      get1000partnumber: get1000partnumber,
      getbundle: getbundle,
      getpotting: getpotting,
      getetf: getetf
    };

    return service;

    ///////////

    function get1000partnumber() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_moduls.json'
      };
      return $http(req);
    }
    function getbundle(date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/ZW1500_uf/app/components/PHP/Bundle/bundle' + date + '.json'
      };
      return $http(req);
    }
    function getpotting(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_Potting.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=Centrifuge end'
      };
      return $http(req);
    }
    function getetf(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_ETF_Moduls.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=BP end'
      };
      return $http(req);
    }
  }
})();