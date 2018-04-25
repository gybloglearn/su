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
    $mdDateLocaleProvider.firstDayOfWeek=1;
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
		}).state('drying', {
			url: 'drying',
			templateUrl: './app/components/drying/drying.html' + '?' + cp,
			controller: 'DryingController',
			controllerAs: 'vm'
		}).state('potting', {
			url: 'potting',
			templateUrl: './app/components/potting/potting.html' + '?' + cp,
			controller: 'PottingController',
			controllerAs: 'vm'
		}).state('pottingsum', {
			url: 'pottingsum',
			templateUrl: './app/components/pottingsum/pottingsum.html' + '?' + cp,
			controller: 'PottingsumController',
			controllerAs: 'vm'
		}).state('downtime', {
			url: 'downtime',
			templateUrl: './app/components/downtime/downtime.html' + '?' + cp,
			controller: 'DowntimeController',
			controllerAs: 'vm'
		}).state('downtimesum', {
			url: 'downtimesum',
			templateUrl: './app/components/downtimesum/downtimesum.html' + '?' + cp,
			controller: 'DowntimesumController',
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