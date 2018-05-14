(function() {
  'use strict';

  angular
    .module('app')
    .factory('Zw1500scrapService', Zw1500scrapService);

  Zw1500scrapService.$inject = ['$http'];
  function Zw1500scrapService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(startdat,enddat,categ) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500FGScrapData.php?startdate=' + startdat + '&enddate=' + enddat + '&cat=' + categ
      };
      return $http(req);
    }
  }
})();