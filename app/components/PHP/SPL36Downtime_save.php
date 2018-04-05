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

define("REPORT", "/MCS/SPL36_Downtime_List");

var_dump($argv);

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
$startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d") . " 05:50:00") - 7*60*60*24);
$enddate = date("m/d/Y H:i:s", strtotime($startdate) + 7*60*60*24);

echo $startdate."\n";
echo $enddate;
//get report data

// define machies
$mch = Array("SPL101"=> 2597, "SPL102"=>2644);
$mcha = Array(2597=>"SPL101", 2644=>"SPL102");
$smmch = Array(2597,2644);
//get report data
function fill($from, $to, $A){
  $res = array();
  foreach($A as $k=>$v){
    $v = explode("×",$v);
    if($k>=$from && $k < $to)
      $res[] = $v;
    }
  return $res;
}
function convert($r, $m) {
  $startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d") . " 05:50:00") - 7*60*60*24);
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
        $row["Machine"] = $m;
        $row["week"] = date("W", strtotime($startdate));
      }
        array_push($re, $row);
    }
  }
  return $re;
}
$r = "";
$toWrite = Array();

for($i=0;$i<2;$i++){
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
    $params[2]->Name = "machineid"; 
    $params[2]->Value = $smmch[$i];
    
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

  $result = explode("|",remove_utf8_bom($result));
  $results = fill(0,count($result)-2,$result);

  $toWrite = array_merge($toWrite, convert($results,$mcha[$smmch[$i]]));

  } catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
}
$toWrite = json_encode($toWrite);

$myfile=fopen("dtweek/week".date("YW", strtotime($startdate)).".json","w+");
fwrite($myfile,$toWrite);
fclose($myfile);
?>