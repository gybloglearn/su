(function() {
  'use strict';

  angular
    .module('app')
    .factory('PutmodulsService', PutmodulsService);

  PutmodulsService.$inject = ['$http'];
  function PutmodulsService($http) {
    var service = {
      getmodul:getmodul,
      get:get,
      post:post,
      put:put
    };

    return service;

    ////////////////
    function getmodul(date, id) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_Modulhistory.php?startdate=' + date + '&filter=' + id + '&phaseid=Grade Date'
      };
      return $http(req);
    }
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/positions/112233'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/positions/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Pottinginfosave/positions/' + data.id,
        data: data
      };
      return $http(req);
    }
  }
})();