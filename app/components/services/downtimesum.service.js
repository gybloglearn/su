(function() {
  'use strict';

  angular
    .module('app')
    .factory('DowntimesumService', DowntimesumService);

  DowntimesumService.$inject = ['$http'];
  function DowntimesumService($http) {
    var service = {
      getAll:getAll
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
  }
})();