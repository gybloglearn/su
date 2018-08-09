(function() {
  'use strict';

  angular
    .module('app')
    .factory('FluxusService', FluxusService);

  FluxusService.$inject = ['$http'];
  function FluxusService($http) {
    var service = {
      getpartnumber: getpartnumber,
      getetf: getetf
    };

    return service;

    ////////////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_moduls.json'
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