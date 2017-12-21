(function () {
  'use strict';

  angular
    .module('app')
    .factory('Login', Login);

  Login.$inject = ['$http'];
  function Login($http) {
    var service = {
      auth: auth,
      getQL: getQL,
      putQL: putQL
    };

    return service;

    ////////////////

    function getQL(un){
      var req = {
        method: "GET",
        url: "http://3.228.180.13/file_reports/files/quicklinks/" + un + ".json"
      };
      return $http(req);
    }
    function putQL(d){
      var req = {
        method: "POST",
        url: "http://3.228.180.13/file_reports/putQL.php",
        data: d
      };
      return $http(req);
    }
    function auth(d) {
      var req = {
        method: "POST",
        url: "../login/login",
        data: d
      };
      return $http(req);
    }
  }
})();