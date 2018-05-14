(function() {
  'use strict';

  angular
    .module('app')
    .factory('QcpageService', QcpageService);

  QcpageService.$inject = ['$http'];
  function QcpageService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(start, end, typ, category) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500Scrap.php?startdate=' + start + '&enddate=' + end + '&datetype=' + typ + '&cat=' + category
      };
      return $http(req);
    }
  }
})();