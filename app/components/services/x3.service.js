(function () {
  'use strict';

  angular
    .module('app')
    .factory('X3Service', X3Service);

  X3Service.$inject = ['$http'];
  function X3Service($http) {
    var service = {
      get: get,
      getall: getall
    };

    return service;

    ////////////////
    function get(start) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL4.php?startdate=' + start
      };
      return $http(req);
    }
    function getall(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL4_Eff.php?startdate=' + date
      };
      return $http(req);
    }
  }
})();