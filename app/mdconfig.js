(function () {
  'use strict';

  angular
    .module('app')
    .config(Config);

  Config.$inject = ['$mdThemingProvider'];
  function Config($mdThemingProvider) {

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
      '50': 'f7fbe5',
      '100': 'eaf4bf',
      '200': 'dded95',
      '300': 'cfe66a',
      '400': 'c4e04a',
      '500': 'badb2a',
      '600': 'b3d725',
      '700': 'abd21f',
      '800': 'a3cd19',
      '900': '94c40f',
      'A100': 'fbfff1',
      'A200': 'ecffbe',
      'A400': 'ddff8b',
      'A700': 'd6ff72',
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
        '700',
        '800',
        '900'
      ]
    });

    $mdThemingProvider.setDefaultTheme('myCustom');

  }
})();