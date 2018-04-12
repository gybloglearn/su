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

define("REPORT", "/MCS/ZW500 SheetScraps Details");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}

// set Parameters from get
$startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
//$enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
if(isset($_GET["enddate"])){
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"]." 05:50:00"));
} else {
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["startdate"]." 05:50:00") + 60*60*24);
}

// define machies
//$mch = Array("SM1"=>9, "SM2"=>10, "SM4"=>2595, "SM5"=>2596, "SM6"=>4845, "SM7"=>4846, "SM8"=>4847, "SM9"=>2700);
//$machine = $mch[$_GET["mch"]];

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

    /*$params[2] = new ParameterValue();
    $params[2]->Name = "machinelist"; 
    $params[2]->Value = $machine;*/

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
  $data = [];
  function convert($r) {
    $re = array();
    $a = array(
      "101"=>'{"category":"Lapparaméter","code":"101","description":"Hosszú/rövid lapok"}',
      "102"=>'{"category":"Lapparaméter","code":"102","description":"Széles/keskeny ragasztó"}',
      "103"=>'{"category":"Lapparaméter","code":"103","description":"Ragasztó törik"}',
      "104"=>'{"category":"Lapparaméter","code":"104","description":"Vékony/vastag ragasztó"}',
      "105"=>'{"category":"Lapparaméter","code":"105","description":"Laminált csík magas/alacsony"}',
      "106"=>'{"category":"Lapparaméter","code":"106","description":"Ragasztócsík pozíció rossz"}',
      "107"=>'{"category":"Lapparaméter","code":"107","description":"Termékváltás"}',
      "108"=>'{"category":"Lapparaméter","code":"108","description":"Egyéb paraméter hiba"}',
      "109"=>'{"category":"Lapparaméter","code":"109","description":"Utólagos selejtezés hibás lapparaméter miatt "}',
      "201"=>'{"category":"Géphiba","code":"201","description":"Nyomólap hiba"}',
      "202"=>'{"category":"Géphiba","code":"202","description":"Kihordó asztal hiba"}',
      "203"=>'{"category":"Géphiba","code":"203","description":"Vágókés hiba"}',
      "204"=>'{"category":"Géphiba","code":"204","description":"Sok egymásra tekert szál"}',
      "205"=>'{"category":"Géphiba","code":"205","description":"Le kellett vágni a dobról"}',
      "206"=>'{"category":"Géphiba","code":"206","description":"Szálmegfogó hiba"}',
      "207"=>'{"category":"Géphiba","code":"207","description":"Hűtőlap hiba"}',
      "208"=>'{"category":"Géphiba","code":"208","description":"Ragasztó buborékos"}',
      "209"=>'{"category":"Géphiba","code":"209","description":"Ragasztó farkasfogas, göbös, zsebes"}',
      "210"=>'{"category":"Géphiba","code":"210","description":"Ragasztó szennyezett"}',
      "211"=>'{"category":"Géphiba","code":"211","description":"Kézi  lapdurrogtatás "}',
      "212"=>'{"category":"Géphiba","code":"212","description":"Ragasztó égett"}',
      "213"=>'{"category":"Géphiba","code":"213","description":"Egyéb géphiba"}',
      "214"=>'{"category":"Géphiba","code":"214","description":"Utólagos selejtek SM vagy ragasztó-géphiba miatt"}',
      "301"=>'{"category":"Szálhibák","code":"301","description":"Színes lap"}',
      "302"=>'{"category":"Szálhibák","code":"302","description":"Szennyezett, pöttyös szálak"}',
      "303"=>'{"category":"Szálhibák","code":"303","description":"Braides szálak"}',
      "304"=>'{"category":"Szálhibák","code":"304","description":"Féloldalas, bevonat nélküli szálak"}',
      "305"=>'{"category":"Szálhibák","code":"305","description":"Göbös, csomós szálak"}',
      "306"=>'{"category":"Szálhibák","code":"306","description":"Mintaváteli csomó"}',
      "307"=>'{"category":"Szálhibák","code":"307","description":"Száraz szálak"}',
      "308"=>'{"category":"Szálhibák","code":"308","description":"Bevonatgyenge szálak"}',
      "309"=>'{"category":"Szálhibák","code":"309","description":"Visszaszedett lapok"}',
      "310"=>'{"category":"Szálhibák","code":"310","description":"Lapdurrogtatás - túl sok hiba a lapon"}',
      "311"=>'{"category":"Szálhibák","code":"311","description":"Egyéb szálhiba"}',
      "312"=>'{"category":"Szálhibák","code":"312","description":"Utólagos selejtezés szálhiba miatt"}',
      "401"=>'{"category":"Egyéb hibák","code":"401","description":"keretborulás"}',
      "402"=>'{"category":"Egyéb hibák","code":"402","description":"lappótlás"}',
      "403"=>'{"category":"Egyéb hibák","code":"403","description":"kísérlet"}',
      "404"=>'{"category":"Egyéb hibák","code":"404","description":"Egyéb SM hiba"}',
      "405"=>'{"category":"Egyéb hibák","code":"405","description":"Utólagos selejtezés egyéb hiba miatt"}',
      "501"=>'{"category":"Robothiba","code":"501","description":"Keretfeladó robot hiba"}',
      "502"=>'{"category":"Robothiba","code":"502","description":"Potting robot hiba"}'
    );
    //Időpont,Szak,SM,Típus,Kémia,Hibakód,SE db ,Megj ,Karb,cikk
    $fields = ["timestamp","shift","sm","type","chem","code","pc","comment","Karb","pn"];
    foreach($r as $k=>$res){
        $row = array();
        foreach($res as $x=>$y){
          $row[$fields[$x]] = $y;
          if($fields[$x] == "code"){
            //$row[$fields[$x]] = json_decode($a[$y]);
            $code = json_decode($a[$y]);
            foreach($code as $i=>$j){
              $row[$i]=$j;
            }
            //array_push($row, json_decode($a[$y]));
          }
          if($fields[$x] == "timestamp"){
            $row[$fields[$x]] = date("Y-m-d H:i:s", strtotime($y));
            $row["day"] = date("Y-m-d", date("H", strtotime($y))<6?strtotime($y)-60*60*24:strtotime($y));
          }
          if($fields[$x] == "pc"){
            $row[$fields[$x]] = intval($y);
          }
        }
        array_push($re, $row);
    }
    return $re;
  }

    $result = explode("|",remove_utf8_bom($result));
    $results = fill(4,count($result)-2,$result);
    //print_r($results);
    //echo json_encode(convert(array_slice($results,-3,3)));
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