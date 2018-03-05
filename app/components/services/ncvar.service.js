(function() {
  'use strict';

  angular
    .module('app')
    .factory('NcvarService', NcvarService);

  NcvarService.$inject = ['$http'];
  function NcvarService($http) {
    var service = {
      get:get,
      post:post,
      putfile:putfile
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/services/data'
      };
      return $http(req);
    }
    function post(data){
      var req = {
        method: 'POST',
        url: 'app/components/services/data/ncvar/new',
      };
      return $http(req);
    }
    function putfile(data){
      var req = {
        mehtod: 'POST',
        url: 'app/components/services/data/newfile',
        data: data
      };
      return $http(req);
    }
  }
})();