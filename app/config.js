(function () {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', '$mdDateLocaleProvider'];
  function Config($urlRouterProvider, $stateProvider, $locationProvider, $mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date){
      return moment(date).format('YYYY-MM-DD');
    }
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    var cp = new Date().getTime().toString().substr(-5);
    // routing
    //$urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');
    $stateProvider.state('dashboard', {
      url: '/',
      templateUrl: './app/components/dashboard/dashboard.html' + '?' + cp,
      controller: 'DashboardController',
      controllerAs: 'vm'
		}).state('quicklinks', {
			url: 'quicklinks',
			templateUrl: './app/components/quicklinks/quicklinks.html' + '?' + cp,
			controller: 'QuicklinksController',
			controllerAs: 'vm'
		}).state('wwtp', {
			url: 'wwtp',
			templateUrl: './app/components/wwtp/wwtp.html' + '?' + cp,
			controller: 'WwtpController',
			controllerAs: 'vm'
		}).state('login', {
      url: '/login',
      templateUrl: './app/components/login/login.html' + '?' + cp,
      controller: 'LoginController',
      controllerAs: 'vm'
    }).state('logout', {
      url: '/logout',
      controller: function ($cookies, $rootScope, $state) {
        $cookies.remove('user', { path: '/' });
        $rootScope.user = null;
        $state.go('dashboard', {}, { reload: true });
      }
    });
  }
})();