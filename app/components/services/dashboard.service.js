(function () {
  'use strict';

  angular
    .module('app')
    .factory('DashboardService', DashboardService);

  DashboardService.$inject = ['$http'];
  function DashboardService($http) {
    var service = {
      getpartnumber: getpartnumber,
      getrewinder: getrewinder,
      getspinline: getspinline,
      getsm: getsm,
      getpotting: getpotting,
      getclorination: getclorination,
      getrework: getrework,
      getmtf: getmtf
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
    function getrewinder(start) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinder_01.php?startdate=' + start
      };
      return $http(req);
    }
    function getspinline(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=Day'
      };
      return $http(req);
    }
    function getsm(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Smtable.php?&startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getpotting(start, end) {
      var req = {
        method: 'GET',
        url: './app/components/PHP/Pottingtable.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getclorination(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL_Event_Log.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getrework(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getmtf(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Mtftable.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
  }
})();