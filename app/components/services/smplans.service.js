(function() {
  'use strict';

  angular
    .module('app')
    .factory('SmplansService', SmplansService);

  SmplansService.$inject = ['$http'];
  function SmplansService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: '//3.228.180.13/sm/app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
})();