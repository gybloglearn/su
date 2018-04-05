(function() {
  'use strict';

  angular
    .module('app')
    .factory('ScrapService', ScrapService);

  ScrapService.$inject = ['$http'];
  function ScrapService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(start,end,level) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/eScrap.php?startdate=' + start + '&enddate=' + end + '&wrf_level_id=' + level + '&wrf_area=WP03 Fiber'
      };
      return $http(req);
    }
  }
})();