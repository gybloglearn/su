(function() {
  'use strict';

  angular
    .module('app')
    .factory('OperatorsService', OperatorsService);

  OperatorsService.$inject = ['$http'];
  function OperatorsService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(startd, pot, num) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/PottingDashboard.php?startdate=' + startd + '&machinename=' + pot + '&phasename=' + num
      };
      return $http(req);
    }
  }
})();