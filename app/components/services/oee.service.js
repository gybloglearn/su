(function () {
  'use strict';

  angular
    .module('app')
    .factory('OeeService', OeeService);

  OeeService.$inject = ['$http'];
  function OeeService($http) {
    var service = {
      getsl: getsl,
      getdowntime: getdowntime,
      getscrap: getscrap
    };

    return service;

    ////////////////
    function getsl(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=Week'
      };
      return $http(req);
    }
    function getdowntime(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/dtweek/week' + date + '.json'
      };
      return $http(req);
    }
    function getscrap(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/scrapweek/scrap' + date + '.json'
      };
      return $http(req);
    }
  }
})();