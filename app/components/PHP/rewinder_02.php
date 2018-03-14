<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
//set_include_path("../../../../SSRSReport/bin/");
set_include_path("../../../../ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('../../../../ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);

define("REPORT", "/MCS/MCS_Athengerlo_Shift_Summary1");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get
$day = date("m/d/Y H:i:s", strtotime($_GET["Day"] . " 05:50:00"));

// define machies
$mch = Array("Rewinder1"=>13, "Rewinder2"=>14, "Rewinder3"=>15, "Rewinder4"=>16, "Rewinder5"=>17, "Rewinder6"=>18, "Rewinder7"=>1772, "Rewinder8"=>1773, "Rewinder9"=>1774,"Rewinder10"=>1775,"Rewinder11"=>1776,"Rewinder12"=>2695,"Rewinder13"=>2696,"Rewinder14"=>2697,"Rewinder15"=>2698,"Rewinder16"=>2699,"Rewinder17"=>4902);
$machine = $mch[$_GET["machineid"]];
//define shifts
$sh=Array("1"=>1,"2"=>2,"3"=>3);
$shift=$sh[$_GET["shiftnum"]];
//get report data
try
{
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();
    $params[0]->Name = "Day";
    $params[0]->Value = $day;
    $params[1] = new ParameterValue();
    $params[1]->Name = "machineid"; 
    $params[1]->Value = $machine;
    $params[2] = new ParameterValue();
    $params[2]->Name = "shiftnum"; 
    $params[2]->Value = $shift;
    
    $executionInfo = $ssrs_report->SetExecutionParameters2($params, "en-us");
    $csvFormat = new RenderAsCSV();
    $csvFormat->FieldDelimiter = '×';
    $csvFormat->RecordDelimiter = '|';
    $csvFormat->NoHeader = 'false';
	try {
		$result = $ssrs_report->Render2(
		  $csvFormat,
		  PageCountModeEnum::$Estimate,
		  $Extension,
		  $MimeType,
		  $Encoding,
		  $Wranings,
		  $StreamIds
		);
		//echo remove_utf8_bom(str_replace("|","<br>",$result));
  function fill($from, $to, $A){
    $res = array();
    foreach($A as $k=>$v){
      $v = explode("×",$v);
      if($k>=$from && $k < $to)
        $res[] = $v;
      }
    return $res;
  }
  function convert($r) {
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        $row = array();
        foreach($res as $x=>$y){
            $row[$r[0][$x]] = $y;
        }
          array_push($re, $row);
      }
    }
    return $re;
  }
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(0,count($result)-2,$result);
  echo json_encode(convert($results));
	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
?>