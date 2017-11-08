(function () {
  'use strict';

  angular
    .module('app')
    .factory('Login', Login);

  Login.$inject = ['$http'];
  function Login($http) {
    var service = {
      auth: auth
    };

    return service;

    ////////////////

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