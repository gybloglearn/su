(function () {
  'use strict';

  angular
    .module('app')
    .factory('SscrapService', SscrapService);

  SscrapService.$inject = ['$http'];
  function SscrapService($http) {
    var service = {
      getpartnumber:getpartnumber,
      getsheet: getsheet,
      getscrap: getscrap
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
    function getsheet(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Smtable.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getscrap(st, ed) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm.scraps.php?startdate=' + st + '&enddate=' + ed
      };
      return $http(req);
    }
  }
})();