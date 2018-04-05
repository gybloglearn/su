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

define("REPORT", "/MCS/eScrap_TaskState");

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
// define level
$level = Array("J1"=>1, "J2"=>3, "J3"=>5, "Konyvelesre kesz"=>6, "Konyvelve"=>7,"Visszautasitva"=>8,"Penzugyi reviewed"=>9);
$wrflevel = $level[$_GET["wrf_level_id"]];

// define area
$area = Array("WP01"=>1, "WP03 Dope"=>2, "WP03 Fiber"=>3, "WP03 500 RAW"=>4, "WP03 500 Sheet"=>5,"WP03 500 Modul"=>6,"WP03 1000 Bundle"=>7,"WP03 1000 SFG"=>8,"WP03 1500 Bundle"=>9,"WP03 1500 FG"=>10,"WP04"=>11,"DOCK"=>12,"WP03 1000 FG"=>13,"TTBY"=>14,"WP03 ZB"=>16,"WP03 Zeelung"=>17,"WP03 1000 RAW"=>18,"WP03 1500 RAW"=>19);
$wrfarea = $area[$_GET["wrf_area"]];
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
    $params[2] = new ParameterValue();
    $params[2]->Name = "wrf_level_id"; 
    $params[2]->Value = $wrflevel;
    $params[3] = new ParameterValue();
    $params[3]->Name = "wrf_area"; 
    $params[3]->Value = $wrfarea;
    
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
            if($r[0][$x] == "JavaslatDatuma" || $r[0][$x] == "Konyveles_Datuma"){
              $row[$r[0][$x]] = date("Y-m-d H:i", strtotime($y));
            } else {
              $row[$r[0][$x]] = $y;
            }
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