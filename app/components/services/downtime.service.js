(function () {
  'use strict';

  angular
    .module('app')
    .factory('DowntimeService', DowntimeService);

  DowntimeService.$inject = ['$http'];
  function DowntimeService($http) {
    var service = {
      get: get
    };

    return service;

    ////////////////
    function get(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/SPL36Downtime.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
})();