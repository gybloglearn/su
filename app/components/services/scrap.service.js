(function () {
  'use strict';

  angular
    .module('app')
    .factory('ScrapService', ScrapService);

  ScrapService.$inject = ['$http'];
  function ScrapService($http) {
    var service = {
      get: get
    };

    return service;

    ////////////////
    function get(startdat, enddat, categ) {
      var req = {
        method: 'GET',
        url: 'app/components/php/ZW1500FGScrapData.php?startdate=' + startdat + '&enddate=' + enddat + '&cat=' + categ
      };
      return $http(req);
    }
  }
})();