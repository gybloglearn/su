(function() {
  'use strict';

  angular
    .module('app')
    .factory('ShiftreportsService', ShiftreportsService);

  ShiftreportsService.$inject = ['$http'];
  function ShiftreportsService($http) {
    var service = {
      getSM:getSM,
      getPOTTING:getPOTTING,
      getMTF:getMTF,
      getRework: getRework,
      getSAP:getSAP
    };

    return service;

    ////////////////
    function getSM(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/SM.report.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getPOTTING(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/POTTING.report.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getMTF(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF.report.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getRework(startdate, enddate){
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getSAP(){
      var req = {
        method: 'GET',
        url: '../uf/app/components/PHP/sapdata.php'
      };
      return $http(req);
    }
  }
})();