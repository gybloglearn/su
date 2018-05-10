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
		}).state('mtf', {
			url: 'mtf',
			templateUrl: './app/components/mtf/mtf.html' + '?' + cp,
			controller: 'MtfController',
			controllerAs: 'vm'
		}).state('reworks', {
			url: 'reworks',
			templateUrl: './app/components/reworks/reworks.html' + '?' + cp,
			controller: 'ReworksController',
			controllerAs: 'vm'
		}).state('archiv', {
			url: 'archiv',
			templateUrl: './app/components/archiv/archiv.html' + '?' + cp,
			controller: 'ArchivController',
			controllerAs: 'vm'
		}).state('pp', {
			url: 'pp',
			templateUrl: './app/components/pp/pp.html' + '?' + cp,
			controller: 'PpController',
			controllerAs: 'vm'
		}).state('bps', {
			url: 'bps',
			templateUrl: './app/components/bps/bps.html' + '?' + cp,
			controller: 'BpsController',
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