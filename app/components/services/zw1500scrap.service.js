(function() {
  'use strict';

  angular
    .module('app')
    .factory('Zw1500scrapService', Zw1500scrapService);

  Zw1500scrapService.$inject = ['$http'];
  function Zw1500scrapService($http) {
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