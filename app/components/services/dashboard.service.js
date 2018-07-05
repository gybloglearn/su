(function () {
  'use strict';

  angular
    .module('app')
    .factory('DashboardService', DashboardService);

  DashboardService.$inject = ['$http'];
  function DashboardService($http) {
    var service = {
      getpartnumber: getpartnumber,
      get1000partnumber: get1000partnumber,
      getrewinderfile: getrewinderfile,
      getrewinder: getrewinder,
      getspinline: getspinline,
      getsm: getsm,
      getpotting: getpotting,
      getclorination: getclorination,
      getrework: getrework,
      getmtf: getmtf,
      getbundlefile: getbundlefile,
      get1000potting: get1000potting,
      get1000etf: get1000etf,
      get1500etf: get1500etf,
      getsap: getSAP,
      getCassette: getCassette,
      getAll: getAll,
      post: post,
      put, put
    };

    return service;

    ////////////////
    function getCassette() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Cassette.json'
      };
      return $http(req);
    }
    function getSAP() {
      var req = {
        method: 'GET',
        url: '../uf/app/components/PHP/sapdata.php'
      };
      return $http(req);
    }
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
    function get1000partnumber() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_moduls.json'
      };
      return $http(req);
    }
    function getrewinderfile(num) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinderfile/rewinder' + num + '.json'
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
    function getbundlefile(date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/ZW1500_uf/app/components/PHP/Bundle/bundle' + date + '.json'
      };
      return $http(req);
    }
    function get1000potting(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_Potting.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=Centrifuge end'
      };
      return $http(req);
    }
    function get1000etf(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_ETF_Moduls.php?startdate=' + sdate + '&enddate=' + edate + '&filter=&phaseid=BP end'
      };
      return $http(req);
    }
    function get1500etf(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_ETF_Moduls.php?startdate=' + sdate + '&enddate=' + edate
      };
      return $http(req);
    }
    function getAll() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Commentsave/allcomments'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Commentsave/comment/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Commentsave/comment/' + data.id,
        data: data
      };
      return $http(req);
    }
  }
})();