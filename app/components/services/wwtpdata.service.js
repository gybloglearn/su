(function() {
  'use strict';

  angular
    .module('app')
    .factory('WwtpdataService', WwtpdataService);

  WwtpdataService.$inject = ['$http'];
  function WwtpdataService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/wwtpdata/data'
      };
      return $http(req);
    }
  }
})();