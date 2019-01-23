(function () {
  'use strict';

  angular
    .module('app')
    .factory('PlanService', PlanService);

  PlanService.$inject = ['$http'];
  function PlanService($http) {
    var service = {
      get: get,
      post: post,
      put: put,
      erase: erase
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/planapi/plan/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/planapi/plan/' + data.id,
        data: data
      };
      return $http(req);
    }

    function erase(id) {
      var request = {
        method: "DELETE",
        url: 'app/components/PHP/planapi/plan/' + id
      };
      return $http(request);
    }
  }
})();