(function () {
  'use strict';

  angular
    .module('app')
    .factory('OeeService', OeeService);

  OeeService.$inject = ['$http'];
  function OeeService($http) {
    var service = {
      getpartnumber: getpartnumber,
      getsmfile: getsmfile,
      getsm: getsm
    };

    return service;

    ////////////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
    function getsmfile(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm/sm' + date + '.json'
      };
      return $http(req);
    }
    function getsm(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }
  }
})();