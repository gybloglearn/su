(function() {
  'use strict';

  angular
    .module('app')
    .factory('PottingsumService', PottingsumService);

  PottingsumService.$inject = ['$http'];
  function PottingsumService($http) {
    var service = {
      get: get,
      getArchive: getArchive,
      getAll: getAll,
      post: post,
      put: put,
      erase: erase
    };

    return service;

    ////////////////
    function get(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/PottingSSO.php?startdate=' + start + '&enddate=' + end + '&machinename=' + mch
      };
      return $http(req);
    }
    function getArchive(dayhr) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/file_reports/files/drying/Dryingnumbers_' + dayhr + '.json'
      };
      return $http(req);
    }
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