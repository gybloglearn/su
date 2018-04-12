<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
//set_include_path("../../../../SSRSReport/bin/");
set_include_path("/var/www/html/ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('/var/www/html/ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);

define("REPORT", "/MCS/SM_SOE");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}

if ( isset( $argv ) ) {
    parse_str(
        join( "&", array_slice( $argv, 1 )
    ), $_GET );
}
//var_dump($_GET);

// set Parameters from get
if(isset($_GET["startdate"])){
	$startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
} else {
	$startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d")." 05:50:00") - 24*60*60);
	$_GET["startdate"] = date("Y-m-d", strtotime(date("Y-m-d"). " 05:50:00") - 24*60*60);
}
//$enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
$enddate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") + 60*60*24);

// define machies
$mch = Array(9=>"SM1", 10=>"SM2", 2595=>"SM4", 2596=>"SM5", 4845=>"SM6", 4846=>"SM7", 4847=>"SM8", 2700=>"SM9");
$smmch = Array(9, 10, 2595, 2596, 4845, 4846, 4847, 2700);

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
  function convert($r,$m,$mch) {
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        $row = array();
        foreach($res as $x=>$y){
          if($r[0][$x] == "timestamp"){
            $row[$r[0][$x]] = strtotime($y)*1000;
            $row["week"] = date("W", strtotime($y));
          } else if ($r[0][$x] == "Event_time"){
            $row[$r[0][$x]] = intval($y);
          } else {
            $row[$r[0][$x]] = $y;
          }
        }
        if($row["Event_type"] == "Downtime"){
          $row["Machine"] = $mch[$m];
          array_push($re, $row);
          }
        //array_push($re, $row);
      }
    }
    return $re;
  }
  $toWrite = Array();
for($i=0;$i<8;$i++){
  echo date("Y-m-d H:i:s")." - ".$smmch[$i]." - ".$_GET["startdate"]."\n";
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
      $params[2]->Name = "machineList"; 
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
  
    $result = explode("|",remove_utf8_bom($result));
    $results = fill(0,count($result)-2,$result);

    $myJson= json_encode(convert($results, $smmch[$i], $mch));
    $toWrite = array_merge($toWrite, convert($results, $smmch[$i], $mch));

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

    $myfile=fopen("/var/www/html/sm/app/components/PHP/sm/sm".date("Ymd", strtotime($startdate)).".json","w+");
    fwrite($myfile,$toWrite);
    fclose($myfile);
?>
