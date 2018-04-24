(function() {
  'use strict';

  angular
    .module('app')
    .factory('PottingService', PottingService);

  PottingService.$inject = ['$http'];
  function PottingService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(datum,mch) {
      var req = {
        method: 'GET',
        url: './app/components/PHP/ZW500_Potting.php?startdate=' + datum + '&report_id=' + mch
      };
      return $http(req);
    }
  }
})();