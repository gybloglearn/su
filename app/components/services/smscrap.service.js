(function () {
  'use strict';

  angular
    .module('app')
    .factory('SmscrapService', SmscrapService);

  SmscrapService.$inject = ['$http'];
  function SmscrapService($http) {
    var service = {
      get: get,
      getbtw: getbtw,
      getprod: getprod
    };

    return service;

    ////////////////
    function get(start) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm.scraps.php?startdate=' + start
      };
      return $http(req);
    }
    function getbtw(st, ed) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm.scraps.php?startdate=' + st + '&enddate=' + ed
      };
      return $http(req);
    }
    function getprod(startdate, enddate, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SM.php?&startdate=' + startdate + '&enddate=' + enddate + '&report_id=' + mch
      };
      return $http(req);
    }
  }
})();