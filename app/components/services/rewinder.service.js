(function () {
  'use strict';

  angular
    .module('app')
    .factory('RewinderService', RewinderService);

  RewinderService.$inject = ['$http'];
  function RewinderService($http) {
    var service = {
      getrw1: getrw1,
      getrw2: getrw2
    };

    return service;

    ////////////////
    function getrw1(start) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinder_01.php?startdate=' + start
      };
      return $http(req);
    }
    function getrw2(day, mch, num) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinder_02.php?Day=' + day + '&machineid=' + mch + '&shiftnum=' + num
      };
      return $http(req);
    }
  }
})();