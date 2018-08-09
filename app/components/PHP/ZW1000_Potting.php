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


define("REPORT", "/MCS_ZW1K/ZW1000 D Modul History POTTING");

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
// define phase
$phaseid = Array("Grade Date"=>0, "Brick Potting Init"=>1, "Perme brick potting"=>2, "Potting ford."=>9, "Closed Brick Potting"=>3, "Brick Cutting"=>4, "Sugaring"=>6, "Marriage"=>7, "Cheating"=>8, "Centrifuge start"=>10, "Centrifuge end"=>15, "Potting OK to ETF"=>-1,"Chlorinating Start"=>21,"Chlorinating End"=>22,"PDT Test"=>26,"BP start"=>24,"BP end"=>25);
$phase = $phaseid[$_GET["phaseid"]];
$filter = $_GET["filter"];
/*$prod_id = $_GET["prod_id"];
$type = $_GET["type"];*/
//$chem = $_GET["chem"];
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
    $params[2]->Name ="filter";
    $params[2]->Value = $filter;
    $params[3]= new ParameterValue();
    $params[3]->Name ="type";
    $params[3]->Value = "";
    $params[4]= new ParameterValue();
    $params[4]->Name ="phaseid";
    $params[4]->Value = $phase;
    $params[5]= new ParameterValue();
    $params[5]->Name ="chem";
    $params[5]->Value = null;
    
    
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
          if($r[0][$x] == "timestamp"){
            $row[$r[0][$x]] = strtotime($y)*1000;
          } else if ($r[0][$x] == "Event_time"){
            $row[$r[0][$x]] = intval($y);
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