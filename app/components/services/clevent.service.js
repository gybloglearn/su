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
    function get(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL_Event_Log.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
})();