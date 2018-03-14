(function() {
  'use strict';

  angular
    .module('app')
    .factory('RewindersumService', RewindersumService);

  RewindersumService.$inject = ['$http'];
  function RewindersumService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get(date) {
      var req = {
        method: 'GET',
        url: '..Braid/app/components/PHP/Rewinder/rewinder' + date + '.json'
      };
      return $http(req);
    }
  }
})();