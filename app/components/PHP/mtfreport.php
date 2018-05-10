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

define("REPORT", "/MCS/ZW500 ShiftReport MTF");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}

$startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") - (intval(date("H"))<6?60*60*24:0));
$enddate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") - (intval(date("H"))<6?60*60*24:0) + 60*60*24);
$machine = 0;

//echo "startDate: ".$startdate."\n";
//echo "endDate: ".$enddate;

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
    $params[2]->Name = "machine";
    $params[2]->Value = $machine;

    $executionInfo = $ssrs_report->SetExecutionParameters2($params, "en-us");

    $csvFormat = new RenderAsCSV();
    $csvFormat->FieldDelimiter = ';';
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
  function fill($from, $to, $A){
    $res = array();
    foreach($A as $k=>$v){
      $v = explode(";",$v);
      if($k>=$from && $k < $to)
        $res[] = $v;
      }
    return $res;
  }

  function convert($r) {
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        //if ($res[3] > 0){
            $row = array();
            foreach($res as $x=>$y){
                if($x == 1 || $x == 3){
                    $row[$r[0][$x]] = intval($y);
                } else if($x == 2){
                    $row[$r[0][$x]] = $y; //str_replace("Bubble point tank1-", "",$y);
                } else {
                    $row[$r[0][$x]] = strtotime($y)*1000;
                }
            }
            array_push($re, $row);
        //}
      }
    }
    return $re;
  }

  $result = explode("|",remove_utf8_bom($result));
  $results = fill(3,count($result)-2,$result);
  echo json_encode(convert($results));
  //array_push($records, Array("timestamp"=>$d, "data"=>convert($results)));
  //file_put_contents("c:/wamp/www/getReports/files/mtf_".date("mdH").".json", json_encode($records));
  //echo "OK";


	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}

}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}


?>