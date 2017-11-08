(function () {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', '$locationProvider'];
  function Config($urlRouterProvider, $stateProvider, $mdThemingProvider, $locationProvider) {
    $mdThemingProvider.theme('myCustom')
      .primaryPalette('mySL', {
        'hue-1': '900',
        'hue-2': '300',
        'hue-3': '50'
      })
      .accentPalette('myGR', {
        'hue-1': '900',
        'hue-2': '500',
        'hue-3': 'A200'
      }).warnPalette('red');
    $mdThemingProvider.definePalette('mySL', {
      '50': 'e0e2e8',
      '100': 'b3b6c6',
      '200': '8086a1',
      '300': '4d567b',
      '400': '26315e',
      '500': '000d42',
      '600': '000b3c',
      '700': '000933',
      '800': '00072b',
      '900': '00031d',
      'A100': '5b5bff',
      'A200': '2828ff',
      'A400': '0000f4',
      'A700': '0000da',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': [
        '50',
        '100',
        '200'
      ],
      'contrastLightColors': [
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        'A100',
        'A200',
        'A400',
        'A700'
      ]
    });

    $mdThemingProvider.definePalette('myGR', {
      '50': 'f3f9e8',
      '100': 'e1f0c6',
      '200': 'cde6a0',
      '300': 'b9dc7a',
      '400': 'aad55e',
      '500': '9bcd41',
      '600': '93c83b',
      '700': '89c132',
      '800': '7fba2a',
      '900': '6dae1c',
      'A100': 'e1f0c6',
      'A200': 'cde6a0',
      'A400': 'aad55e',
      'A700': '89c132',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': [
        '50',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        'A100',
        'A200',
        'A400',
        'A700'
      ],
      'contrastLightColors': [
        '700', '800', '900'
      ]
    });
    $mdThemingProvider.setDefaultTheme('myCustom');
    // routing
    $urlRouterProvider.otherwise('/404');
    $locationProvider.hashPrefix('');

    $stateProvider.state('home', {
      url: '/',
      templateUrl: './components/home/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    }).state('home.404', {
      url: '404',
      templateUrl: './components/home/404/404.html',
      controller: 'Home404Controller',
      controllerAs: 'vm',
      parent: 'home'
    }).state('home.dashboard', {
      url: 'vezerlopult',
      templateUrl: './components/home/dashboard/dashboard.html',
      controller: 'HomeDashboardController',
      controllerAs: 'vm',
      parent: 'home'
    }).state('login', {
      url: '/login',
      templateUrl: './components/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
    $stateProvider.state('logout', {
      url: '/logout',
      controller: function ($cookies, $rootScope, $state) {
        $cookies.remove('user', {path: '/'});
        $rootScope.user = {};
        $state.go('home.dashboard', {}, { reload: true });
      }
    });
  }
})();