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
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
  }
})();