(function () {
    'use strict';
    angular
    .module('app')
    .directive('placeDir', placedir);

    function placedir() {
        var directive = {
            link: link,
            restrict: 'E',
            controller: ctrl,
            scope: {
                data: '=',
                nm: '='
            },
            templateUrl: 'app/components/directives/Places/place.html'
        };
        function ctrl($scope, $filter, $rootScope, PutmodulsService) {
            $scope.select = select;
            $scope.createinfo = createinfo;
            $scope.check = check;
            $scope.outinfo=outinfo;
            $scope.ok = false;
            $scope.beviheto = false;
            $scope.createobject = {};
            $scope.moduls = [
                { Label: "ZW1500-RL,600", Values: 3147303 },
                { Label: "MODULE,ZW1500,CLAMP", Values: 3157651 },
                { Label: "ZW1500 RMS adapteres", Values: 3157805 },
                { Label: "MODULE,ZW1500X,CLAMP", Values: 3157806 },
                { Label: "Module ZW 1500 X RMS", Values: 3161831 },
            ];
            $scope.tabledata = [];
            for (var i = 0; i < 16; i++) {
                var obj = {
                    id: "",
                    code: $scope.nm + 1,
                    place: i + 1,
                    item: "",
                    dose: "",
                    quality: "",
                    insso: "",
                    inname: "",
                    indate: "",
                    outsso: "",
                    outname: "",
                    description: "",
                    inshift: "",
                    outshift: ""
                }
                $scope.tabledata.push(obj);
            }

            function select() {
                for (var i = 0; i < 16; i++) {
                    for (var j = 0; j < $scope.data.length; j++) {
                        if ($scope.tabledata[i].place == $scope.data[j].place && $scope.data[j].outdate==null) {
                            $scope.tabledata[i] = $scope.data[j];
                        }
                    }
                }
                console.log($scope.tabledata);
            }

            function check(nowitem, input, qnum) {
                if (nowitem && input.length == 10 && isFinite(input)) {
                    $scope.beviheto = true;
                }
                else {
                    $scope.beviheto = false;
                }
                if ($scope.beviheto == true) {
                    var loadnumber = "99" + nowitem + input;
                    PutmodulsService.getmodul($filter('date')(new Date(), 'yyyy-MM-dd'), loadnumber).then(function (response) {
                        console.log(response.data);
                        $scope.tabledata[qnum].quality = response.data[0].Grade;
                    });
                }
            }



            function createinfo(pos, nowitem, nowdose, nowquality, descr) {
                $scope.createobject = {};
                var actnum = new Date().getHours() * 60 + new Date().getMinutes();
                var dnum = 0;
                if (actnum >= 350 && actnum < 1070) {
                    dnum = 1;
                }
                else {
                    dnum = 3;
                }
                $scope.createobject.id = new Date().getTime();
                $scope.createobject.code = $scope.nm + 1;
                $scope.createobject.place = pos + 1;
                $scope.createobject.item = nowitem;
                $scope.createobject.dose = nowdose;
                $scope.createobject.quality = nowquality;
                $scope.createobject.description = descr;
                $scope.createobject.insso = $rootScope.user.username;
                $scope.createobject.inname = $rootScope.user.displayname;
                $scope.createobject.indate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                if (actnum >= 350) {
                    $scope.createobject.inshift = $filter('shift')(dnum, $filter('date')(new Date(), 'yyyy-MM-dd'));
                }
                else {
                    $scope.createobject.inshift = $filter('shift')(dnum, $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd'));
                }
                $scope.createobject.outsso = "";
                $scope.createobject.outname = "";
                $scope.createobject.outshift = "";
                console.log($scope.createobject);
                PutmodulsService.post($scope.createobject).then(function (resp) {
                    $scope.createobject = {};
                    $scope.nowitem = "";
                    $scope.nowdose = "";
                    goodsave();
                });
            }
            function goodsave() {
                alert("Mentés sikeres!");
                location.reload();
            }

            function outinfo(ob){
                
                var actnum = new Date().getHours() * 60 + new Date().getMinutes();
                var dnum = 0;
                if (actnum >= 350 && actnum < 1070) {
                    dnum = 1;
                }
                else {
                    dnum = 3;
                }
                ob.outsso = $rootScope.user.username;
                ob.outname = $rootScope.user.displayname;
                ob.outdate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                if (actnum >= 350) {
                    ob.outshift = $filter('shift')(dnum, $filter('date')(new Date(), 'yyyy-MM-dd'));
                }
                else {
                    ob.shift = $filter('shift')(dnum, $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd'));
                }
                console.log(ob);
                PutmodulsService.put(ob).then(function (r) {
                    ob={};
                    location.reload();
                });
            }

            function goodout(){
                alert("Kiadás sikeres!");
                select();
            }
        }
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('data', function (newVal, oldVal) {
                if (newVal) {
                    scope.data = newVal;
                }
            });
        }
    }
    return placedir;
})();