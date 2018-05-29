(function() {
  'use strict';

  angular
    .module('app')
    .factory('WeekdowntimeService', WeekdowntimeService);

  WeekdowntimeService.$inject = ['$http'];
  function WeekdowntimeService($http) {
    var service = {
      getsmfile:getsmfile
    };

    return service;

    ////////////////
    function getsmfile(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm/sm' + date + '.json'
      };
      return $http(req);
    }
  }
})();