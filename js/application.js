//-------------------------
// Angular Module Setting
//-------------------------
var app = angular.module('Application', [
    'ngRoute',
    "ngTouch",
    'ngSanitize',
    'angular-bind-html-compile',
    'mobile-angular-ui'
]);
//-------------------------
// ROUTE SETTING
//-------------------------
app.config(function($routeProvider, $locationProvider) {
    // $routeProvider.when('/',            { templateUrl: "page/home.html?v=001" });
    // system
    // $routeProvider.when('/error',       { templateUrl: "page/error.html"});
    // $routeProvider.when('/logout',      { controller: "page/home.html" });
    // else [hash not found]
    // $routeProvider.otherwise({ redirectTo : function(r){ return "/error"; }});
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
                        window.location = window.location.origin+_BASEURL;
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
app.controller('ErrorCtrl', function($scope,$rootScope){
    //---------------------
    $scope.init = function(){}
});
//-------------------------
// Controller
//-------------------------
app.controller('AuthCtrl', function($scope,$http,$window,$sce){
    $scope.arg = { user : "" , pass : "" };
    //---------------------
    $scope._showPop = false;
    $scope.showError = function(i){ $scope._showPop = true; }
    $scope.closeError = function(){ $scope._showPop = false; }
    //---------------------
    $scope.check = function(){
        $scope.errorTitle = "ข้อผิดพลาด";
        var isError = false;
        if($scope.arg.user == ""){
            $scope.errorMsg = "โปรดระบุ รหัสประจำตัวผู้ใช้งาน";
            isError = true;
        }
        else if($scope.arg.pass == ""){
            $scope.errorMsg = "โปรดระบุ รหัยืนยันผู้ใช้งาน";
            isError = true;
        }
        return isError;
    }
    $scope.signin = function(){
        if($scope.check()){
            $scope.showError(0);
            return;
        }else{
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(_PUBLIC_KEY);
            $http({
                method: 'POST',
                url:  _SERVER+'?mode=auth&c='+Math.random(),
                data: { arg : encrypt.encrypt(JSON.stringify($scope.arg)) }
            }).then(function successCallback(res){
                var d = res.data;
                // wrong user
                logs(d);
                if(d.log_key == "0"){
                    $scope.errorMsg = "กรุณาตรวจสอบความถูกต้องของรหัสประจำตัว กับ รหัสยืนยันตัวผู้ใช้งาน";
                    $scope.showError();
                }else{
                    var str = JSON.stringify(d);
                    $window.localStorage.setItem('menu',str);
                    var _url = window.location.origin+_BASEURL+"main.html?x="+d[0].log_key;
                    window.location  = _url;
                }
            // connection error
            }, function errorCallback(res) {
                $scope.errorMsg = "การเชื่อต่อผิดพลาด";
                $scope.showError();
            });
        }
    }
    $scope.init = function(){
        $scope._height = ($window.innerHeight);
    }
});

