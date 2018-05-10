(function() {
  'use strict';

  angular
    .module('app')
    .factory('MtfService', MtfService);

  MtfService.$inject = ['$http'];
  function MtfService($http) {
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