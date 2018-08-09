(function() {
  'use strict';

  angular
    .module('app')
    .factory('ScrapService', ScrapService);

  ScrapService.$inject = ['$http'];
  function ScrapService($http) {
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