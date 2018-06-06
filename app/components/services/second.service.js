(function() {
  'use strict';

  angular
    .module('app')
    .factory('SecondService', SecondService);

  SecondService.$inject = ['$http'];
  function SecondService($http) {
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