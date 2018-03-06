(function() {
  'use strict';

  angular
    .module('app')
    .factory('ModulListService', ModulListService);

  ModulListService.$inject = ['$http'];
  function ModulListService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: '//3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
  }
})();