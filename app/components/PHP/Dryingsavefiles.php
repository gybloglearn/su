<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
set_include_path("bin/");
require_once("SSRSReport.php");
$conf = parse_ini_file('config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UF_SURL"]);
define("REPORT", "/MCS/Drying_List");
function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get
// define drying
$mch = Array("Drying2","Drying3");
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
  $number2=0;
  $number3=0;
  $modul2a=array();
  $obj=array();
  $re = array();
  foreach($r as $k=>$res){
    if($k > 0){
      $row = array();
      foreach($res as $x=>$y){
        if($r[0][$x] == "timestamp"){
          $row[$r[0][$x]] = strtotime($y)*1000;
        } else if ($x > 5){
          $row[$r[0][$x]] = floatval($y);
        } else {
          $row[$r[0][$x]] = $y;
        }
      }
      array_push($re,$row);
    }
  }
  return $re;
}
try
{
  $toWrite = Array();
  for($i=0;$i<2;$i++){
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();
    $params[0]->Name = "machinename"; 
    $params[0]->Value = $mch[$i];
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
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(0,count($result)-2,$result);
  $myJson= json_encode(convert($results));
  $toWrite = array_merge($toWrite, convert($results)); 
	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
  }
}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
    $toWrite = json_encode($toWrite);
  echo $toWrite;
    $myfile=fopen("Dryingfiles/Drynumbers_".date("YmdH" ).".json","w+");
    fwrite($myfile,$toWrite);
    fclose($myfile);
?>