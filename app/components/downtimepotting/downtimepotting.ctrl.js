(function () {
  'use strict';

  angular
    .module('app')
    .controller('DowntimepottingController', DowntimepottingController);

  DowntimepottingController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'DowntimepottingService'];
  function DowntimepottingController($state, $cookies, $rootScope, $filter, $mdSidenav, DowntimepottingService) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (6 * 24 * 3600 * 1000));
    vm.enddate = new Date();
    vm.maxdate = new Date();
    vm.mch = "";
    vm.cat = "";
    vm.filterload = filterload;
    vm.loading=false;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    activate();

    ////////////////

    vm.pottings = ["Statik", "Dinamik"];
    vm.categories = [
      { id: "Statik", cat: "Robot" },
      { id: "Statik", cat: "Uretánhőmérséklet" },
      { id: "Statik", cat: "Anyaghiány" },
      { id: "Statik", cat: "Mobil klíma vízelvezetés" },
      { id: "Statik", cat: "Keverési arány hiba" },
      { id: "Statik", cat: "Komponens beszáradás" },
      { id: "Statik", cat: "Munkahenger hiba" },
      { id: "Statik", cat: "Uretánkötési hiba" },
      { id: "Statik", cat: "Klemp hiba" },
      { id: "Statik", cat: "Létszámhiány" },
      { id: "Statik", cat: "Mold hiány" },
      { id: "Statik", cat: "Alapanyaghiba" },
      { id: "Statik", cat: "Egyéb" },
      { id: "Dinamik", cat: "Burkolat nyitás és csukási hiba" },
      { id: "Dinamik", cat: "Frekiváltó nem pörget" },
      { id: "Dinamik", cat: "Frekiváltó vészkör hiba" },
      { id: "Dinamik", cat: "Stukt fejet nem veszi fel/ teszi le uretán" },
      { id: "Dinamik", cat: "Soft fejet nem veszi fel/ teszi le" },
      { id: "Dinamik", cat: "Uretán keverési arány hiba" },
      { id: "Dinamik", cat: "Uretán „B” frekiváltó hiba" },
      { id: "Dinamik", cat: "55g után az öntés megáll" },
      { id: "Dinamik", cat: "Uretánkifolyás" },
      { id: "Dinamik", cat: "Uretánhőmérséklet" },
      { id: "Dinamik", cat: "Hiba nélküli megállás" },
      { id: "Dinamik", cat: "PLC szerint uretán beadagolva, valóságban nem" },
      { id: "Dinamik", cat: "Centri cső alapanyaghiba" },
      { id: "Dinamik", cat: "Anyaghiány Statikról" },
      { id: "Dinamik", cat: "Létszámhiány" },
      { id: "Dinamik", cat: "Próbapörgetés" },
      { id: "Dinamik", cat: "Rossz pozícióba önt" },
      { id: "Dinamik", cat: "Egyéb" }
    ];

    function load() {
      vm.dbdata = [];
      vm.loading=true;
      DowntimepottingService.get().then(function (response) {
        vm.dbdata = response.data;
        for (var i = 0; i < vm.dbdata.length; i++) {
          var num = (new Date(vm.dbdata[i].start_date).getHours() * 60) + (new Date(vm.dbdata[i].start_date).getMinutes());
          if (num > 350) {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime(), 'yyyy-MM-dd');
          }
          else {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
        }
        filterload();
        vm.loading=false;
      });
    }

    function filterload() {
      vm.guidata = [];
      var dnum1 = new Date(vm.startdate).getTime();
      var dnum2 = new Date(vm.enddate).getTime();
      for (var i = 0; i < vm.dbdata.length; i++) {
        var dnum3 = new Date(vm.dbdata[i].day).getTime();
        if (dnum3 >= dnum1 && dnum3 <= dnum2) {
          vm.guidata.push(vm.dbdata[i]);
        }
      }
      vm.guidata = $filter('filter')(vm.guidata, { pottingid: vm.mch });
      vm.guidata = $filter('filter')(vm.guidata, { category: vm.cat });
      createchart();
    }

    function createchart() {
      vm.cats = [];
      //statik
      vm.statikrobot = [];
      vm.statikuretanhomerseklet = [];
      vm.statikanyaghiany = [];
      vm.statikmobilklimavizelvezetes = [];
      vm.statikkeveresiaranyhiba = [];
      vm.statikkomponensbeszaradas = [];
      vm.statikmunkahengerhiba = [];
      vm.statikuretankotesihiba = [];
      vm.statikklemphiba = [];
      vm.statikletszamhiany = [];
      vm.statikmoldhiany = [];
      vm.statikalapanyaghiba = [];
      vm.statikegyeb = [];
      //dinamik
      vm.dinamikburkolatnyitasescsukasihiba = [];
      vm.dinamikfrekivaltonemporget = [];
      vm.dinamikfrekivaltoveszkorhiba = [];
      vm.dinamikstuktfejetnemveszifelteszileuretan = [];
      vm.dinamiksoftfejetnemveszifelteszile = [];
      vm.dinamikuretankeveresiaranyhiba = [];
      vm.dinamikuretanbfrekivaltohiba = [];
      vm.dinamik55gutanazontesmegall = [];
      vm.dinamikuretankifolyas = [];
      vm.dinamikuretanhomerseklet = [];
      vm.dinamikhibanelkulimegallas = [];
      vm.dinamikplcszerinturetanbeadagolvavalosagbannem = [];
      vm.dinamikcentricsoalapanyaghiba = [];
      vm.dinamikanyaghianystatikrol = [];
      vm.dinamikletszamhiany = [];
      vm.dinamikprobaporgetes = [];
      vm.dinamikrosszpoziciobaont = [];
      vm.dinamikegyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        //statik
        vm.statikrobot.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Robot', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikuretanhomerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Uretánhőmérséklet', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikanyaghiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Anyaghiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikmobilklimavizelvezetes.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Mobil klíma vízelvezetés', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikkeveresiaranyhiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Keverési arány hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikkomponensbeszaradas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Komponens beszáradás', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikmunkahengerhiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Munkahenger hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikuretankotesihiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Uretánkötési hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikklemphiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Klemp hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikletszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikmoldhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Mold hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikalapanyaghiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Alapanyaghiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikegyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
        //dinamik
        vm.dinamikburkolatnyitasescsukasihiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Burkolat nyitás és csukási hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikfrekivaltonemporget.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Frekiváltó nem pörget', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikfrekivaltoveszkorhiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Frekiváltó vészkör hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikstuktfejetnemveszifelteszileuretan.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Stukt fejet nem veszi fel/ teszi le uretán', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamiksoftfejetnemveszifelteszile.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Soft fejet nem veszi fel/ teszi le', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikuretankeveresiaranyhiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Uretán keverési arány hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikuretanbfrekivaltohiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Uretán „B” frekiváltó hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamik55gutanazontesmegall.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: '55g után az öntés megáll', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikuretankifolyas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Uretánkifolyás', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikuretanhomerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Uretánhőmérséklet', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikhibanelkulimegallas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Hiba nélküli megállás', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikplcszerinturetanbeadagolvavalosagbannem.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'PLC szerint uretán beadagolva, valóságban nem', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikcentricsoalapanyaghiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Centri cső alapanyaghiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikanyaghianystatikrol.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Anyaghiány Statikról', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikletszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikprobaporgetes.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Próbapörgetés', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikrosszpoziciobaont.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Rossz pozícióba önt', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikegyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 })
      }
      console.log(vm.statikrobot);

      vm.chartconfig_statik = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-statik' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: 
          { title: { text: 'Perc' } },
        series: [
          { name: 'Robot', data: vm.statikrobot, stack: 'Statik' },
          { name: 'Uretánhőmérséklet', data: vm.statikuretanhomerseklet, stack: 'Statik' },
          { name: 'Anyaghiány', data: vm.statikanyaghiany, stack: 'Statik' },
          { name: 'Mobil klíma vízelvezetés', data: vm.statikmobilklimavizelvezetes, stack: 'Statik' },
          { name: 'Keverési arány hiba', data: vm.statikkeveresiaranyhiba, stack: 'Statik' },
          { name: 'Komponens beszáradás', data: vm.statikkomponensbeszaradas, stack: 'Statik' },
          { name: 'Munkahenger hiba', data: vm.statikmunkahengerhiba, stack: 'Statik' },
          { name: 'Uretánkötési hiba', data: vm.statikuretankotesihiba, stack: 'Statik' },
          { name: 'Klemp hiba', data: vm.statikklemphiba, stack: 'Statik' },
          { name: 'Létszámhiány', data: vm.statikletszamhiany, stack: 'Statik' },
          { name: 'Mold hiány', data: vm.statikmoldhiany, stack: 'Statik' },
          { name: 'Alapanyaghiba', data: vm.statikalapanyaghiba, stack: 'Statik' },
          { name: 'Egyéb', data: vm.statikegyeb, stack: 'Statik' },

          /*{ name: 'Dinamik-Burkolat nyitás és csukási hiba', data: vm.dinamikburkolatnyitasescsukasihiba, stack: 'Dinamik' },
          { name: 'Dinamik-Frekiváltó nem pörget', data: vm.dinamikfrekivaltonemporget, stack: 'Dinamik' },
          { name: 'Dinamik-Frekiváltó vészkör hiba', data: vm.dinamikfrekivaltoveszkorhiba, stack: 'Dinamik' },
          { name: 'Dinamik-Stukt fejet nem veszi fel/ teszi le uretán', data: vm.dinamikstuktfejetnemveszifelteszileuretan, stack: 'Dinamik' },
          { name: 'Dinamik-Soft fejet nem veszi fel/ teszi le', data: vm.dinamiksoftfejetnemveszifelteszile, stack: 'Dinamik' },
          { name: 'Dinamik-Uretán keverési arány hiba', data: vm.dinamikuretankeveresiaranyhiba, stack: 'Dinamik' },
          { name: 'Dinamik-Uretán „B” frekiváltó hiba', data: vm.dinamikuretanbfrekivaltohiba, stack: 'Dinamik' },
          { name: 'Dinamik-55g után az öntés megáll', data: vm.dinamik55gutanazontesmegall, stack: 'Dinamik' },
          { name: 'Dinamik-Uretánkifolyás', data: vm.dinamikuretankifolyas, stack: 'Dinamik' },
          { name: 'Dinamik-Uretánhőmérséklet', data: vm.dinamikuretanhomerseklet, stack: 'Dinamik' },
          { name: 'Dinamik-Hiba nélküli megállás', data: vm.dinamikhibanelkulimegallas, stack: 'Dinamik' },
          { name: 'Dinamik-PLC szerint uretán beadagolva, valóságban nem', data: vm.dinamikplcszerinturetanbeadagolvavalosagbannem, stack: 'Dinamik' },
          { name: 'Dinamik-Centri cső alapanyaghiba', data: vm.dinamikcentricsoalapanyaghiba, stack: 'Dinamik' },
          { name: 'Dinamik-Anyaghiány Statikról', data: vm.dinamikanyaghianystatikrol, stack: 'Dinamik' },
          { name: 'Dinamik-Létszámhiány', data: vm.dinamikletszamhiany, stack: 'Dinamik' },
          { name: 'Dinamik-Próbapörgetés', data: vm.dinamikprobaporgetes, stack: 'Dinamik' },
          { name: 'Dinamik-Rossz potícióba önt', data: vm.dinamikrosszpoziciobaont, stack: 'Dinamik' },
          { name: 'Dinamik-Egyéb', data: vm.dinamikegyeb, stack: 'Dinamik' },*/
        ],
      };
      vm.chartconfig_dinamik = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-dinamik' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: 
          { title: { text: 'Perc' } },
        series: [
          /*{ name: 'Statik-Robot', data: vm.statikrobot, stack: 'Statik' },
          { name: 'Statik-Uretánhőmérséklet', data: vm.statikuretanhomerseklet, stack: 'Statik' },
          { name: 'Statik-Anyaghiány', data: vm.statikanyaghiany, stack: 'Statik' },
          { name: 'Statik-Mobil klíma vízelvezetés', data: vm.statikmobilklimavizelvezetes, stack: 'Statik' },
          { name: 'Statik-Keverési arány hiba', data: vm.statikkeveresiaranyhiba, stack: 'Statik' },
          { name: 'Statik-Komponens beszáradás', data: vm.statikkomponensbeszaradas, stack: 'Statik' },
          { name: 'Statik-Munkahenger hiba', data: vm.statikmunkahengerhiba, stack: 'Statik' },
          { name: 'Statik-Uretánkötési hiba', data: vm.statikuretankotesihiba, stack: 'Statik' },
          { name: 'Statik-Klemp hiba', data: vm.statikklemphiba, stack: 'Statik' },
          { name: 'Statik-Létszámhiány', data: vm.statikletszamhiany, stack: 'Statik' },
          { name: 'Statik-Mold hiány', data: vm.statikmoldhiany, stack: 'Statik' },
          { name: 'Statik-Alapanyaghiba', data: vm.statikalapanyaghiba, stack: 'Statik' },
          { name: 'Statik-Egyéb', data: vm.statikegyeb, stack: 'Statik' },*/

          { name: 'Burkolat nyitás és csukási hiba', data: vm.dinamikburkolatnyitasescsukasihiba, stack: 'Dinamik' },
          { name: 'Frekiváltó nem pörget', data: vm.dinamikfrekivaltonemporget, stack: 'Dinamik' },
          { name: 'Frekiváltó vészkör hiba', data: vm.dinamikfrekivaltoveszkorhiba, stack: 'Dinamik' },
          { name: 'Stukt fejet nem veszi fel/ teszi le uretán', data: vm.dinamikstuktfejetnemveszifelteszileuretan, stack: 'Dinamik' },
          { name: 'Soft fejet nem veszi fel/ teszi le', data: vm.dinamiksoftfejetnemveszifelteszile, stack: 'Dinamik' },
          { name: 'Uretán keverési arány hiba', data: vm.dinamikuretankeveresiaranyhiba, stack: 'Dinamik' },
          { name: 'Uretán „B” frekiváltó hiba', data: vm.dinamikuretanbfrekivaltohiba, stack: 'Dinamik' },
          { name: '55g után az öntés megáll', data: vm.dinamik55gutanazontesmegall, stack: 'Dinamik' },
          { name: 'Uretánkifolyás', data: vm.dinamikuretankifolyas, stack: 'Dinamik' },
          { name: 'Uretánhőmérséklet', data: vm.dinamikuretanhomerseklet, stack: 'Dinamik' },
          { name: 'Hiba nélküli megállás', data: vm.dinamikhibanelkulimegallas, stack: 'Dinamik' },
          { name: 'PLC szerint uretán beadagolva, valóságban nem', data: vm.dinamikplcszerinturetanbeadagolvavalosagbannem, stack: 'Dinamik' },
          { name: 'Centri cső alapanyaghiba', data: vm.dinamikcentricsoalapanyaghiba, stack: 'Dinamik' },
          { name: 'Anyaghiány Statikról', data: vm.dinamikanyaghianystatikrol, stack: 'Dinamik' },
          { name: 'Létszámhiány', data: vm.dinamikletszamhiany, stack: 'Dinamik' },
          { name: 'Próbapörgetés', data: vm.dinamikprobaporgetes, stack: 'Dinamik' },
          { name: 'Rossz potícióba önt', data: vm.dinamikrosszpoziciobaont, stack: 'Dinamik' },
          { name: 'Egyéb', data: vm.dinamikegyeb, stack: 'Dinamik' },
        ],
      };
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
      }
      load();
    }
  }
})();