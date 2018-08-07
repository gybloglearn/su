(function () {
  'use strict';

  angular
    .module('app')
    .factory('WeeksumService', WeeksumService);

  WeeksumService.$inject = ['$http'];
  function WeeksumService($http) {
    var service = {
      getbundlefile: getbundlefile,
      getetf: getetf,
      getmodulhistory: getmodulhistory
    };

    return service;

    ////////////////
    function getbundlefile(date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/ZW1500_uf/app/components/PHP/Bundle/bundle' + date + '.json'
      };
      return $http(req);
    }
    function getetf(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_ETF_Moduls.php?startdate=' + sdate + '&enddate=' + edate
      };
      return $http(req);
    }
    function getmodulhistory(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_Modul_History_ETF_uf.php?startdate=' + sdate + '&enddate=' + edate + '&phaseid=Grade Date'
      };
      return $http(req);
    }
  }
})();