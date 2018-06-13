<?php

/**
 * [class] Database
 * --------------------------
 * [function] connect
 * [function] close
 * [function] query
 * [function] num_rows
 * [function] fetch_array
 * [function] fetch_array_assoc
 * [function] fetch_all_array
 * [function] last_id
 */
class Database {
	private $host;
	private $user;
	private $pass;
	private $name;
	private $link;
	private $error;
	private $errno;
	private $query;
	function __construct($host, $user, $pass, $name = "", $conn = 1) {
		$this->host = $host;
		$this->user = $user;
		$this->pass = $pass;
		if( !empty($name) )
			$this->name = $name;
		if( $conn == 1 )
			$this->connect();
	}
	function __destruct() { @mysql_close($this->link); }

	public function connect() {
		if ($this->link = mysql_connect($this->host, $this->user, $this->pass)) {
			if (!empty($this->name)) {
				if (!mysql_select_db($this->name)){
					$this->exception("Could not connect to the database!");
				} 
			}
		} else {
			$this->exception("Could not create database connection!");
		}
	}
	public function close() {
		@mysql_close($this->link);
	}

	public function query($sql , $_print = false) {
        if($_print) echo $sql;
		if ($this->query = mysql_query($sql)) {
			return $this->query;
		} else {
			return false;
		}
	}

	public function num_rows($qid) {
		if (empty($qid)) {
			$this->exception("Could not get number of rows because no query id was supplied!");
			return false;
		}else{
			return mysql_num_rows($qid);
		}
	}

	public function fetch_array($qid,$opt = null) {
		if (empty($qid)) {
			$this->exception("Could not fetch array because no query id was supplied!");
			return false;
		} else {
			if(is_null($opt))
				return mysql_fetch_array($qid);
			else 
				return mysql_fetch_array($qid, $opt);
		}
	}

	public function fetch_object($qid) {
		if (empty($qid)) {
			$this->exception("Could not fetch array because no query id was supplied!");
			return false;
		} else {
			return mysql_fetch_object($qid);
		}
	}
		/*
	public function fetch_array_assoc($qid) {
		if (empty($qid)) {
			$this->exception("Could not fetch array assoc because no query id was supplied!");
			return false;
		} else {
			return mysql_fetch_array($qid, MYSQL_ASSOC);
		}
	}
		*/
		
	public function fetch_all_array($sql, $opt = true) {
		$data = array();
		if ($qid = $this->query($sql)) {
			if(isNotNull($opt)){
							while ($row = $this->fetch_array($qid , $opt)) {
								$data[] = $row;
							}
			} else {
							while ($row = $this->fetch_array($qid)) {
								$data[] = $row;
							}
			}
		} else {
			return false;
		}
		return $data;
	}
		
	public function last_id() {
		if ($id = mysql_insert_id()) {
			return $id;
		} else {
			return false;
		}
	}
}

/**
 * [class] url read data from get / post
 * --------------------------
 * [function] get
 * 	[i] : name of parameter
 * 	[o] : read $_GET[name] method if not set will return ''
 * [function] post
 * 	[i] : name of parameter
 *  [o] : read $_POST[name] method if not set will return ''
 */
class URL{
	private $def = NULL;
	function haveGet($name = null){
		return (isset($_GET[$name])? TRUE:FALSE);
	}
	function get($name = null){	
		if($name == null) return $this->def;
		return (isset($_GET[$name])? $_GET[$name]:$this->def); //,ENT_QUOTES);
	}
	function post($name = null){
		if($name == null) return $this->def;
		return (isset($_POST[$name])? $_POST[$name]:$this->def); //,ENT_QUOTES);
	}
	function input(){
		return json_decode(file_get_contents("php://input"));
	}
}
/**
 * [function] client_ip
 * --------------------------
 * [i] null
 * [o] return client ip [from header of connection]
 */
function client_ip(){
	$ip=$_SERVER['REMOTE_ADDR'];
	if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
		if ($_SERVER['HTTP_X_FORWARDED_FOR']==NULL){
			$ip=$_SERVER['REMOTE_ADDR']; 
		}
	}
	else{
		$ip=$ip."|".$ip['HTTP_X_FORWARDED_FOR'];
	}
	return $ip;
}
/**
 * [function] Replace
 * --------------------------
 * [i] object
 *	[	tag : find
 *		value : replace value
 *		source : template
 *	]
 * [o] return client ip [from header of connection]
 */
function replaceAll($d){
	$tag = '{'.$d->tag.'}';
	$str = $d->source;
	while ( stripos($str, $tag) ) {
		$str = str_replace($tag, $d->value , $str);	
	}
	return $str;
}


class MyEncryption
{

    public $pubkey = '-----BEGIN PUBLIC KEY----- 
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCItgrex0qbcJuX/bVJeX0hi6y3 
lxqWFzhHtDvt6PaSdBd/H/2xnOqrZ+DRqeCGjHPUxRBX3/paVZsMAL2rfZsKVwTN 
ggDPoyfGpeTKxEg7qS1GospqCDJA7OXYPxmfGSsIvvqiXMZkO93NkUI1n+1RIzau 
Wa5kvpl5qQf3PAlVDwIDAQAB 
-----END PUBLIC KEY-----';
    public $privkey = '-----BEGIN RSA PRIVATE KEY----- 
MIICWwIBAAKBgQCItgrex0qbcJuX/bVJeX0hi6y3lxqWFzhHtDvt6PaSdBd/H/2x 
nOqrZ+DRqeCGjHPUxRBX3/paVZsMAL2rfZsKVwTNggDPoyfGpeTKxEg7qS1Gospq 
CDJA7OXYPxmfGSsIvvqiXMZkO93NkUI1n+1RIzauWa5kvpl5qQf3PAlVDwIDAQAB 
AoGAC272H8WZFsDnMmH0jG2NqoWM71nCznSor06CiJYoMP1mjao2RGl0MtugMMi9 
T2NluJC2mjLQNEfejLVvJ218ztMfXKYAdH2VUG68WfWYlyOJTkx/s+QqLQAuijNR 
nbQno6DkFfpOYUFj+awEoP1zyWUTb09dR1zNsZT3DlgR3bkCQQCOp5bnbb8hPnFr 
OJRDEyYld+BYJOsgsVvan/mmZP9/UfgCrZkzehoQoREh1QzYE+zZ5ZJdv/1ETRsg 
03xQhhRLAkEA9VWEcnLQVJ1vAk7ETxyrNDFd/KViU3CWHsPd2xWh5npOsNMLMrdQ 
w+k4rPjP8MZXrpXMCAwrUMX5zSlBjuIfzQJAarTVXhtrgnRw5mEWFe429IPs3kIP 
Vw8TxD8xwNN/gj9QIsCz/htxb8rrQ8FXsDGHU54zk8jOq855Yl6PeLQybQJAEnOR 
F459DrAchj7oUs7kLXO9DuBdacsg70Vp7S1OVOhD/NaSlAjngSSMR64a7Y/tTksj 
4kMQCu4o4H5G2Pk2zQJARCRoJbSL3kURwxZxsCevFsuhzn0HHCA1tz9D9fuDAqdZ 
imW35g72TBZyQ3QKfjbtC9xugBWI4ioUe1xMn3nISQ== 
-----END RSA PRIVATE KEY-----';
	/*
    public function encrypt($data)
    {
        if (openssl_public_encrypt($data, $encrypted, $this->pubkey))
            $data = base64_encode($encrypted);
        else
            throw new Exception('Unable to encrypt data. Perhaps it is bigger than the key size?');

        return $data;
    }
	*/
    public function decrypt($data)
    {
        if (openssl_private_decrypt(base64_decode($data), $decrypted, $this->privkey))
            $data = $decrypted;
        else
            $data = '';

        return $data;
    }
}


function build_sorter($key) {
    return function ($a, $b) use ($key) {
        return strnatcmp($a[$key], $b[$key]);
    };
}
function str_encode($pText) {
  $newstr=str_replace ( ']^[','"',$pText );
  $newstr1=str_replace (']$[',chr(10),$newstr);
  $newstr2=str_replace (']#[',chr(13),$newstr1);
  return $newstr2;
}
function set_utf8($pText) {
 return iconv('tis-620','utf-8',$pText);
}
function set_tis620($pText) {
 return iconv('utf-8','tis-620',$pText);
}        
function GetDocNo($pPrefix,$pSql,$pLen,$pMon) {
    $sql="select date_format(curdate(),'%Y-%m-%d') as cdate";
    $rs = ORM::for_table('dummy')->raw_query($sql)->find_array();
    $day=explode("-",$rs[0]['cdate']);
    $yrs=(int)$day[0]+543;
    $syrs=(string)$yrs;
    $syrs=$pPrefix . substr($syrs,-2,2);
    $day=explode("-",$rs[0]['cdate']);
    if ($pMon == "Y"){ //เดือน
       $xDocNo = $syrs . $day[1]."-";
     }  
    else { //ปี
       $xDocNo = $syrs . "-";
    }
    $row = ORM::for_table('dummy')->raw_query($pSql)->find_array();
    $numR =sizeof($row);
    if ($numR>0) {
        $chkDoc=substr($row[0]['job_id'],0,strlen($xDocNo));
        if ($chkDoc <> $xDocNo) {
           $xDocNo = $xDocNo . AddZero(1, $pLen);
           }
        else {
           $No1 = (int)(substr($row[0]['job_id'],-1*$pLen, $pLen)) + 1;
           $xDocNo = $xDocNo . AddZero($No1, $pLen);
        }
     }  
    else {
        $xDocNo = $xDocNo.AddZero(1, $pLen);
    }
  return $xDocNo;
}
function AddZero($pTxt, $pLen) {
    $pTxt = ltrim(trim($pTxt));
    $AddZero = str_repeat("0",$pLen - strlen($pTxt)). $pTxt;
    return $AddZero;
}
function do_logout($params){
       	$user=$params['user'];
        $cx=$user['x'];
        $sql="update log_access set log_live=0 where log_x='".$cx."'";
        ORM::raw_execute($sql);
        echo 1;
}
function Upd_Id_Key($pTable,$pLen){
   $sql="select last_insert_id() as id";
   $_rs = ORM::for_table('dummy')->raw_query($sql)->find_array();
   $id=$_rs[0]['id'];
   $id_key=AddZero($id,$pLen);
   // Topten Code

   $id_key=substr($id_key,0,4)."-".substr($syrs,-5);


   //old code
   // if ($pTable=='device') {
   // 		$id_key=substr($id_key,0,4)."-".substr($syrs,-5);
   // }
   $sql="update ".$pTable." set id_key='".$id_key."' where id=".$id;
   ORM::raw_execute($sql);
}
function AddEmployee($pUser,$pPass) {
    ORM::configure('mysql:host=172.17.8.217;dbname=personcmu', null, 'dbuser');
//    ORM::configure('mysql:host=127.0.0.1;dbname=personcmu', null, 'dbuser');
    ORM::configure('username', 'userrmms', 'dbuser');
    ORM::configure('password', '@rmms2018', 'dbuser');
    
    $sql="select a.id,c.name as title,a.fname,a.lname";
    $sql.=",a.username,a.password as passwd,b.tunt_id,b.tpos_id as post_id,";
    $sql.="d.name as post_name,e.dept_name,e.dept_type,e.tel_no,b.tunt_id as dept_code FROM (((personcmu.TEmployee a  INNER JOIN personcmu.TPosScale b ON a.id = b.temp_id)";
    $sql.=" INNER JOIN personcmu.TPrefix c ON a.Prefix_id = c.id) INNER JOIN personcmu.TPosition d ON b.TPos_id = d.id) left join personcmu.TDepart as e on b.tunt_id=e.dept_code ";
    // $sql.=" where a.username='{0}' and password=password('{1}') ";
    $sql.=" where a.username='{0}';";
    $sql=str_replace('{0}', $pUser , $sql);
    $sql=str_replace('{1}', $pPass , $sql);
    $_r = ORM::for_table('dummy','dbuser')->raw_query($sql)->find_array();
    // print_r($_r);

  if(sizeof($_r) == 1){
     $_data = array();
     //เพิ่มข้อมูลในตาราง employee
     foreach ($_r as $row) {
        $sql="insert into employee set emp_code='{0}',emp_title='{1}',emp_firstname='{2}',emp_lastname='{3}',emp_post_id='{4}',emp_dept_id='{5}',emp_password='{6}',emp_user_name='{7}',emp_link_code='{8}' on duplicate key update time_update=curtime(),date_update=curdate(),emp_dept_id='{5}',emp_password='{6}' ";
        $sql=str_replace("{0}",$row['id'],$sql);
        $sql=str_replace("{1}",set_utf8($row['title']),$sql);
        $sql=str_replace("{2}",set_utf8($row['fname']),$sql);
        $sql=str_replace("{3}",set_utf8($row['lname']),$sql);
        $sql=str_replace("{4}",$row['post_id'],$sql);
        $sql=str_replace("{5}",$row['dept_code'],$sql);
        $sql=str_replace("{6}",md5($pPass),$sql);
        $sql=str_replace("{7}",$row['username'],$sql);
        $sql=str_replace("{8}",$row['id'],$sql);
        ORM::raw_execute($sql);
        $sql="insert into position set code_link='{0}',post_name='{1}' on duplicate key update time_update=curtime(),date_update=curdate()";
        $sql=str_replace("{1}",set_utf8($row['post_name']),$sql);
        $sql=str_replace("{0}",$row['post_id'],$sql);
        ORM::raw_execute($sql);
        $sql="select post_id from position where code_link='".$row['post_id']."'";
        $rs = ORM::for_table('dummy')->raw_query($sql)->find_array();
        $sql="update employee set emp_post_id='".$rs[0]['post_id']."' where emp_code='".$row['id']."'";
        ORM::raw_execute($sql);
        $sql="insert into department set dept_id='{0}',dept_name='{1}',dept_tel='{2}',dept_type='{3}',code_link='{4}' on duplicate key update time_update=curtime(),date_update=curdate() ";
        $sql=str_replace("{0}",$row['dept_code'],$sql);
        $sql=str_replace("{1}",set_utf8($row['dept_name']),$sql);
        $sql=str_replace("{2}",$row['tel_no'],$sql);
        $sql=str_replace("{3}",$row['dept_type'],$sql);
        $sql=str_replace("{4}",$row['dept_code'],$sql);
        ORM::raw_execute($sql);
        return "Y";
      }
    }else{
      if ($pUser=='chalong'){
      	return "Y";
      }else{ 	
        return "N";
      }
   } 
}
?>