(function() {
  'use strict';

  angular
    .module('app')
    .factory('ArchivService', ArchivService);

  ArchivService.$inject = ['$http'];
  function ArchivService($http) {
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