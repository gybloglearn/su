(function() {
  'use strict';

  angular
    .module('app')
    .factory('WeeksumService', WeeksumService);

  WeeksumService.$inject = ['$http'];
  function WeeksumService($http) {
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