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
define('REPORT', '/MCS/ZW500 ShiftreportTable MTF');
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
        if ($r[0][$x] == "cnt"){
          $row[$r[0][$x]] = intval($y);
        } else {
          $row[$r[0][$x]] = $y;
        }
      }
      array_push($re, $row);
    }
  }
  return $re;
}
// set parameters
$paramavalue = "";
$st = date("Y-m-d");
/*if(date("N", strtotime($st))==2 ){
  $startdate = date("Y-m-d H:i:s", strtotime($st." 05:50:00") - 7*24*60*60);
  //$startdate = date("Y-m-d H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
  $enddate = date("Y-m-d H:i:s", strtotime($st." 05:50:00"));
  //$enddate = date("Y-m-d H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
} else {
  echo "Nem van hétfő!";
  return 0;
}*/

$startdate=date("Y-m-d H:i:s"), strtotime("2018-01-01 05:50:00") + 0*24*60*60);
$enddate=date("Y-m-d H:i:s"), strtotime($startdate) + 7*24*60*60);
$final_data = [];

array_push($final_data, getReportdata('/MCS/ZW500 ShiftreportTable SM', $startdate, $enddate));
array_push($final_data,getReportdata('/MCS/ZW500 ShiftreportTable Potting', $startdate, $enddate));
array_push($final_data, getReportdata('/MCS/ZW500 ShiftreportTable MTF', $startdate, $enddate));
array_push($final_data, getReportdata('/MCS/ZW500 BP Rework', $startdate, $enddate));


save_json_file($final_data);
echo json_encode($final_data);

// save file
function save_json_file($data){
  $f = fopen("weeks/" . date("YW"). ".json", "w+");
  fwrite($f, json_encode($data));
  fclose($f);
}
// get data
function getReportdata($report, $startdate, $enddate){
  try {
      $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
      $ssrs_report->LoadReport2($report,NULL);
      $params = array();
      $params[0] = new ParameterValue();$params[0]->Name = "startdate";$params[0]->Value = $startdate;
      $params[1] = new ParameterValue();$params[1]->Name = "enddate";$params[1]->Value = $enddate;
      if($report = '/MCS/ZW500 BP Rework'){
        $params[0] = new ParameterValue();$params[0]->Name = "startdate";$params[0]->Value = $startdate;
        $params[1] = new ParameterValue();$params[1]->Name = "enddate";$params[1]->Value = $enddate;
        //$params[2] = new ParameterValue();$params[2]->Name = "cat";$params[2]->Value = "1";
      } else {
        $params[0] = new ParameterValue();$params[0]->Name = "startdate";$params[0]->Value = $startdate;
        $params[1] = new ParameterValue();$params[1]->Name = "enddate";$params[1]->Value = $enddate;
      }
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
      $params = [];
      $result = explode("|",remove_utf8_bom($result));
      $results = fill(3,count($result)-2,$result);
      return convert($results);
	  } catch (SSRSReportException $sr){
  	  echo $sr->GetErrorMessage();
	  }
  } catch (SSRSReportException $serviceException)
  {
    echo $serviceException->GetErrorMessage();
  }
}

?>