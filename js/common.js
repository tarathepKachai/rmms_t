var _APP_VER= "20180506";
//var _SERVER = "http://127.0.0.1:8080/rmms/server/service.php";
var _SERVER = "http://172.17.8.144/rmms/server/service.php";
var _BASEURL = "/rmms/";
/*------------------------*/
/*------------------------*/
var objLabel2arr = function(obj){
    var arr = [];
    for (var i = 0; i < obj.length; i++) {
        arr[obj[i].value] = obj[i].label;
    }
    return arr;
}
/*------------------------*/
var logs = function(msg){ console.log(msg); }
var objSize = function(o){
    var i=0;
    for(c in o)
        if (o.hasOwnProperty(c)) i++;
    return i;
}
function isset(str) {
    return window[str] !== undefined;
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var genDate = function(numDays) {
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateFormat(dateObj);
}
var dateFormat = function(day){
    var dd  = day.getDate();
    var mm  = day.getMonth()+1; //January is 0!
    var yyyy= day.getFullYear();
    if(dd<10)   dd='0'+dd;
    if(mm<10)   mm='0'+mm;
    return yyyy+'-'+mm+'-'+dd;
}
var dateFormatNum = function(day){
    var dd  = day.getDate();
    var mm  = day.getMonth()+1; //January is 0!
    var yyyy= day.getFullYear();
    if(dd<10)   dd='0'+dd;
    if(mm<10)   mm='0'+mm;
    return yyyy+''+mm+''+dd;
}
var get_List_Year_From = function(min){
    var arr = [];
    var n = new Date;
    var _max = 1900 + n.getYear();
    if(n.getMonth() >= 9) _max=_max+1;
    for(var y = _max; y > min  ; y--){
        arr.push(y);
    }
    return arr;
}
//  Prototype number format
//  Decimal and Point
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
// 
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var classOddEve = function(n){
    if((n%2) == 0) return "BG_CLOUDS";
    return "";
}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    //---------------------
    // if(hours == "00") return minutes+':'+seconds;
    return hours+':'+minutes+':'+seconds;
}


//---------------------
var DOM = function(dom){
    return document.getElementById(dom);
}
var genPeriod = function(){
    var arr = [];
    var min = 2018;
    // var _temp = { value : }
    var _n = new Date();
    var tmp = "{1}-{0}";
    var _t  = "";
        arr.push({ value : "" , label : "ไม่ระบุ" });
    for(;_n.getFullYear() == min;){
        _t = tmp.replace("{1}",_n.getFullYear());
        if(_n.getMonth() >= 9){
            _t =  _t.replace("{0}",_n.getMonth()+1);
        }else{
            _t =  _t.replace("{0}","0"+(_n.getMonth()+1));
        }
        arr.push({ value : _t , label : _t });
        _n = new Date(_n.getFullYear(),_n.getMonth(),0);
    }
    return arr;
}
var dateStr2Obj = function(str){
    str = str.split("-");
    var d = new Date(parseInt(str[0]),parseInt(str[1])-1,parseInt(str[2]),0,0,0,0);
    return d;
}
var date_formatter = function(el, _date){
    var d = _date.getDate();     if(d<10)   d = "0"+d;
    var m = _date.getMonth()+1;  if(m<10)   m = "0"+m;
    el.value = _date.getFullYear()+"-"+m+"-"+d;
}
var date_option = function(){
    return {
        startDay: 0,
        formatter: date_formatter ,
        minDate: new Date(2018, 0, 1),
        dateSelected: new Date(),
        disableMobile: true   
    }
};