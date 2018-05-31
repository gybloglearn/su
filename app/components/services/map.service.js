(function () {
  'use strict';

  angular
    .module('app')
    .factory('MapService', MapService);

  MapService.$inject = ['$http'];
  function MapService($http) {
    var service = {
      getpartnumber: getpartnumber,
      get: get,
      getpotting: getpotting
    };

    return service;

    ////////////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }

    function get(start, end, tank) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF_BT.php?startdate=' + start + '&enddate=' + end + '&machineid=' + tank
      };
      return $http(req);
    }

    function getpotting(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/PottingSSO.php?startdate=' + start + '&enddate=' + end + '&machinename=' + mch
      };
      return $http(req);
    }
  }
})();