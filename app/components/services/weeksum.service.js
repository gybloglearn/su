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
      getmodulhistory: getmodulhistory,
      getpotting: getpotting,
      postpotting: postpotting,
      putpotting: putpotting,
      getclorination: getclorination,
      postclorination: postclorination,
      putclorination: putclorination
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
    function getpotting() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/info/11254878'
      };
      return $http(req);
    }
    function postpotting(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function putpotting(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function getclorination() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/11454878'
      };
      return $http(req);
    }
    function postclorination(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/' + data.id,
        data: data
      };
      return $http(req);
    }
    function putclorination(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/' + data.id,
        data: data
      };
      return $http(req);
    }
  }
})();