(function() {
  'use strict';

  angular
    .module('app')
    .factory('X3sumService', X3sumService);

  X3sumService.$inject = ['$http'];
  function X3sumService($http) {
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