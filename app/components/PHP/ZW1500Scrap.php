<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
set_include_path("../../../../ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('../../../../ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);

define("REPORT", "/MCS_ZW1K/QC_1500_Overview_Report");

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
$typ = Array("Potting Start"=>1,"Gradeing"=>3);
$type = $typ[$_GET["datetype"]];

// define categories
$categ=Array("nap"=>0,"hét"=>3,"hónap"=>2,"év"=>1);
$category=$categ[$_GET["cat"]];
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
    $params[3]->Name ="cat";
    $params[3]->Value = $category;
    
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
    $k1 = 0;
    $k2 = 0;
    foreach($A as $k=>$v){
      $v = explode("×",$v);
      if($k>=$from && $k < $to)
        if( $v[0] == "chart2_SeriesGroup_label"){
          $k1 = $k;
        }

        if ($v[0] == "chart4_SeriesGroup_label") {
          $k2 = $k;
        }
      }
      foreach($A as $k=>$v){
        $v = explode("×", $v);
        if($k>=$k1 && $k<$k2-1){
          $res[] = $v;
        }
      }
    return $res;
  }
  function convert($r) {
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        $row = array();
        $fields = array("Label", "Date", "Value");
        foreach($res as $x=>$y){
          //$row[$r[0][$x]] = $y;
          if($x == 2){
            $row[$fields[$x]] = intval($y);
          } else {
            $row[$fields[$x]] = $y;
          }
        }
          array_push($re, $row);
      }
    }
    return $re;
  }
  $result = explode("|",remove_utf8_bom($result));
  $st = new DateTime($startdate);
  $et = new DateTime($enddate);
  $btw = $st->diff($et);
  $results = fill(0,count($result),$result);
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