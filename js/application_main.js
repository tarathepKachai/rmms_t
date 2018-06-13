//-------------------------
// Angular Module Setting
//-------------------------
var app = angular.module('Application', [
    'ngRoute',
    "ngTouch",
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.pagination',
    'ui.grid.selection',
    'ngSanitize',
    'angular-bind-html-compile',
    'mobile-angular-ui'
]);
//-------------------------
// ROUTE SETTING
//-------------------------
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/',            { templateUrl: "page/home.html?v=001" });
    $routeProvider.when('/module_01',            { templateUrl: "page/module_01.html" });
    $routeProvider.when('/module_02',            { templateUrl: "page/module_02.html" });
    $routeProvider.when('/module_03',            { templateUrl: "page/module_03.html" });
    $routeProvider.when('/module_04',            { templateUrl: "page/module_04.html" });
    $routeProvider.when('/module_05',            { templateUrl: "page/module_05.html" });
    $routeProvider.when('/module_06',            { templateUrl: "page/module_06.html" });
    $routeProvider.when('/module_07',            { templateUrl: "page/module_07.html" });
    $routeProvider.when('/module_08',            { templateUrl: "page/module_08.html" });
    $routeProvider.when('/module_09',            { templateUrl: "page/module_09.html" });
    $routeProvider.when('/module_10',            { templateUrl: "page/module_10.html" });
    $routeProvider.when('/module_11',            { templateUrl: "page/module_11.html" });
    $routeProvider.when('/module_12',            { templateUrl: "page/module_12.html" });
    $routeProvider.when('/module_13',            { templateUrl: "page/module_13.html" });
    $routeProvider.when('/module_14',            { templateUrl: "page/module_14.html" });
    $routeProvider.when('/module_15',            { templateUrl: "page/module_15.html" });
    $routeProvider.when('/module_16',            { templateUrl: "page/module_16.html" });
    $routeProvider.when('/module_17',            { templateUrl: "page/module_17.html" });
    $routeProvider.when('/module_18',            { templateUrl: "page/module_18.html" });
    $routeProvider.when('/module_19',            { templateUrl: "page/module_19.html" });
    $routeProvider.when('/module_20',            { templateUrl: "page/module_20.html" });
    $routeProvider.when('/module_21',            { templateUrl: "page/module_21.html" });
    $routeProvider.when('/module_22',            { templateUrl: "page/module_22.html" });
    $routeProvider.when('/module_23',            { templateUrl: "page/module_23.html" });
    // system
    $routeProvider.when('/error',       { templateUrl: "page/error.html"});
    // $routeProvider.when('/logout',      { controller: "page/home.html" });
    // else [hash not found]
    $routeProvider.otherwise({ redirectTo : function(r){ return "/error"; }});
});
//-------------------------
// Reset headers to avoid OPTIONS request (aka preflight)
//-------------------------
app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post   = {};
  $httpProvider.defaults.headers.put    = {};
  $httpProvider.defaults.headers.patch  = {};
}]);
//-------------------------
// service for check access token 
//-------------------------
app.factory('xService', function($http) {
    var empCode = "";
    return {        
        getEmpCode : function(){ return empCode; },
        // setEmpCode : function(s){ this._empCode = s; },
        checker : function(x) {
            if(x == "" || x == null ){
                window.location = window.location.origin+_BASEURL;
            }
            else{
                var _url = _SERVER+'?mode=checker_key&x={0}&c='+Math.random();
                    _url = _url.replace("{0}",x);
                $http.get(_url).then(function(res) {
                    // logs(res.data.status);
                    if(res.data.status == false){
                        // logs("50");
                        // window.location = window.location.origin+_BASEURL;
                    }else{
                        empCode = res.data.empcode;
                    }
                });
            }
        }
    }
});
//-------------------------
// Controller
//-------------------------
app.controller('AppController', function($scope,$rootScope){
    $scope._layout_menu = true;
    $scope.init = function(){
        _PUBLIC_KEY = document.getElementById("public_key").value;
    }
});

//-------------------------
// Controller
//-------------------------
app.controller('SidebarCtrl', function($scope,$rootScope,$http,$window){
    $scope.logout = function(){
        var x = getParameterByName("x");
        var _url = _SERVER+'?mode=logout';
            _url+="&x="+x;
            _url+="&c="+Math.random();
        $http.get(_url).then(function(res) {
            window.location = window.location.origin+_BASEURL;
        });
    }
    $scope._toggle = [[false,false,false,false]];
    $scope.logs = function(d){
        logs(d);
    }
    $scope.toggleLevel = function(level,item){
        $scope._toggle = [[false,false,false,false]];
        $scope._toggle[level][item] != $scope._toggle[level][item];
        logs( $scope._toggle[level][item]);
    }
    $scope.menu_parse = function(){
        var _d = JSON.parse($window.localStorage.getItem('menu'));
        $scope._menu = [];
        $scope._list = [];
        for (var i = 1; i < _d.length; i++) {
            // $scope._menu[i] = false;
            if($scope._list[_d[i].mnu_grp] == undefined){
                $scope._list[_d[i].mnu_grp] = { value : _d[i].item_id , label : _d[i].mnu_grp_name , child : [] };
            }
            if($scope._list[_d[i].mnu_grp].child[_d[i].item_id] == undefined){
                //
                // $scope._menu[_d[i].item_id] = false;
                $scope._list[_d[i].mnu_grp].child[_d[i].item_id] = {
                    value : _d[i].item_id , label : _d[i].item_label , child : []
                };
            }
            $scope._list[_d[i].mnu_grp].child[_d[i].item_id].child.push({
                value : _d[i].sub_item_id , label : _d[i].sub_item_label
            });
        }
        logs($scope._list);
    }
    $scope._genUrl = function(m){
        m = parseInt(m);
        var _mod = "module_";
        if(m<=9)    _mod=_mod+"0";
        _mod=_mod+m;
        var url ="main.html?x={0}#/{1}";
            url = url.replace("{0}", getParameterByName("x")).replace("{1}",_mod)
        return url;
    }
    $scope.gotoPage = function(m){
        window.location.href = $scope._genUrl(m);
    }
    //---------------------
    $scope.init = function(){
        $scope.menu_parse();

    }
});
//-------------------------
// Controller
//-------------------------
app.controller('ErrorCtrl', function($scope,$rootScope){
    //---------------------
    $scope.init = function(){}
});
//-------------------------
// Controller
//-------------------------
app.controller('HomeCtrl', function($scope,$rootScope,$window,xService){
    $scope._height = 0;
    $scope._list = [];
    $scope.menu_parse = function(){
        var _d = JSON.parse($window.localStorage.getItem('menu'));
        // logs(_d);
        $scope._list = [];
        for (var i = 1; i < _d.length; i++) {
            if($scope._list[_d[i].mnu_grp] == undefined){
                $scope._list[_d[i].mnu_grp] = { label : _d[i].mnu_grp_name , child : [] };
            }
            if($scope._list[_d[i].mnu_grp].child[_d[i].item_id] == undefined){
                $scope._list[_d[i].mnu_grp].child[_d[i].item_id] = {
                    value : _d[i].item_id , label : _d[i].item_label , child : []
                };
            }
            $scope._list[_d[i].mnu_grp].child[_d[i].item_id].child.push({
                value : _d[i].sub_item_id , label : _d[i].sub_item_label
            });
        }
        // logs($scope._list);
    }
    $scope._menu = function(){
        $scope.menu_parse();
    }
    //---------------------
    $scope.init = function(){
        $scope._height = ($window.innerHeight);
        xService.checker(getParameterByName("x"));
        // logs(getParameterByName("x"));
        $scope._menu();
    }
});
//-------------------------
// Controller
//-------------------------
app.controller('CtrlM01', function($scope,$rootScope,$window,xService,$location){
    $scope.init = function(){
        // $scope._height = ($window.innerHeight);
        // xService.checker(getParameterByName("x"));
        logs($location.url());
        // logs($location.search());
    }
});