(function() {
  'use strict';

  angular
    .module('app')
    .factory('PottingService', PottingService);

  PottingService.$inject = ['$http'];
  function PottingService($http) {
    var service = {
      getpartnumber:getpartnumber,
      getpotting:getpotting
    };

    return service;

    ////////////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_moduls.json'
      };
      return $http(req);
    }

    function getpotting(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_Potting.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=Centrifuge end'
      };
      return $http(req);
    }
  }
})();