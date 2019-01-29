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
		}).state('rewinder', {
			url: 'rewinder',
			templateUrl: './app/components/rewinder/rewinder.html' + '?' + cp,
			controller: 'RewinderController',
			controllerAs: 'vm'
		}).state('rewindersum', {
			url: 'rewindersum',
			templateUrl: './app/components/rewindersum/rewindersum.html' + '?' + cp,
			controller: 'RewindersumController',
			controllerAs: 'vm'
		}).state('plan', {
			url: 'plan',
			templateUrl: './app/components/plan/plan.html' + '?' + cp,
			controller: 'PlanController',
			controllerAs: 'vm'
		}).state('day', {
			url: 'day',
			templateUrl: './app/components/day/day.html' + '?' + cp,
			controller: 'DayController',
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