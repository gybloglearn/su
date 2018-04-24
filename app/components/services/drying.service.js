(function () {
  'use strict';

  angular
    .module('app')
    .factory('DryingService', DryingService);

  DryingService.$inject = ['$http'];
  function DryingService($http) {
    var service = {
      get: get,
      getArchive: getArchive
    };

    return service;

    ////////////////

    function get(dry) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Drying.php?mch=' + dry
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
  }
})();