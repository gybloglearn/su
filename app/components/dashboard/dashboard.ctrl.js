(function () {
  'use strict';

  angular
    .module('app')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$cookies', '$rootScope', '$mdDialog', '$filter', 'DashboardService','$scope'];
  function DashboardController($state, $cookies, $rootScope, $mdDialog, $filter, DashboardService,$scope) {
    var vm = this;
    vm.startdate = new Date(new Date().getTime() - (7 * 24 * 3600 * 1000));
    vm.startdatenum = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.enddatenum = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.maxdate = new Date(new Date().getTime() - (24 * 3600 * 1000));
    vm.item="";
    vm.actmachine="";
    vm.beallit = beallit;
    vm.loading = false;

    activate();
    vm.chartize = chartize;

    vm.redrawChart = redrawChart;

    ////////////////

    function redrawChart(){
      createWeekChart(vm.sapdata);
    }

    Date.prototype.getWeekNumber = function () {
      var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
      var dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    };

    function createWeekChart(adat) {
      var prodline = vm.prodline;
      var wp = []; var wa = []; var wd = []; var wq4 = [];
      var lwp = []; var lwm = [];
      for (var w = 1; w < 53; w++) {
        wp.push([w, 0]);
        wa.push([w, 0]);
        if (w < new Date().getWeekNumber() || (new Date().getWeekNumber() == w && new Date().getDay() > 1))
          wd.push([w, 0]);
        lwp.push([w, 0]);
        lwm.push([w, 0]);
        for (var i = 0; i < adat.data.length; i++) {
          if (new Date(adat.data[i].NAP).getWeekNumber() == w && new Date(adat.data[i].NAP).getTime() < new Date().getTime() - (24 * 60 * 60 * 1000)) {
            if (new Date(adat.data[i].NAP).getWeekNumber() == new Date().getWeekNumber() - 1) {
              /*lwp[w - 1][1] = 3000;
              lwm[w - 1][1] = -1500;*/
              lwp[w - 1][1] = Math.max.apply(null, adat.data) + 100;
              lwm[w - 1][1] = Math.min.apply(null, adat.data) - 100;
            }
            /*wp[w - 1][1] += adat.data[i].TotalPlan;
            wa[w - 1][1] += adat.data[i].TotalActual;
            if (w >= 2 && wd[w - 1][1] == 0)
              wd[w - 1][1] += wd[w - 2][1] + adat.data[i].TotalDiff;
            else
              wd[w - 1][1] += adat.data[i].TotalDiff;*/
						wp[w - 1][1] += adat.data[i][vm.prodline + "Plan"];
            wa[w - 1][1] += adat.data[i][vm.prodline + "Actual"];
            if (w >= 2 && wd[w - 1][1] == 0){
              wd[w - 1][1] += wd[w - 2][1] + adat.data[i][vm.prodline + "Diff"];
            }
            else {
              wd[w - 1][1] += adat.data[i][vm.prodline + "Diff"];
						}
          }
        }
      }
      var ch = {
        chart: { type: 'column', height: 600 },
        title: { text: '<p style="text-align: center">Heti SAP lejelentett mennyiségek<br>(' + (vm.prodline=='Total'?'Teljes UF':vm.prodline) + ' terület)</p>', useHTML: true, align: "center" },
        tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}. hét</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{point.color};font-weight:bold">{point.y:.1f}</span></span><br/>' },
        plotOptions: {
          column: {
            groupPadding: 0.5,
            pointWidth: 13,
						events: {
							legendItemClick: function(ev){
							 if(this.name == "Utolsó lezárt Hét") {
								this.chart.series[3].visible == true ? this.chart.series[3].hide() : this.chart.series[3].show();
								this.chart.series[4].visible == true ? this.chart.series[4].hide() : this.chart.series[4].show();
								return false;
							 } else {
								 return true;
							 }
							}
						}
          }
        },
        xAxis: { type: 'category', tickInterval: 1, gridLineWidth: 1 },
        yAxis: { title: { text: "AEQ / HÉT" }, plotLines: [{ value: 0, width: 2, color: 'rgb(0,176,80)' }] },
        series: [
          { name: "Terv Összesen", color: "red", data: wp },
          { name: "Aktuális Összesen", color: "rgb(0,176,80)", data: wa },
          { name: "Különbség", color: "rgb(0,112,192)", type: "line", data: wd, dataLabels: { enabled: true, format: "{point.y:.1f}", rotation: -90, y: -20, style: { textOutline: "0px" } } }/*,
          { name: "Utolsó lezárt Hét", color: "rgba(255,255,0,.5)", data: lwp, showInLegend: true, tooltip: { format: '', pointFormat: '' } },
          { name: "ULH", color: "rgba(255,255,0,.5)", data: lwm, showInLegend: false, tooltip: { format: '', pointFormat: '' } }*/
        ]
      };
      vm.weekChart = ch;
    }

    function chartize(field, text) {
      var seriesData = [];
      var targetData = [];
      for (var i = 0; i < vm.data.length; i++) {
        seriesData.push([vm.data[i]['date'], vm.data[i][field]]);
        targetData.push([vm.data[i]['date'], vm.target[field]]);
      }

      vm.chartoptions = {
        chart: { type: "line" },
        title: { text: text + " Adatok (" + vm.startdatenum + " - " + vm.enddatenum + ")" },
        xAxis: { type: "category" },
        series: [
          { name: "Adatok", data: seriesData },
          { name: "Cél", data: targetData }
        ]
      };
    }

    function beallit() {
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
      createdataarray();
      createWeekChart();
    }

    function createdataarray() {
      vm.loading = true;
      vm.data = [];
      vm.dates = [];
      vm.datefile = [];
      var firstnum = new Date(vm.startdatenum).getTime();
      var endnum = new Date(vm.enddatenum).getTime();

      while (firstnum <= endnum) {
        var obj = {
          date: $filter('date')(firstnum, 'yyyy-MM-dd'),
          target: {},
          rewinder: 0,
          spl36: 0,
          spl2345: 0,
          //zw500
          sm: 0,
          potting: 0,
          cl: 0,
          bp: 0,
          rework: 0,
          graded: 0,
          sap0500: 0,
          casette: 0,
          //zb
          zbsm: 0,
          zbpotting: 0,
          zbbp: 0,
          zbrework: 0,
          zbgraded: 0,
          sapZB: 0,
          //zl
          zlsm: 0,
          zlpotting: 0,
          zlbp: 0,
          zlrework: 0,
          zlgraded: 0,
          sapZL: 0,
          //zw1000
          spl1000: 0,
          pottingstatic1000: 0,
          centrifugeend1000: 0,
          bpend1000: 0,
          grade1000: 0,
          sap1000: 0,
          //zw1500
          spl1500: 0,
          pottingflip1500: 0,
          centrifugeend1500: 0,
          bpend1500: 0,
          grade1500: 0,
          sap1500: 0,
					//zw700B
					grade700B: 0,
					zw700B: 0
        }
        vm.data.push(obj);
        vm.dates.push($filter('date')(firstnum, 'yyyy-MM-dd'));
        vm.datefile.push($filter('date')(firstnum, 'yyyyMMdd'));
        firstnum += 24 * 3600 * 1000;
      }
      var m = $filter('date')(new Date().getTime(), 'MM');
      var targets = {};
      switch (m) {
				case "01": targets = { zw500: 230, zw1000: 75, zw1500: 67, zb: 15, zl: 0, zw700B:15 }; break;
				case "02": targets = { zw500: 230, zw1000: 75, zw1500: 67, zb: 15, zl: 0, zw700B:15 }; break;
				case "03": targets = { zw500: 238, zw1000: 85, zw1500: 67, zb: 0, zl: 0, zw700B:10 }; break;
				case "04": targets = { zw500: 238, zw1000: 85, zw1500: 52, zb: 0, zl: 0, zw700B:10 }; break;
				case "05": targets = { zw500: 238, zw1000: 85, zw1500: 43, zb: 0, zl: 0, zw700B:10 }; break;
				case "06": targets = { zw500: 238, zw1000: 90, zw1500: 43, zb: 0, zl: 0, zw700B:10 }; break;
      };
      vm.m = m;
      var targetobj = {
        //date: $filter('date')(firstnum, 'yyyy-MM-dd'),
        rewinder: targets.zw500 * 1.005 * 1.014 * 1.022 * 1.0178,
        spl36: (targets.zw500 - 32) * 1.005 * 1.014 * 1.022,
        spl2345: 32 * 1.005 * 1.014 * 1.022,
        //zw500
        sm: targets.zw500 * 1.005 * 1.014,
        potting: targets.zw500 * 1.005,
        cl: targets.zw500 * 1.005,
        bp: targets.zw500 * 1.005,
        rework: 0,
        graded: targets.zw500,
        sap0500: targets.zw500,
        casette: 100,
        //zb
        zbsm: targets.zb * 1.05 * 1.03 * 1.03,
        zbpotting: targets.zb * 1.03 * 1.03,
        zbbp: targets.zb * 1.03,
        zbrework: 0,
        zbgraded: targets.zb,
        sapZB: targets.zb,
        //zl
        zlsm: 0,
        zlpotting: 0,
        zlbp: 0,
        zlrework: 0,
        zlgraded: 0,
        sapZL: 0,
        //zw1000
        spl1000: targets.zw1000 * 1.003 * 1.006 * 1.007,
        pottingstatic1000: targets.zw1000 * 1.003 * 1.006,
        centrifugeend1000: targets.zw1000 * 1.003 * 1.006,
        bpend1000: targets.zw1000 * 1.003,
        grade1000: targets.zw1000,
        sap1000: targets.zw1000,
        //zw1500
        spl1500: targets.zw1500 * 1.008 * 1.007,
        pottingflip1500: targets.zw1500 * 1.008,
        centrifugeend1500: targets.zw1500 * 1.008,
        bpend1500: targets.zw1500,
        grade1500: targets.zw1500,
        sap1500: targets.zw1500,
				//zw700B
				grade700B: targets.zw700B,
				sap700B: targets.zw700B
      };

      vm.target = targetobj;

      loadrewinder();
      loadspinline();
      loadsm();
      /*lodpotting();
      loadrework();
      loadmtf();
      load1000potting();
      load1000etf();
      load1500etf();
      loadbundle();*/
      loadsap();
    }

    function setTargets() {
      for (var i = 0; i < vm.data.length; i++) {
        var m = $filter('date')(new Date(vm.data[i].date).getTime(), 'MM');
        var targets = {};
        switch (m) {
					case "01": targets = { zw500: 230, zw1000: 75, zw1500: 67, zb: 15, zl: 0, zw700B: 15 }; break;
					case "02": targets = { zw500: 230, zw1000: 75, zw1500: 67, zb: 15, zl: 0, zw700B: 15 }; break;
					case "03": targets = { zw500: 230, zw1000: 75, zw1500: 67, zb: 0, zl: 0, zw700B: 10 }; break;
					case "04": targets = { zw500: 238, zw1000: 85, zw1500: 52, zb: 0, zl: 0, zw700B:10 }; break;
					case "05": targets = { zw500: 238, zw1000: 85, zw1500: 43, zb: 0, zl: 0, zw700B:10 }; break;
					case "06": targets = { zw500: 238, zw1000: 90, zw1500: 43, zb: 0, zl: 0, zw700B:10 }; break;
        };
        var targetobj = {
          //date: $filter('date')(firstnum, 'yyyy-MM-dd'),
          rewinder: targets.zw500 * 1.005 * 1.014 * 1.022 * 1.0178,
          spl36: (targets.zw500 - 32) * 1.005 * 1.014 * 1.022,
          spl2345: 32 * 1.005 * 1.014 * 1.022,
          //zw500
          sm: targets.zw500 * 1.005 * 1.014,
          potting: targets.zw500 * 1.005,
          cl: targets.zw500 * 1.005,
          bp: targets.zw500 * 1.005,
          rework: 0,
          graded: targets.zw500,
          sap0500: targets.zw500,
          casette: 100,
          //zb
          zbsm: targets.zb * 1.05*1.03*1.03,
          zbpotting: targets.zb * 1.03*1.03,
          zbbp: targets.zb * 1.03,
          zbrework: 0,
          zbgraded: targets.zb,
          sapZB: targets.zb,
          //zl
          zlsm: 0,
          zlpotting: 0,
          zlbp: 0,
          zlrework: 0,
          zlgraded: 0,
          sapZL: 0,
          //zw1000
          spl1000: targets.zw1000 * 1.003 * 1.006 * 1.007,
          pottingstatic1000: targets.zw1000 * 1.003 * 1.006,
          centrifugeend1000: targets.zw1000 * 1.003 * 1.006,
          bpend1000: targets.zw1000 * 1.003,
          grade1000: targets.zw1000,
          sap1000: targets.zw1000,
          //zw1500
          spl1500: targets.zw1500 * 1.008 * 1.007,
          pottingflip1500: targets.zw1500 * 1.008,
          centrifugeend1500: targets.zw1500 * 1.008,
          bpend1500: targets.zw1500,
          grade1500: targets.zw1500,
          sap1500: targets.zw1500,
					//zw700B
					grade700B: targets.zw700B,
					sap700B: targets.zw700B
        };
        vm.data[i].target = targetobj;
      }
      console.log(vm.data);
    }
    function loadsap() {
      DashboardService.getsap().then(function (response) {
        vm.prodline = "Total";
        var d = response.data;
        vm.sapdata = response.data;
        createWeekChart(d);
        setTargets();
        for (var j = 0; j < d.data.length; j++) {
          var t = $filter('date')(new Date(d.data[j].NAP).getTime(), 'yyyy-MM-dd');
          for (var i = 0; i < vm.data.length; i++) {
            if (t == vm.data[i].date) {
              vm.data[i].sap0500 = d.data[j].ZW0500Actual;
              vm.data[i].sap1000 = d.data[j].ZW1000Actual;
              vm.data[i].sap1500 = d.data[j].ZW1500Actual;
              vm.data[i].sapZB = d.data[j].ZW500SActual;
              vm.data[i].sapZL = d.data[j].ZLActual;
							vm.data[i].sap700B = d.data[j].ZW700BActual;
            }
          }
        }
      });
      DashboardService.getCassette().then(function (response) {
        var d = response.data;
        for (var j = 0; j < d.length; j++) {
          for (var i = 0; i < vm.data.length; i++) {
            if (vm.data[i].date == d[j].day) {
              vm.data[i].casette = d[j].actual / d[j].plan * 100;
            }
          }
        }
      });
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      DashboardService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }
    function load1000Partnumbers() {
      vm.partnumberszw1000 = [];
      DashboardService.get1000partnumber().then(function (response) {
        vm.partnumberszw1000 = response.data;
      });
    }

    function loadcomments() {
      vm.comments = [];
      DashboardService.getAll().then(function (response) {
        vm.comments = response.data;
        console.log(vm.comments);
      });
    }

    function loadrewinder() {
      angular.forEach(vm.datefile, function (v, k) {
        DashboardService.getrewinderfile(v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            for (var k = 0; k < vm.data.length; k++) {
              var dt=$filter('date')(new Date(vm.data[k].date).getTime(),'yyyyMMdd');
              if (v == dt) {
                vm.data[k].rewinder += response.data[j].ProducedLength / 8900;
              }
            }
          }
        });
      });
    }

    function loadspinline() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getspinline(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].item1) {
              if ((response.data[j].machine == "SpinLine #136" || response.data[j].machine == "SpinLine #236")) {
                vm.data[i].spl36 += response.data[j].textbox2;
              }
              else {
                vm.data[i].spl2345 += response.data[j].textbox2;
              }
            }
          }
        }
      });
    }

    function loadsm() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getsm(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
							if(response.data[j].type == "3149069"){
								response.data[j].SheetNum = 16;
							}
              response.data[j].aeq = ((response.data[j].Totalsheets - response.data[j].ScrapSheets) / response.data[j].SheetNum) * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].Day && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].sm += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && (response.data[j].type == "3149069" || response.data[j].type == "3160038")) {
              vm.data[i].zbsm += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].type == "3148766") {
              vm.data[i].zlsm += response.data[j].aeq;
            }
            if (i == vm.data.length-1 && j == response.data.length-1){
              lodpotting();
            }
          }
        }
      });
    }

    function lodpotting() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getpotting(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = response.data[j].Out * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].potting = vm.data[i].potting + response.data[j].aeq;
            }
            else if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && (response.data[j].type == "3149069" || response.data[j].type == "3160038" || response.data[j].type == "3148766")) {
              vm.data[i].zbpotting += response.data[j].aeq * 4;
            }
            else if (response.data[j].MachineName != "Potting" && vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type == "3148766") {
              vm.data[i].zlpotting += response.data[j].aeq;
            }
            if (i == vm.data.length-1 && j == response.data.length-1){
              loadrework();
            }
          }
        }
      });
    }

    function loadclorination() {
      DashboardService.getclorination(vm.startdatenum, vm.enddatenum).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].CL_End = $filter('date')(new Date(response.data[j].CL_End), 'yyyy-MM-dd');
          response.data[j].type = response.data[j].JobID.substring(2, 9);
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = 1 * vm.partnumbers[i].aeq;
            }
          }
        }
      });
    }

    function loadrework() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getrework(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].BaaNCode) {
              response.data[j].aeq = 1 * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].shiftday = $filter('date')(new Date(response.data[j].shiftstart).getTime(), 'yyyy-MM-dd');
            if (vm.data[i].date == response.data[j].shiftday) {
              if (response.data[j].state == "BP") {
                if (response.data[j].BaaNCode != "3149069" && response.data[j].BaaNCode != "3160038" && response.data[j].BaaNCode != "3148766") {
                  vm.data[i].bp += response.data[j].aeq;
                }
                else if ((response.data[j].BaaNCode == "3149069" || response.data[j].BaaNCode == "3160038")) {
                  vm.data[i].zbbp += response.data[j].aeq;
                }
                else if (response.data[j].BaaNCode == "3148766") {
                  vm.data[i].zlbp += response.data[j].aeq;
                }
              }
              if (response.data[j].state == "Rework") {
                if (response.data[j].BaaNCode != "3149069" && response.data[j].BaaNCode != "3160038" && response.data[j].BaaNCode != "3148766") {
                  vm.data[i].rework += response.data[j].aeq;
                }
                else if ((response.data[j].BaaNCode == "3149069" || response.data[j].BaaNCode == "3160038" || response.data[j].BaaNCode == "3148766")) {
                  vm.data[i].zbrework += response.data[j].aeq;
                }
                else if (response.data[j].BaaNCode == "3148766") {
                  vm.data[i].zlrework += response.data[j].aeq;
                }
              }
            }
            if (i == vm.data.length-1 && j == response.data.length-1){
              loadmtf();
            }
          }
        }
      });
    }

    function loadmtf() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.getmtf(vm.startdatenum, edate).then(function (response) {
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.partnumbers[i].id == response.data[j].type) {
              response.data[j].aeq = response.data[j].GRADED * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type != "3149069" && response.data[j].type != "3160038" && response.data[j].type != "3148766") {
              vm.data[i].graded += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && (response.data[j].type == "3149069" || response.data[j].type == "3160038" || response.data[j].type == "3148766")) {
              vm.data[i].zbgraded += response.data[j].aeq;
            }
            else if (vm.data[i].date == response.data[j].Day && response.data[j].aeq && response.data[j].type == "3148766") {
              vm.data[i].zlgraded += response.data[j].aeq;
            }
            if (i == vm.data.length-1 && j == response.data.length-1){
              load1000potting();
            }
          }
        }
      });
    }

    function load1000potting() {
      var sdate = $filter('date')(new Date(vm.startdatenum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.get1000potting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumberszw1000.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumberszw1000[i].modul)) {
              response.data[j].aeq = vm.partnumberszw1000[i].aeq;
            }
          }
          var takeoutnum = new Date(response.data[j].Brick_Takeout).getHours() * 60 + new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugestopnum = new Date(response.data[j].Centrifuga_Stop).getHours() * 60 + new Date(response.data[j].Centrifuga_Stop).getMinutes();
          //var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (takeoutnum < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugestopnum < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          /* if (gradenum < 350) {
             response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
           }
           else {
             response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
           }*/

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].Brick_Takeout_Day) {
              vm.data[k].pottingstatic1000 += response.data[j].aeq
            }

            if (vm.data[k].date == response.data[j].Centrifuga_Stop_Day) {
              vm.data[k].centrifugeend1000 += response.data[j].aeq
            }

            /*if (vm.data[k].date == response.data[j].Grade_Day) {
              vm.data[k].grade1000 += response.data[j].aeq
            }*/
            if (k == vm.data.length-1 && j == response.data.length-1){
              load1000etf();
            }
          }
        }
      });
    }

    function load1000etf() {
      var sdate = $filter('date')(new Date(vm.startdatenum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      DashboardService.get1000etf(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumberszw1000.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumberszw1000[i].modul)) {
              response.data[j].aeq = vm.partnumberszw1000[i].aeq;
            }
          }
          var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (gradenum < 350) {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
          }

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].BP_end_shiftday) {
              vm.data[k].bpend1000 += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Grade_Day && response.data[j].Grade != "Scrap" && response.data[j].Grade != "") {
              vm.data[k].grade1000 += response.data[j].aeq
            }
            if (k == vm.data.length-1 && j == response.data.length-1){
              load1500etf();
            }
          }
        }
      });
    }

    function load1500etf() {
      var edate = $filter('date')(new Date(vm.enddatenum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      DashboardService.get1500etf(vm.startdatenum, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          var number = 0;
          if (response.data[j].startdate != "") {
            number = new Date(response.data[j].startdate).getHours() * 60 + new Date(response.data[j].startdate).getMinutes();
            if (number < 350) {
              response.data[j].day = $filter('date')(new Date(response.data[j].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].day = $filter('date')(new Date(response.data[j].startdate).getTime(), 'yyyy-MM-dd');
            }
          }
          response.data[j].Amount = 1;
          response.data[j].AEQ = 1.2;

          for (var i = 0; i < vm.data.length; i++) {
            if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Potting flip") {
              vm.data[i].pottingflip1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Centrifuge end") {
              vm.data[i].centrifugeend1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "BP end") {
              vm.data[i].bpend1500 += response.data[j].AEQ;
            }
            else if (vm.data[i].date == response.data[j].day && response.data[j].PhaseName == "Grade") {
              vm.data[i].grade1500 += response.data[j].AEQ;
            }
            if (i == vm.data.length-1 && j == response.data.length-1){
              loadbundle();
            }
          }
        }
      });
    }

    function loadbundle() {
      angular.forEach(vm.datefile, function (v, k) {
        DashboardService.getbundlefile(v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            var num = new Date(response.data[j].SPL_end).getHours() * 60 + new Date(response.data[j].SPL_end).getMinutes();
            if (num < 350) {
              response.data[j].SPL_end = $filter('date')(new Date(response.data[j].SPL_end).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].SPL_end = $filter('date')(new Date(response.data[j].SPL_end).getTime(), 'yyyy-MM-dd');
            }
            if (response.data[j].bundle.includes("3132313")) {
              response.data[j].Amount = 1;
              response.data[j].AEQ = 1.2;
            }
            else {
              for (var k = 0; k < vm.partnumberszw1000.length; k++) {
                if (response.data[j].bundle.includes(vm.partnumberszw1000[k].bundle)) {
                  response.data[j].Amount = 1;
                  response.data[j].AEQ = vm.partnumberszw1000[k].aeq / 2;
                }
              }
            }
            for (var i = 0; i < vm.data.length; i++) {
              if (vm.data[i].date == response.data[j].SPL_end && response.data[j].bundle.includes("3132313")) {
                vm.data[i].spl1500 += response.data[j].AEQ;
              }
              else if (vm.data[i].date == response.data[j].SPL_end && !response.data[j].bundle.includes("3132313")) {
                vm.data[i].spl1000 += response.data[j].AEQ;
              }
              if (i == vm.data.length-1 && j == response.data.length-1){
               vm.loading = false;
              }
            }
          }
        });
      });
    }

    //dialógus ablak kezdete

    function DialogController($scope, $mdDialog) {
      $scope.id=new Date().getTime();
      $scope.date=vm.item.date;
      $scope.machine=vm.actmachine;
      var item = vm.item;
      var field = vm.field;
      $scope.date = item.date;
      $scope.machine = field;
      $scope.actual = item[field];
      $scope.target = item.target[field];

      $scope.description="";

      /*console.log(vm.item);
      console.log($scope.date);
      console.log($scope.machine);*/


      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(fhid,fhdate,fhmachine,fhdescription,fhtarget,fhactual) {
        var data={
          id:fhid,
          date:fhdate,
          machine:fhmachine,
          description:fhdescription,
          target:fhtarget,
          actual:fhactual
        }
        DashboardService.post(data).then(function (resp) {
          data={};
        });
        $mdDialog.hide(fhid,fhdate,fhmachine,fhdescription,fhtarget,fhactual);
      };
    }

    //dialógus ablak vége
    vm.saveData = saveData;
    function saveData(item, field){
      console.log(item[field] + " - " + item.target[field]);
      vm.item = item;
      vm.field = field;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: './app/components/dashboard/dialog.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
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
      loadcomments();
      loadPartnumbers();
      load1000Partnumbers();
      createdataarray();
    }
  }
})();
