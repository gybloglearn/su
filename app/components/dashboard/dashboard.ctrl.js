(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$mdDialog', '$filter', 'WeeksumService'];
  function DashboardController($state, $cookies, $rootScope, $mdDialog, $filter, WeeksumService) {
    var vm = this;
    vm.date = new Date();
    vm.maxdate = new Date();
    vm.now = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm');
    vm.days = [];
    vm.data = [];
    vm.load = false;
    vm.loadetf = loadetf;

    activate();

    ////////////////

    function loadetf() {
      vm.load = true;
      vm.data = [];
      var gradedata = [];
      vm.startdatenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      WeeksumService.getetf(vm.startdatenum, vm.enddatenum).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var number = 0;
          if (vm.data[i].startdate != "") {
            number = new Date(vm.data[i].startdate).getHours() * 60 + new Date(vm.data[i].startdate).getMinutes();
            if (number < 350) {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate).getTime(), 'yyyy-MM-dd');
            }
            if (new Date(vm.data[i].startdate).getMinutes() > 50) {
              vm.data[i].hour = $filter('date')(new Date(vm.data[i].startdate).getTime() + 3600 * 1000, "HH");
            } else {
              vm.data[i].hour = $filter('date')(new Date(vm.data[i].startdate).getTime(), "HH");
            }

          }
          vm.data[i].Amount = 1;
          vm.data[i].AEQ = 1.2;
        }
        WeeksumService.getmodulhistory(vm.startdatenum, vm.enddatenum).then(function (response) {
          gradedata = response.data;
          for (var i = 0; i < vm.data.length; i++) {
            for (var j = 0; j < gradedata.length; j++) {
              if (vm.data[i].PhaseName == "Grade" && vm.data[i].jobid == gradedata[j].jobid) {
                vm.data[i].grade = gradedata[j].Grade;
              }
            }
          }
          console.log(vm.data);
          vm.xAxisData = [];
          vm.centri = []; vm.centricum = [];
          vm.pstart = []; vm.pstartcum = [];
          vm.chlor = []; vm.chlorcum = [];
          var targ = [];
          var hour = 0;
          for (var i = 0; i < 24; i++) {
            if (i < 18) {
              hour = (i + 6) < 10 ? "0" + (i + 6) : "" + (i + 6);
              vm.xAxisData.push(hour);
            } else {
              hour = (i - 18) < 10 ? "0" + (i - 18) : "" + (i - 18);
              vm.xAxisData.push(hour);
            }
            vm.centri.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Centrifuge end', hour: hour }).length });
            vm.pstart.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Potting flip', hour: hour }).length });
            vm.chlor.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Chlorinating end', hour: hour }).length });
            if (i > 0) {
              vm.centricum.push({ cat: hour, y: vm.centricum[i - 1].y + $filter('filter')(vm.data, { PhaseName: 'Centrifuge end', hour: hour }).length });
              vm.pstartcum.push({ cat: hour, y: vm.pstartcum[i - 1].y + $filter('filter')(vm.data, { PhaseName: 'Potting flip', hour: hour }).length });
              vm.chlorcum.push({ cat: hour, y: vm.chlorcum[i - 1].y + $filter('filter')(vm.data, { PhaseName: 'Chlorinating end', hour: hour }).length });
              targ.push({ cat: hour, y: targ[i - 1].y + 2.91 });
            } else {
              vm.centricum.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Centrifuge end', hour: hour }).length });
              vm.pstartcum.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Potting flip', hour: hour }).length });
              vm.chlorcum.push({ cat: hour, y: $filter('filter')(vm.data, { PhaseName: 'Chlorinating end', hour: hour }).length });
              targ.push({ cat: hour, y: 2.91 });
            }
          }

          vm.chartconfig = {
            chart: { type: 'column' },
            title: { text: 'ZW1500 Termékvonal' },
            subTitle: { text: 'MES adatok megjelenítése' },
            tooltip: {
              shared: true,
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y:.0f}</span><br>',
              useHTML: true
            },
            plotOptions: {
              column: {
                stacking: 'normal',
                events: {
                  click: function (ev) {
                    /*console.log(ev.point.category);
                    console.log(ev.point.options.cat + " - " + ev.point.series.name);*/
                    createinfo(ev.point.category, ev.point.series.name);
                  }
                }
              }
            },
            xAxis: { type: 'category', categories: vm.xAxisData },
            yAxis: [
              { title: { text: 'Órai Darabszám' }, min: 0, max: 8, tickInterval: 1 },
              { title: { text: 'Napi Összesítő' }, opposite: true, min: 0, max: 80, tickInterval: 10 }
            ],
            series: [
              //{ name: 'SPL end', data: vm.bundleChartData, stack: 'spl', color: 'rgb(54,147,248)' },
              { name: 'Potting flip', data: vm.pstart, stack: 'potting', color: 'rgb(255,152,33)' },
              { name: 'Potting flip összesítő', data: vm.pstartcum, type: "line", yAxis: 1, color: 'rgb(255,152,33)' },
              { name: 'Centrifuga End', data: vm.centri, stack: 'centrifuge', color: 'rgb(156,151,255)' },
              { name: 'Centrifuga End összesítő', data: vm.centricum, type: "line", yAxis: 1, color: 'rgb(156,151,255)' },
              { name: 'Klórozó ki', data: vm.chlor, stack: 'klor', color: 'rgb(102, 153, 0)' },
              { name: 'Klórozó ki összesítő', data: vm.chlorcum, type: "line", yAxis: 1, color: 'rgb(102, 153, 0)' },
              { name: 'Cél', data: targ, type: "line", yAxis: 1, color: 'rgb(255,0,0)' }
              //{ name: 'BP End', data: vm.bp, stack: 'bp' , color: 'rgb(0,92,185)'},
              //{ name: 'Scrap', data: vm.scrapgrade, stack: 'grade' , color: 'rgb(222,37,51)'},
              //{ name: 'Grade', data: vm.goodgrade, stack: 'grade' , color: 'rgb(70,173,0)'},
              //{ name: 'Cél', type: 'line', color: 'Green', data: vm.target }
            ]
          };
          vm.load = false;
        });
      });
    }

    function loadinfo() {
      vm.pottinginfo = [];

      WeeksumService.getpotting().then(function (resp) {
        vm.pottinginfo = resp.data;
      });
    }
    function loadclorinationinfo() {
      vm.clorinationinfo = [];

      WeeksumService.getclorination().then(function (resp) {
        vm.clorinationinfo = resp.data;
      });
    }

    function createinfo(categ, name) {
      if (name == "Potting flip" || name == "Centrifuga End") {
        vm.startinfo = vm.startdatenum + " " + categ + ":" + "00";
        vm.endinfo = vm.startdatenum + " " + categ + ":" + "00";

        loadinfo();
        create_potting_dialog(vm.createinfodata);
      }
      else if (name == "Klórozó ki") {
        vm.createinfodata = {};
        //vm.actplace = "";
        vm.cat = "";
        vm.descriptioninfo = "";
        vm.startclor = vm.startdatenum + " " + categ + ":" + "00";
        vm.endclor = vm.startdatenum + " " + categ + ":" + "00";

        loadclorinationinfo();
        create_chlorination_dialog(vm.createinfodata);
      }
    }

    function create_potting_dialog(item) {
      console.log(item);
      vm.item = item;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: './app/components/dashboard/dialog.potting.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
        .then(function (answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    }

    function create_chlorination_dialog(item) {
      console.log(item);
      vm.item = item;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: './app/components/dashboard/dialog.chlorination.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
        .then(function (canswer) {
          $scope.status = 'You said the information was "' + canswer + '".';
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    }

    function DialogController($scope, $mdDialog) {
      $scope.pottings = ["Statik", "Dinamik"];
      $scope.categories = [
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
      $scope.subcategories = [
        { main: "Robot", sub: "Nem veszi fel a fésűt" },
        { main: "Robot", sub: "Nem kezdi el a fésülési folyamatot" },
        { main: "Robot", sub: "Nem teszi le a fésűt" },
        { main: "Robot", sub: "Nem veszi fel az öntőfejet" },
        { main: "Robot", sub: "Nem kezdi el az öntési folyamatot" },
        { main: "Robot", sub: "Nem teszi le az öntőfejet" },
        { main: "Robot", sub: "9-es ág öntési út állítás" },
        { main: "Robot", sub: "Lefagy" },
        { main: "Uretánhőmérséklet", sub: "magas" },
        { main: "Uretánhőmérséklet", sub: "alacsony" },
        { main: "Anyaghiány", sub: "Nedves bundle" },
        { main: "Anyaghiány", sub: "SPL anyaghiány" },
        { main: "Anyaghiány", sub: "Egyéb" },
      ];
      $scope.chlorcategories = ["Anyaghiány Pottingról","Létszámhiány","Kamlock csatlakozó hiba","Szivárgás","Szivattyú","PH beállítás","Érzékelő hiba","Segédeszköz hiány","Egyéb"];
      $scope.mch = "";
      $scope.cat = "";
      $scope.scat = "";
      $scope.descriptioninfo = "";

      $scope.id = new Date().getTime();
      $scope.sso = $rootScope.user.username;
      $scope.operator_name = $rootScope.user.displayname
      $scope.start = vm.startinfo;
      $scope.end = vm.endinfo;
      
      $scope.cstart = vm.startclor;
      $scope.cend = vm.endclor;
      $scope.ccat = "";
      $scope.descriptionchlor = "";

      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (fhid, fhsso, fhopname, fhstart, fhend, fhmch, fhcat, fhscat, fhdescr) {
        var data = {
          id: fhid,
          sso: fhsso,
          operator_name: fhopname,
          start: fhstart,
          end: fhend,
          time: (new Date(fhend).getTime() - new Date(fhstart).getTime()) / 60000,
          pottingid: fhmch,
          category: fhcat,
          subcategory: fhscat,
          description: fhdescr
        }
        console.log(data);
        WeeksumService.postpotting(data).then(function (resp) {
          data = {};
        });
        $mdDialog.hide(fhid, fhsso, fhopname, fhstart, fhend, fhmch, fhcat, fhscat, fhdescr);
      };

      $scope.chlor_answer = function (cid, csso, copname, cstart, cend, ccat, cdescr) {
        var data = {
          id: cid,
          sso: csso,
          operator_name: copname,
          start: cstart,
          end: cend,
          time: (new Date(cend).getTime() - new Date(cstart).getTime()) / 60000,
          category: ccat,
          description: cdescr
        }
        console.log(data);
        WeeksumService.postclorination(data).then(function (resp) {
          data = {};
        });
        $mdDialog.hide(cid, csso, copname, cstart, cend, ccat, cdescr);
      };
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.shift = $filter('shift')(1, new Date());
      }
      loadetf();
    }
  }
})();