(function () {
    'use strict';
  
    angular
      .module('app')
      .filter('name_change', name_change);

      function name_change() {
        return function (name) {
            if(name.includes("01"))
            {
                name="Rewinder1"
            }
            return name
        }
    }
  })();