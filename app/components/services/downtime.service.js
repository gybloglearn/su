(function () {
  'use strict';

  angular
    .module('app')
    .factory('DowntimeService', DowntimeService);

  DowntimeService.$inject = ['$http'];
  function DowntimeService($http) {
    var service = {
      getAll: getAll,
      post: post,
      put: put,
      erase: erase
    };

    return service;

    ////////////////
    function getAll() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/allinfos'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function erase(id) {
      var request = {
        method: "DELETE",
        url: "app/components/PHP/Pottinginfosave/info/" + id
      };
      return $http(request);
    }
  }
})();