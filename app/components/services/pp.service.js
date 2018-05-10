(function() {
  'use strict';

  angular
    .module('app')
    .factory('PpService', PpService);

  PpService.$inject = ['$http'];
  function PpService($http) {
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