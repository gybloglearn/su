(function () {
  'use strict';

  angular
    .module('app')
    .controller('WeekController', WeekController);

  WeekController.$inject = ['$state', '$cookies', '$rootScope', '$filter', '$mdSidenav', 'ShiftreportsService', 'ModulListService', 'SmplansService', '$http'];
  function WeekController($state, $cookies, $rootScope, $filter, $mdSidenav, ShiftreportsService, ModulListService, SmplansService, $http) {
    var vm = this;

    $rootScope.close = function () {
      $mdSidenav('left').close();
    }
    $rootScope.open = function () {
      $mdSidenav('left').open();
    }

    vm.data = [];
    vm.result = [];
    vm.weeks = [];
    vm.weekstocover = [];
    vm.displaydata = [];

    vm.load = load;
    vm.filterSMs = filterSMs;
    vm.planDeploy = plan_deploy;

    vm.getMonday = getDateOfISOWeek;
    vm.createData = createData;

    vm.rates = { smscrap: 0.8, modscrap: 0.5, min: 226 };

    activate();

    ////////////////

    function createData() {
      var result = [];
      vm.result = [];
      var shifts = ["A", "B", "C", "D"];
      for (var w = 0; w < vm.weekstocover.length; w++) {
        for (var sh = 0; sh < shifts.length; sh++) {
          result.push({
            week: vm.weekstocover[w],
            monday: $filter('date')(new Date(getDateOfISOWeek(vm.weekstocover[w], new Date().getFullYear()).getTime()), "yyyy-MM-dd"),
            sunday: $filter('date')(new Date(getDateOfISOWeek(vm.weekstocover[w], new Date().getFullYear()).getTime()).getTime()+6*24*60*60*1000, "yyyy-MM-dd"),
            szak: shifts[sh],
            smtarget: parseFloat(plan_deploy(vm.weekstocover[w], shifts[sh], 'sm')),
            smactual: parseFloat($filter('sumField')($filter('filter')(vm.data, { machine: 'SheetMaker', week: vm.weekstocover[w], szak: shifts[sh] }), 'sumgoodaeq')),
            pottingtarget: parseFloat(plan_deploy(vm.weekstocover[w], shifts[sh], 'potting')),
            pottingactual: parseFloat($filter('sumField')($filter('filter')(vm.data, { machine: 'Potting', week: vm.weekstocover[w], szak: shifts[sh] }), 'sumoutaeq')),
            bptarget: parseFloat(plan_deploy(vm.weekstocover[w], shifts[sh], 'bp')),
            bpactual: parseFloat($filter('sumField')($filter('filter')(vm.data, { machine: 'Rework', state: 'BP', week: vm.weekstocover[w], szak: shifts[sh] }), 'sumaeq')),
            mintarget: plan_deploy(vm.weekstocover[w], shifts[sh], 'min'),
            minactual: parseFloat($filter('sumField')($filter('filter')(vm.data, { machine: 'MTF', type: '!ZB500S_MIN', week: vm.weekstocover[w], szak: shifts[sh] }), 'gradeaeq')),
          });
        }
      }
      for (var r = 0; r < result.length; r++) {
        result[r].avgactual = result[r].smactual + result[r].pottingactual + result[r].bpactual;
        result[r].avgtarget = result[r].smtarget + result[r].pottingtarget + result[r].bptarget;
        result[r].smscore = result[r].smtarget < result[r].smactual ? 1 : 0;
        result[r].pottingscore = result[r].pottingtarget < result[r].pottingactual ? 1 : 0;
        result[r].bpscore = result[r].bptarget < result[r].bpactual ? 1 : 0;
        result[r].minscore = result[r].mintarget < result[r].minactual ? 1 : 0;
      }
      //console.log(result);
      vm.getScore = getScore;
      vm.setColor = setColor;
      //return result;
      vm.result = result;
    }
    function getScore(area, sh, w) {
      var shifts = ['A', 'B', 'C', 'D'];
      var shdata = [];
      shdata.push({
        shift: 'A', act: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'A', week: w }), ''+area+'actual')), tar: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'A', week: w }), ''+area+'target')),
        val: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'A', week: w }), ''+area+'actual')) / parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'A', week: w }), ''+area+'target'))
      });
      shdata.push({
        shift: 'B', act: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'B', week: w }), ''+area+'actual')), tar: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'B', week: w }), ''+area+'target')),
        val: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'B', week: w }), ''+area+'actual')) / parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'B', week: w }), ''+area+'target'))
      });
      shdata.push({
        shift: 'C', act: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'C', week: w }), ''+area+'actual')), tar: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'C', week: w }), ''+area+'target')),
        val: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'C', week: w }), ''+area+'actual')) / parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'C', week: w }), ''+area+'target'))
      });
      shdata.push({
        shift: 'D', act: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'D', week: w }), ''+area+'actual')), tar: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'D', week: w }), ''+area+'target')),
        val: parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'D', week: w }), ''+area+'actual')) / parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: 'D', week: w }), ''+area+'target'))
      });
      shdata = $filter('orderBy')(shdata, 'val');
      for (var i = 0; i < shdata.length; i++) {
        if (shdata[i].shift == sh) {
          return i;
        }
      }
    }
    function setColor(area, sh, w) {
      if (area != 'avg') {
        return $filter('sumField')($filter('filter')(vm.result, { szak: sh, week: w }), area + 'score') == 1 ? 'green' : 'red';
      } else {
        var sc = parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: sh, week: w }), 'avgactual')) / parseFloat($filter('sumField')($filter('filter')(vm.result, { szak: sh, week: w }), 'avgtarget'))
        var cl = '';
        switch (true) {
          case (sc < 0.9): cl = 'red'; break;
          case (sc >= 0.9 && sc < 0.98): cl = 'orange'; break;
          case (sc >= 0.98): cl = 'green'; break;
        }
        return cl;
      }
    }

    function targetSheets(sm) {
      var target = 0;
      if (sm.constructor === Array) {
        for (var s = 0; s < sm.length; s++) {
          var numb = $filter('filter')(vm.smplans, { machine: sm[s] })[0];
          target += parseFloat(numb.amount) / 60 * vm.passedmins[0];
        }
      } else {
        var numb = $filter('filter')(vm.smplans, { machine: sm })[0];
        target = parseFloat(numb.amount) / 60 * vm.passedmins[0];
      }
      return $filter('number')(target, 0);
    }

    function smcolor(sm, val) {
      var target = 0;
      var numb = $filter('filter')(vm.smplans, { machine: sm })[0];
      target = parseFloat(numb.amount) / 60 * vm.passedmins[0];
      if (val > 0) {
        return val < target ? 'red' : 'green';
      }
    }


    function loadPartnumbers() {
      vm.partnumbers = [];
      ModulListService.get().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function loadSMPlans() {
      vm.smplans = [];
      SmplansService.get().then(function (response) {
        vm.smplans = response.data;
        for (var i = 0; i < vm.smplans.length; i++) {
          vm.smplans[i].machine = vm.smplans[i].sm.replace('SM', 'SheetMaker');
        }
        vm.targetSheets = targetSheets;
        vm.smcolor = smcolor;
      });
    }

    function plan_deploy(wk, sh, mch) {
      var d = getDateOfISOWeek(wk, new Date().getFullYear());
      var shs = [];
      shs["A"] = 0; shs["B"] = 0; shs["C"] = 0; shs["D"] = 0; shs["T"] = 0;
      switch (mch) {
        case 'sm':
          var target = vm.rates.min / (1 - vm.rates.modscrap / 100) / (1 - vm.rates.smscrap / 100) / 2;
          for (var i = 0; i < 7; i++) {
            var da = $filter('date')(d.getTime() + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
            if (sh == 'T') {
              shs["T"] += target * 2;
            } else {
              shs[$filter('shift')(1, da)] += target;
              shs[$filter('shift')(3, da)] += target;
            }
          }
          break;
        case 'potting':
          var target = vm.rates.min / (1 - vm.rates.modscrap / 100) / 2;
          for (var i = 0; i < 7; i++) {
            var da = $filter('date')(d.getTime() + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
            if (sh == 'T') {
              shs["T"] += target * 2;
            } else {
              shs[$filter('shift')(1, da)] += target;
              shs[$filter('shift')(3, da)] += target;
            }
          }
          break;
        case 'bp':
          var target = vm.rates.min / (1 - vm.rates.modscrap / 100) / 2;
          for (var i = 0; i < 7; i++) {
            var da = $filter('date')(d.getTime() + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
            if (sh == 'T') {
              shs["T"] += target * 2;
            } else {
              shs[$filter('shift')(1, da)] += target;
              shs[$filter('shift')(3, da)] += target;
            }
          }
          break;
        case 'min':
          var target = vm.rates.min / 2;
          for (var i = 0; i < 7; i++) {
            var da = $filter('date')(d.getTime() + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
            if (sh == 'T') {
              shs["T"] += target * 2;
            } else {
              shs[$filter('shift')(1, da)] += target;
              shs[$filter('shift')(3, da)] += target;
            }
          }
          break;
      }
      return shs[sh];
    }

    function getDateOfISOWeek(w, y) {
      w = parseInt(w);
      var simple = new Date(y, 0, 1 + (w - 1) * 7);
      var dow = simple.getDay();
      var ISOweekStart = simple;
      if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
      else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
      return ISOweekStart;
    }

    function getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return [d.getUTCFullYear(), (weekNo<10?"0"+weekNo:""+weekNo)];
    }

    function load() {
      vm.load = true;
      vm.data = [];
      vm.reworkobj = [
        { shiftnum: 1, shift: $filter('shift')(1, vm.startdate) },
        { shiftnum: 3, shift: $filter('shift')(3, vm.startdate) }
      ];
      var weeks = getWeekNumber(new Date());
      /*for (var k = weeks[1]; k > weeks[1] - 8; k--) {
        vm.weekstocover.push(k - 1);
      }*/
      for (var k = weeks[1]; k > 1; k--){
        vm.weekstocover.push(k<=10?"0"+(k-1):""+(k - 1));
      }
      var szamlalo = 1;
      for (var i = 1; i < weeks[1]; i++) {
        $http.get('app/components/PHP/weeks/' + weeks[0] + (i < 10 ? '0' + i : i) + '.json').then(function (resp) {
          //console.log(resp.data);
          szamlalo++;
          for (var k = 0; k < resp.data.length; k++) {
            var response = resp.data[k];
            if (k == 0) {
              for (var r = 0; r < response.length; r++) {
                if (response[r].MachineName != "SheetMaker1" && response[r].MachineName != "SheetMaker2") {
                  response[r].machine = "Sheetmaker";
                  response[r].partnumber = response[r].type;
                  response[r].shiftnum = response[r].ShiftNum;
                  response[r].aeq = aeqserloadpartnumbers(response[r].type, true);
                  response[r].days = $filter('date')(new Date(response[r].Day).getTime(), "yyyy-MM-dd");
                  response[r].szak = $filter('shift')(response[r].shiftnum, response[r].days);
                  response[r].Totalsheets = parseInt(response[r].Totalsheets);
                  response[r].ScrapSheets = response[r].ScrapSheets ? parseInt(response[r].ScrapSheets) : 0;
                  response[r].sumgoodaeq = response[r].aeq * (response[r].Totalsheets - response[r].ScrapSheets);
                  response[r].week = getWeekNumber(new Date(response[r].days))[1];
                  vm.data.push(response[r]);
                }
              }
            }
            if (k == 1) {
              for (var r = 0; r < response.length; r++) {
                if (response[r].MachineName != "Potting1-1" && response[r].MachineName != "Potting1-2") {
                  response[r].machine = "Potting";
                  response[r].partnumber = response[r].type;
                  response[r].aeq = aeqserloadpartnumbers(response[r].type, false);
                  response[r].days = $filter('date')(new Date(response[r].Day).getTime(), "yyyy-MM-dd");
                  response[r].szak = $filter('shift')(response[r].shiftnum, response[r].days);
                  response[r].In = response[r].In != "" ? parseInt(response[r].In) : 0;
                  response[r].P3 = response[r].P3 != "" ? parseInt(response[r].P3) : 0;
                  response[r].Out = response[r].Out != "" ? parseInt(response[r].Out) : 0;
                  response[r].suminaeq = response[r].aeq * response[r].In;
                  response[r].sump3aeq = response[r].aeq * response[r].P3;
                  response[r].sumoutaeq = response[r].aeq * response[r].Out;
                  response[r].week = getWeekNumber(new Date(response[r].days))[1];
                  vm.data.push(response[r]);
                }
              }
            }
            if (k == 2) {
              for (var r = 0; r < response.length; r++) {
                if (response[r].PartGroup_Name != "UBB FLOW") {
                  response[r].machine = "MTF";
                  response[r].partnumber = response[r].type;
                  response[r].aeq = aeqserloadpartnumbers(response[r].type, false);
                  response[r].days = $filter('date')(new Date(response[r].Day).getTime(), "yyyy-MM-dd");
                  response[r].szak = $filter('shift')(response[r].shiftnum, response[r].days);
                  response[r].BOKES = response[r].BOKES * 1;
                  response[r].CHOUT = response[r].CHOUT != "" ? parseInt(response[r].CHOUT) : 0;
                  response[r].BPOUT = response[r].BPOUT != "" ? parseInt(response[r].BPOUT) : 0;
                  response[r].GRADED = response[r].GRADED != "" ? parseInt(response[r].GRADED) : 0;
                  response[r].choutaeq = response[r].aeq * response[r].CHOUT;
                  response[r].sumaeq = response[r].aeq * response[r].BPOUT;
                  response[r].gradeaeq = response[r].aeq * response[r].GRADED;
                  response[r].week = getWeekNumber(new Date(response[r].days))[1];
                  vm.data.push(response[r]);
                }
              }
            }
            if (k == 3) {
              for (var r = 0; r < response.length; r++) {
                if (response[r].BaaNCode != "3149069") {
                  response[r].machine = "Rework";
                  response[r].partnumber = response[r].BaaNCode;
                  response[r].aeq = aeqserloadpartnumbers(response[r].BaaNCode, false);
                  response[r].sumaeq = response[r].aeq * response[r].cnt;
                  for (var ob = 0; ob < vm.reworkobj.length; ob++) {
                    if (response[r].shift == vm.reworkobj[ob].shift) {
                      response[r].shiftnum = vm.reworkobj[ob].shiftnum;
                    }
                  }
                  response[r].szak = $filter('shift')(response[r].shiftstart.substr(-5) == "05:50" ? 1 : 3, response[r].shiftday);
                  response[r].week = getWeekNumber(new Date(response[r].shiftday))[1];
                  vm.data.push(response[r]);
                }
              }
            }
          }
          if (szamlalo == weeks[1]) {
            vm.createData();
            vm.load = false;
          }
        });
      }
    }

    function filterSMs(sms) {
      var result = [];
      var dt = $filter('filter')(vm.data, vm.search);
      for (var i = 0; i < dt.length; i++) {
        if (sms.indexOf(dt[i].MachineName) > -1) {
          result.push(dt[i]);
        }
      }
      return result;
    }

    function aeqser(type, forsheet) {
      var aeq = 0;
      for (var x = 0; x < vm.aeqs.length; x++) {
        if (vm.aeqs[x].name === type) {
          if (forsheet) {
            aeq = vm.aeqs[x].amount / vm.aeqs[x].sheets;
          } else {
            aeq = vm.aeqs[x].amount;
          }
        } else {
        }

      }
      return aeq;
    }

    function aeqserloadpartnumbers(type, forsheet) {
      var aeq = 0;
      for (var x = 0; x < vm.partnumbers.length; x++) {
        if (vm.partnumbers[x].id === type) {
          if (forsheet) {
            aeq = vm.partnumbers[x].aeq / vm.partnumbers[x].sheets;
          } else {
            aeq = vm.partnumbers[x].aeq * 1;
          }
        } else {
        }

      }
      return aeq;
    }

    function activate() {
      if (!$cookies.getObject('user', { path: '/' })) {
        $state.go('login')
      } else {
        vm.loading = true;
        $rootScope.user = $cookies.getObject('user', { path: '/' });
        vm.user = $cookies.getObject('user', { path: '/' });
        vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.std = vm.startdate;
        vm.search = {};
        loadPartnumbers();
        loadSMPlans();
        vm.load();
      }
    }
  }
})();