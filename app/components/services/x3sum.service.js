(function () {
  'use strict';

  angular
    .module('app')
    .factory('X3sumService', X3sumService);

  X3sumService.$inject = ['$http'];
  function X3sumService($http) {
    var service = {
      getmulti: getmulti
    };

    return service;

    ////////////////
 
    function getmulti(startd, endd) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL4.php?startdate=' + startd + '&enddate=' + endd
      };
      return $http(req);
    }
  }
})();