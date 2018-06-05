(function () {
  'use strict';

  angular
    .module('app')
    .factory('UfService', UfService);

  UfService.$inject = ['$http'];
  function UfService($http) {
    var service = {
      getbundlefile: getbundlefile,
      getetf: getetf
    };

    return service;

    ////////////////
    function getbundlefile(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Bundle/bundle' + date + '.json'
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
  }
})();