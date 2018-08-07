(function() {
  'use strict';

  angular
    .module('app')
    .factory('QcService', QcService);

  QcService.$inject = ['$http'];
  function QcService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: './app/components/PHP/file.php'
      };
      return $http(req);
    }
  }
})();