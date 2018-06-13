<?php
error_reporting(E_ALL);
ini_set('display_errors','On');
date_default_timezone_set('Asia/Bangkok');
require_once("lib/common.php");
require_once("lib/idiorm.php");
//--------------------------
// set header cross domain allow
//--------------------------
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json; charset=utf-8');

//--------------------------
// connection server
//--------------------------
 ORM::configure('mysql:host=172.17.8.147;dbname=dbrmms');
//ORM::configure('mysql:host=127.0.0.1;dbname=dbrmms');
ORM::configure('username', 'userrmms');
ORM::configure('password', '@rmms2018');
//--------------------------
ORM::configure('driver_options', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
//--------------------------

$_URL 	= new URL;
$_encry = new MyEncryption;
$_ip = $_SERVER['REMOTE_ADDR'];
$mode   = $_URL->get("mode");
// create output bin
$data   = array();
switch ($mode) {
  case 'auth':
    $_d = $_URL->input();
    $_arg = json_decode($_encry->decrypt($_d->arg));
    if (AddEmployee($_arg->user,$_arg->pass)=="Y") {
      $sql = "call PROC_AUTH('{0}','{1}','{ip}');";
      $sql = str_replace('{0}', $_arg->user , $sql);
      $sql = str_replace('{1}', MD5($_arg->pass) , $sql);
      $sql = str_replace('{ip}', $_ip , $sql);
      $data = ORM::for_table('dummy')->raw_query($sql)->find_array();
    }else{
      $data = array("mnu_grp" => "0" , "mnu_grp_name" => "Not Found User","item_id"=>"0","item_id"=>"","item_name"=>"","sub_item_id"=>"","sub_item_label"=>"","log_key"=>"0","UserTec"=>"0" ); 
    }  
    break;
  case 'dev_ref_upd':
    $_d = $_URL->input();
    $type=$_d->ref;
    $_table="dev_".$_d->table;
    switch ($_table) {
      case 'dev_group':
        $_Len=2;
        break;
      case 'dev_ecri_risk':
        $_Len=4;
        break;
      case 'dev_umsdn':
        $_Len=4;
        break;
      case 'dev_life_exp':
        $_Len=4;
        break;
      default:
        # code...
        break;
    }

    switch ($type) {
      case "dev_list":
        $sql="select * from ".$_table." where ctrl=0";
        $data = ORM::for_table('dummy')->raw_query($sql)->find_array();
        break;
      case "dev_show":
        $id = ( ( $_d->arg->item ) ? $_d->arg->item : 0 );
        $sql="select * from ".$_table." where id=".$id;
        $data = ORM::for_table('dummy')->raw_query($sql)->find_array();
        break;
      case "dev_save":  
        if ($_d->arg->id=="") { //new
           $_tmp = ORM::for_table($_table)->create(); 
           $_tmp->set((array) $_d->arg);
           $_tmp->user_create = $_d->user;
           $_tmp->ctrl = '0';
           $_tmp->set_expr('date_create','curdate()');
           $_tmp->set_expr('time_create','curtime()');
           $_tmp->save();
           //Update Id_Key
           Upd_Id_key($_table,$_Len);
        }else{
           $_tmp = ORM::for_table($_table)->find_one($_d->arg->id);
           $_tmp->set((array) $_d->arg);
           $_tmp->user_update = $_d->user;
           $_tmp->set_expr('date_update','curdate()');
           $_tmp->set_expr('time_update','curtime()');
           $_tmp->save();
        }
        $data['status'] = true;
        break;
      case "dev_del":  
        if ($_d->arg->id!="") { //new
           $_tmp = ORM::for_table($_table)->find_one($_d->arg->id);
           $_tmp->user_update = $_d->user;
           $_tmp->set_expr('date_update','curdate()');
           $_tmp->set_expr('time_update','curtime()');
           $_tmp->ctrl = '9';
           $_tmp->save();
        }
        $data['status'] = true;
        break;
    }  
    break;

	case 'isVersion':
		$data['status'] = true;
		$data['msg'] = array("version" => "1.00.00" , "path" => "" );
		break;
  case 'checker_key':
    $_x = $_URL->get("x");
    $_d = ORM::for_table('log_access')->where("log_x",$_x)->where("log_live",1)->find_array();
    if(sizeof($_d) != 1){
        $data['status'] = false;
        $data['empcode'] = 0;
    }else{
        $data['status'] = true;
        $data['empcode'] = $_d[0]['log_empcode'];
    }
    break;
  case 'logout':
    $_x = $_URL->get("x");
    $_d = ORM::for_table('log_access')->where("log_x",$_x)->find_many();
    foreach($_d as $_row){
      $_row->set("log_live",9)->save();
    }
    $data['status'] = true;
    $data['msg'] = "Eject";
    break;
	default:
		$data['status'] = false;
		$data['msg'] = "Error unknown command";
		break;
}
echo json_encode($data,JSON_UNESCAPED_UNICODE);
?>
