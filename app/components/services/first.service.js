(function() {
  'use strict';

  angular
    .module('app')
    .factory('FirstService', FirstService);

  FirstService.$inject = ['$http'];
  function FirstService($http) {
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