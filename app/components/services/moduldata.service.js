(function () {
  'use strict';

  angular
    .module('app')
    .factory('ModuldataService', ModuldataService);

  ModuldataService.$inject = ['$http'];
  function ModuldataService($http) {
    var service = {
      get: get,
      getpartnumber: getpartnumber
    };

    return service;

    ////////////////
    function get(id) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/zw.modul.data.php?id=' + id
      };
      return $http(req);
    }
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: '../modulapi/mods'
      };
      return $http(req);
    }
  }
})();