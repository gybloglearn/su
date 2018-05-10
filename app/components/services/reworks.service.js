(function () {
  'use strict';

  angular
    .module('app')
    .factory('ReworksService', ReworksService);

  ReworksService.$inject = ['$http'];
  function ReworksService($http) {
    var service = {
      get: get,
      getpartnumber: getpartnumber
    };

    return service;

    ////////////////
    function get(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
  }
})();