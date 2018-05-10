(function() {
  'use strict';

  angular
    .module('app')
    .factory('BpsService', BpsService);

  BpsService.$inject = ['$http'];
  function BpsService($http) {
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