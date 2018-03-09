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
    // routing
    var ver = new Date().getTime().toString().substr(-5);
    //$urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');
    $stateProvider.state('dashboard', {
      url: '/',
      templateUrl: './app/components/dashboard/dashboard.html' + '?' + ver,
      controller: 'DashboardController',
      controllerAs: 'vm'
		}).state('quicklinks', {
			url: 'quicklinks',
			templateUrl: './app/components/quicklinks/quicklinks.html',
			controller: 'QuicklinksController',
			controllerAs: 'vm'
		}).state('week', {
			url: 'week',
			templateUrl: './app/components/week/week.html' + '?' + ver,
			controller: 'WeekController',
			controllerAs: 'vm'
		}).state('day', {
			url: 'day',
			templateUrl: './app/components/day/day.html' + '?' + ver,
			controller: 'DayController',
			controllerAs: 'vm'
		}).state('sap', {
			url: 'sap',
			templateUrl: './app/components/sap/sap.html' + '?' + ver,
			controller: 'SapController',
			controllerAs: 'vm'
		}).state('month', {
			url: 'month',
			templateUrl: './app/components/month/month.html',
			controller: 'MonthController',
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