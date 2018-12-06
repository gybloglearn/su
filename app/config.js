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
		}).state('weeksum', {
			url: 'weeksum',
			templateUrl: './app/components/weeksum/weeksum.html' + '?' + cp,
			controller: 'WeeksumController',
			controllerAs: 'vm'
		}).state('qc', {
			url: 'qc',
			templateUrl: './app/components/qc/qc.html' + '?' + cp,
			controller: 'QcController',
			controllerAs: 'vm'
		}).state('scrap', {
			url: 'scrap',
			templateUrl: './app/components/scrap/scrap.html' + '?' + cp,
			controller: 'ScrapController',
			controllerAs: 'vm'
		}).state('downtimepotting', {
			url: 'downtimepotting',
			templateUrl: './app/components/downtimepotting/downtimepotting.html' + '?' + cp,
			controller: 'DowntimepottingController',
			controllerAs: 'vm'
		}).state('downtimechlor', {
			url: 'downtimechlor',
			templateUrl: './app/components/downtimechlor/downtimechlor.html' + '?' + cp,
			controller: 'DowntimechlorController',
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