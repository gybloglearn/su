(function () {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
  function Config($urlRouterProvider, $stateProvider, $locationProvider) {
    // routing
    //$urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');
    $stateProvider.state('dashboard', {
      url: '/',
      templateUrl: './app/components/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
		}).state('newroute', {
			url: 'newroute',
			templateUrl: './app/components/newroute/newroute.html',
			controller: 'NewrouteController',
			controllerAs: 'vm'
		}).state('login', {
      url: '/login',
      templateUrl: './app/components/login/login.html',
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