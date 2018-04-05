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
    $params[2]->Value = 7;
    $params[3] = new ParameterValue();
    $params[3]->Name = "wrf_area"; 
    $params[3]->Value = 3;
    
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
    $startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d") . " 05:50:00") - 7*60*60*24);
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        $row = array();
        foreach($res as $x=>$y){
         
            $row[$r[0][$x]] = $y;
          }
          $row["week"] =date('W', strtotime($startdate));
          array_push($re, $row);
      }
    }
    return $re;
  }
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(0,count($result)-2,$result);
  //echo json_encode(convert($results));
  $toWrite = json_encode(convert($results));
  /*$toWrite=[];
  $toWrite = array_merge($toWrite, convert($results));*/

  } catch (SSRSReportException $sr){
    echo $sr->GetErrorMessage();
  }
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
    //$toWrite = json_encode($toWrite);

    $myfile=fopen("scrapweek/scrap".date("YW", strtotime($startdate)).".json","w+");
    fwrite($myfile,$toWrite);
    fclose($myfile);
?>