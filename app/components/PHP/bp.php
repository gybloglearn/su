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

define("REPORT", "/MCS/MTF_BP_Raw_Data");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}

// set Parameters from get
$startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
if(isset($_GET["enddadte"])){
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
} else {
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") + 60*60*24);
}
// define machies
//$mch = Array("SM1"=>9, "SM2"=>10, "SM4"=>2595, "SM5"=>2596, "SM6"=>4845, "SM7"=>4846, "SM8"=>4847, "SM9"=>2700);
$mch = Array(
  "BP1"=>780,
  "BP2"=>781,
  "BP3"=>782,
  "BP4"=>783,
  "BP5"=>784,
  "BP6"=>785,
  "BP7"=>786,
  "BP8"=>792,
  "BP11"=>2590,
  "BP12"=>2591,
  "BP13"=>2592,
  "BP14"=>2593,
  "BP15"=>2594,
  "BP21"=>4849,
  "BP22"=>4850,
  "BP23"=>4851,
  "BP24"=>4852,
  "BP25"=>4853,
  "BP26"=>4854
);
$mchs = [];
if(isset($_GET["mch"]) && strpos($_GET["mch"],",") > 0){
  $mchs = explode(",",$_GET["mch"]);
  //var_dump($mchs);
  foreach($mchs as $k=>$v){
    $mchs[$k] = $mch[$v];
  }
  //var_dump($mchs);
} else {
  $machine = $mch[$_GET["mch"]];
}

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

    if (count($mchs) > 0){
      foreach($mchs as $k=>$v){
        $params[$k+2] = new ParameterValue();
        $params[$k+2]->Name = "machineid"; $params[$k+2]->Value = $v;
      }
    } else {
      $params[2] = new ParameterValue();
      $params[2]->Name = "machineid"; $params[2]->Value = $machine;
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
          if($x==5 || $x==6)
            $row[$r[0][$x]] = intval($y);
          else
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