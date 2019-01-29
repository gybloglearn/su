(function () {
  'use strict';

  angular
    .module('app')
    .factory('DayService', DayService);

  DayService.$inject = ['$http'];
  function DayService($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ////////////////
    function get(day) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinder_01.php?startdate=' + day
      };
      return $http(req);
    }
    function getplan() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
})();