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
		}).state('administration', {
			url: 'administration',
			templateUrl: './app/components/administration/administration.html' + '?' + cp,
			controller: 'AdministrationController',
			controllerAs: 'vm'
		}).state('reports', {
			url: 'reports',
			templateUrl: './app/components/reports/reports.html' + '?' + cp,
			controller: 'ReportsController',
			controllerAs: 'vm'
		}).state('neworder', {
			url: 'neworder',
			templateUrl: './app/components/neworder/neworder.html' + '?' + cp,
			controller: 'NeworderController',
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