(function() {
  'use strict';

  angular
    .module('app')
    .factory('DowntimechlorService', DowntimechlorService);

  DowntimechlorService.$inject = ['$http'];
  function DowntimechlorService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/11454878'
      };
      return $http(req);
    }
  }
})();