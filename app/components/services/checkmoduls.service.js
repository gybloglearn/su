(function() {
  'use strict';

  angular
    .module('app')
    .factory('CheckmodulsService', CheckmodulsService);

  CheckmodulsService.$inject = ['$http'];
  function CheckmodulsService($http) {
    var service = {
      get:get
    };

    return service;

    ////////////////
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/positions/11223344'
      };
      return $http(req);
    }
  }
})();