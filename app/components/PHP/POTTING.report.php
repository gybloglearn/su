<?php
ini_set('default_socket_timeout', 600);
// set include path -- may be replaced with direct link
set_include_path('../../../../ssrs/bin/');
require_once('SSRSReport.php');
// import config variables
$conf = parse_ini_file('../../../../ssrs/config.ini');
define('UID', $conf['UID']);
define('PASWD', $conf['PASWD']);
define('SERVICE_URL', $conf['UFURL']);
define('REPORT', '/MCS/ZW500 ShiftreportTable POTTING');
function remove_utf8_bom($text){
  $bom = pack('H*', 'EFBBBF');
  $text = preg_replace("/^$bom/", '', $text);
  return $text;
}
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
      if($row["PartGroup_Name"] != "")
      array_push($re, $row);
    }
  }
  return $re;
}
// set parameters
$paramavalue = "";
$startdate = date("Y-m-d H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
$enddate = date("Y-m-d H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));

// get data
try {
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();$params[0]->Name = "startdate";$params[0]->Value = $startdate;
    $params[1] = new ParameterValue();$params[1]->Name = "enddate";$params[1]->Value = $enddate;
  try {
    $executionInfo = $ssrs_report->SetExecutionParameters2($params, "en-us");
    $csvFormat = new RenderAsCSV();
    $csvFormat->FieldDelimiter = '×';
    $csvFormat->RecordDelimiter = '|';
    $csvFormat->NoHeader = 'false';
    $result = $ssrs_report->Render2(
		  $csvFormat,
		  PageCountModeEnum::$Estimate,
		  $Extension,
		  $MimeType,
		  $Encoding,
		  $Wranings,
		  $StreamIds
		);
    $result = explode("|",remove_utf8_bom($result));
    $results = fill(3,count($result)-2,$result);
    echo json_encode(convert($results));
	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}
} catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
?>