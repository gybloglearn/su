(function() {
  'use strict';

  angular
    .module('app')
    .factory('QcService', QcService);

  QcService.$inject = ['$http'];
  function QcService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(start, end, typ, category) {
      var req = {
        method: 'GET',
        url: 'app/components/php/ZW1500Scrap.php?startdate=' + start + '&enddate=' + end + '&datetype=' + typ + '&cat=' + category
      };
      return $http(req);
    }
  }
})();