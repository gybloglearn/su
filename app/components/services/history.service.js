(function () {
  'use strict';

  angular
    .module('app')
    .factory('HistoryService', HistoryService);

  HistoryService.$inject = ['$http'];
  function HistoryService($http) {
    var service = {
      getpartnumber: getpartnumber,
      getmodul: getmodul,
      getmap: getmap,
      get: get,
      post: post
    };

    return service;

    ////////////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: '../modulapi/mods'
      };
      return $http(req);
    }
    function getmodul(date, id) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ModulHistory.php?startdate=' + date + '&modulid=' + id
      };
      return $http(req);
    }
    function getmap(start, end, tank) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF_BT.php?startdate=' + start + '&enddate=' + end + '&machineid=' + tank
      };
      return $http(req);
    }
    function get(mod) {
      var req = {
        method: 'GET',
        url: '../History_Plan/' + mod,
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: '../History_Plan/plan/' + data.id,
        data: data,
        headers: { "Content-Type": "application/json" }
      };
      return $http(req);
    }
  }
})();