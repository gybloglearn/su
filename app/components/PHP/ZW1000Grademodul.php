<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
set_include_path("../../../../ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('../../../../ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);

define("REPORT", "/MCS_ZW1K/grdmodul1000");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get
$startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
if(isset($_GET["enddate"])){
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
} else {
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") + 60*60*24);
}
// define types
$typ = Array("ETF"=>2, "Gradeing"=>3);
$type = $typ[$_GET["datetype"]];

// define modul array
$modul=Array(
  "3033401",
  "3033402",
  "3033403",
  "3096940",
  "3096955",
  "3111328",
  "3111330",
  "3111331",
  "3111332",
  "3111333",
  "3111334",
  "3111335",
  "3111336",
  "3111337",
  "3111340",
  "3111343",
  "3111344",
  "3111346",
  "3111347",
  "3111356",
  "3111357",
  "3111358",
  "3111359",
  "3146968",
  "3158157"
);
//$moduls=$modul[$_GET["type"]];
//get report data
try
{
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();
    $params[0]->Name = "startdate";
    $params[0]->Value = $startdate;
    $params[1] = new ParameterValue();
    $params[1]->Name = "enddate";
    $params[1]->Value = $enddate;
    $params[2]= new ParameterValue();
    $params[2]->Name ="datetype";
    $params[2]->Value = $type;
    $params[3]= new ParameterValue();
    $params[3]->Name ="gradename";
    $params[3]->Value = "Scrap";
    $params[4]= new ParameterValue();
    $params[4]->Name ="scrapname";
    $params[4]->Value = "All";
   
    foreach($modul as $k=>$v){
      $params[$k+5]=new ParameterValue();
      $params[$k+5]->Name="type";
      $params[$k+5]->Value=$v;
    }

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
          if($r[0][$x] == "GradeDate"){
            /*$row[$r[0][$x]] = strtotime($y)*1000;*/
            $row[$r[0][$x]] = $y;
            $row["week"] = date("Y\WW", strtotime($y));
          } else {
            $row[$r[0][$x]] = $y;
          }
        }
        if(isset($_GET["downtimes"])){
          if($row["Event_type"] == "Downtime"){
            $row["shiftnum"] = intval(substr($row["Shift_ID"],-1));
            array_push($re, $row);
          }
        } else {
          array_push($re, $row);
        }
      }
    }
    return $re;
  }
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(3,count($result)-2,$result);
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