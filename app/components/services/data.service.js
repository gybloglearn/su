(function () {
  'use strict';

  angular
    .module('app')
    .factory('DataService', DataService);

  DataService.$inject = ['$http'];
  function DataService($http) {
    var service = {
      get: get,
      getAll: getAll
    };

    return service;

    ////////////////
    function get(date, sm) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/smprod.php?startdate=' + date + '&mch=' + sm
      };
      return $http(req);
    }
    function getAll() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
})();