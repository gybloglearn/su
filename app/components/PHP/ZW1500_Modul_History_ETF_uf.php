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

define("REPORT", "/MCS_ZW1K/ZW1500 Modul History ETF");

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
$phaseid = Array("Drying End"=>70, "Static Potting start"=>72, "Dynamic Potting Start"=>10, "Chlorinating (Rinse1) Start"=>44, "BP start"=>24, "Grade Date"=>0);
$phase = $phaseid[$_GET["phaseid"]];
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
    $params[2]->Value = "";
    $params[3]= new ParameterValue();
    $params[3]->Name ="type";
    $params[3]->Value = "";
    $params[4]= new ParameterValue();
    $params[4]->Name ="phaseid";
    $params[4]->Value = $phase;
    
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
      //var_dump($r);
      foreach($r as $k=>$res){
        if($k > 0){
          $row = array();
          foreach($res as $x=>$y){
            /*if($r[0][$x] == "jobid"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Bundle1"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Static_Potting_Start"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Static_Potting_Flip"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Static Potting End"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Centrifuga_Start"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Centrifuga_End"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Chlorination_start__Rinse1Start"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Chlorination_end__Rinse2End"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "BP_start"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "BP_end"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Gradedate"){
              $row[$r[0][$x]] = $y;
            }
            else if($r[0][$x] == "Grade"){
              $row[$r[0][$x]] = $y;
            }*/
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