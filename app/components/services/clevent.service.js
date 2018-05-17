(function() {
  'use strict';

  angular
    .module('app')
    .factory('CleventService', CleventService);

  CleventService.$inject = ['$http'];
  function CleventService($http) {
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