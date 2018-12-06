(function() {
  'use strict';

  angular
    .module('app')
    .factory('DowntimepottingService', DowntimepottingService);

  DowntimepottingService.$inject = ['$http'];
  function DowntimepottingService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/info/11254878'
      };
      return $http(req);
    }
  }
})();