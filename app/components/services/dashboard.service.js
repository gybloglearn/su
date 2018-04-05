(function () {
  'use strict';

  angular
    .module('app')
    .factory('DashboardService', DashboardService);

  DashboardService.$inject = ['$http'];
  function DashboardService($http) {
    var service = {
      getsl: getsl,
      getdowntime: getdowntime,
      getscrap: getscrap
    };

    return service;

    ////////////////
    function getsl(start, end, cat) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=Day'
      };
      return $http(req);
    }
    function getdowntime(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/SPL36Downtime.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getscrap(start, end, level) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/eScrap.php?startdate=' + start + '&enddate=' + end + '&wrf_level_id=Konyvelve&wrf_area=WP03 Fiber'
      };
      return $http(req);
    }
  }
})();