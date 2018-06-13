//-------------------------
// Controller
//-------------------------
app.controller('CtrlM13', function($scope,$rootScope,$http,$window,$timeout,$sce,$filter,xService){
    $scope._mode="dev_ref_upd";
    $scope._table="supplier";
    $scope._height = 0;
    $scope.arg = {};
    $scope._showPopUp = [false,false];
    $scope._user = "";
    //---------------------
    $scope.gridRefresh = true;
    $scope.gridColumns = [];
    $scope.gridData    = [];
    $scope.gridOption  = {
        enableColumnResizing: true, 
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        enableSorting: true, 
        enableFiltering: true,
        columnDefs: $scope.gridColumns, data : $scope.gridData
    };
    $scope.grid_render = function(){
        $scope.gridColumns.push({ field: 'cmd'         ,width: 80 
            , headerCellTemplate : '<div class="txt_center">เลือก</div>'
            , cellTemplate : '<div class="ui-grid-cell-contents ico_cur" bind-html-compile="COL_FIELD"></div>'
        });
//        $scope.gridColumns.push({ field: 'id'       ,width: 80 ,name:'ID',cellClass: 'txt_right'});
        $scope.gridColumns.push({ field: 'id_key'   ,width: 80 ,name:'ID Key', enableFiltering: false});
        $scope.gridColumns.push({ field: 'code_ref' ,width: 80 ,name:'รหัสจัดซื้อ', enableFiltering: false});
        $scope.gridColumns.push({ field: 'supply'   ,width: 180 ,name:'ชื่อบริษัท'});
        $scope.gridColumns.push({ field: 'tel'      ,width: 100 ,name:'เบอร์โทร', enableFiltering: false});
        $scope.gridColumns.push({ field: 'cont_name',width: 100 ,name:'ผู้ติดต่อ', enableFiltering: false});
        $scope.gridColumns.push({ field: 'address'  ,width: 100 ,name:'ที่อยู่', enableFiltering: false});
        $scope.gridColumns.push({ field: 'user_create' ,width: 100 ,name:'Create By', enableFiltering: false});
        $scope.gridColumns.push({ field: 'date_create' ,width: 100 ,name:'Create Date', enableFiltering: false});
        $scope.gridColumns.push({ field: 'time_create' ,width: 100,name:'Time Create', enableFiltering: false});
    }
    $scope.grid_feed = function(){
        $scope.FormClean();
        var x = getParameterByName("x");
        var _url = _SERVER+'?mode='+$scope._mode;
        var _arg={
            "ref":"dev_list",
            "table":$scope._table
            };
          _url+="&x="+x;
          _url+="&c="+Math.random();
        $http({
               method: 'POST',
               url:  _url,
               data: _arg 
             }).then(function(res) {
            var _d = res.data;
            // re-render
            _d.forEach(function(e){
                var temp = "<a ng-click='grid.appScope.feed_item({0});' class=''>Edit</a>";
                e.cmd = $sce.trustAsHtml( replaceAll(temp,"{0}",e.id) );
            });
            
            $scope.gridOption.data = _d;
        });
    }    
    $scope.grid_reLoad = function(){
        $scope.gridRefresh = true;
        $timeout(function() { $scope.gridRefresh = false; }, 0);
        $scope.gridData = [];
        $scope.gridOption.data = [];
    };
    //---------------------
    $scope.FormClean = function(){
        $scope.arg = {
            id   : '',
            id_key : '',
            code_ref: '',
            supply : '',
            address: '',
            tel : '',
            cont_name:''
        };
    }
    $scope.closePopUp = function(i){
        $scope._showPopUp[i]=false;
    }
    $scope.showPopUp = function(i,pMsg){
        $scope.PopUpTitle = pMsg;
        if (i==1){
          $scope.PopUpMsg ="รหัสรายการที่ต้องการยกเลิก " + $scope.arg.id;
        }
        $scope.PopUpMsg = $sce.trustAsHtml($scope.PopUpMsg);
        $scope._showPopUp[i]=true;
    }
    $scope.check = function(){
        var isError = false;
        if($scope.arg.supply  == ""){
            $scope.PopUpMsg = "กรุณาระบุ <b class='TXT_ALIZARIN'>F</b> ที่ทำการบันทึก";
            isError = true;
        }
        if($scope.arg.address  == ""){
            $scope.PopUpMsg = "กรุณาระบุ <b class='TXT_ALIZARIN'>R</b> ที่ทำการบันทึก";
            isError = true;
        }
        if($scope.arg.tel  == ""){
            $scope.PopUpMsg = "กรุณาระบุ <b class='TXT_ALIZARIN'>M</b> ที่ทำการบันทึก";
            isError = true;
        }
        if($scope.arg.cont_name == ""){
            $scope.PopUpMsg = "กรุณาระบุ <b class='TXT_ALIZARIN'>PMs/Yr</b> ที่ทำการบันทึก";
            isError = true;
        }
        if($scope.arg.code_ref == ""){
            $scope.PopUpMsg = "กรุณาระบุ <b class='TXT_ALIZARIN'>PMs/Yr</b> ที่ทำการบันทึก";
            isError = true;
        }
        return isError;
    }
    $scope.saveData = function(){
        $scope.closePopUp(1);
        if($scope.check()){
           $scope.showPopUp(0,'Error');
           return;
        }
        else{
             var x = getParameterByName("x");
             var _url = _SERVER+'?mode='+$scope._mode;
            _url+="&x="+x;
            _url+="&c="+Math.random();
            $http({
                method: 'POST',
                url:  _url,
                data: { ref:'dev_save',arg : $scope.arg ,user : $scope._user,table:$scope._table }
            }).then(function successCallback(res){
                $scope.FormClean();
                $scope.grid_feed();
            }, function errorCallback(res) {
                logs(res.data);
            });
        }
    }
     $scope.delData = function(){
        $scope.closePopUp(1);
        if($scope.arg.id == ""){
           $scope.PopUpMsg = "กรุณาเลือก <b class='TXT_ALIZARIN'>รายการที่ต้องการยกเลิกก่อน</b>";
           $scope.showPopUp(0,'Error');
           return;
        }
        else{
             var x = getParameterByName("x");
             var _url = _SERVER+'?mode='+$scope._mode;
            _url+="&x="+x;
            _url+="&c="+Math.random();
            $http({
                method: 'POST',
                url:  _url,
                data: { ref:'dev_del',arg : $scope.arg ,user : $scope._user,table:$scope._table }
            }).then(function successCallback(res){
                $scope.FormClean();
                $scope.grid_feed();
            }, function errorCallback(res) {
                logs(res.data);
            });
        }
    }

    $scope.feed_item = function(i){
        var x = getParameterByName("x");
        var _url = _SERVER+'?mode='+$scope._mode;
            _url+="&x="+x;
            _url+="&c="+Math.random();
        $http({
            method: 'POST',
            url:  _url,
            data: { ref:'dev_show',arg : { item : i },table:$scope._table }
        }).then(function successCallback(res){
            // reset
            $scope.FormClean();
            // put data
            $scope.arg = res.data[0];
            // show form
        }, function errorCallback(res){
        });
    }
    //---------------------
    $scope.init = function(){
        $scope._height = ($window.innerHeight);
        //$scope.FormClean();
        $scope.grid_render();
        $scope.grid_reLoad();
        $scope.grid_feed();
        xService.checker(getParameterByName("x"));
        var _d = JSON.parse($window.localStorage.getItem('menu'));
        $scope._user = _d[0].sub_item_id;
    }
});
