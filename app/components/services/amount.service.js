(function () {
  'use strict';

  angular
    .module('app')
    .factory('AmountService', AmountService);

  AmountService.$inject = ['$http'];
  function AmountService($http) {
    var service = {
      get: get
    };

    return service;

    ////////////////
    function get(start, end, cat) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=' + cat
      };
      return $http(req);
    }
  }
})();