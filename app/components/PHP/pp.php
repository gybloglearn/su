<?php
$dir = scandir('/var/www/html/file_reports/files/pp/');
    $res = [];
    $f = "";
    foreach($dir as $v){
        if($v != "." && $v != ".."){
            $f ="";
            if(isset($_GET["day"])){
                if(strrpos($v, $_GET["day"])>0){
                    $f = file_get_contents('/var/www/html/file_reports/files/pp/'.$v);
                }
            } else {
                if(isset($_GET["from"])){
                    $day = intval(substr($v, 3,4));
                    $fr = intval($_GET["from"]);
                    if($day >= $fr){
                        $f = file_get_contents('/var/www/html/file_reports/files/pp/'.$v);
                    }
                } else {
                    $f = file_get_contents('/var/www/html/file_reports/files/pp/'.$v);
                }
            }
            if(strlen($f)>0){
                $ret = Array("date"=>str_replace("pp_","",str_replace(".csv","",$v)), "data"=>splitter($f));
                array_push($res, $ret);
            }
        }
    }
    
    echo json_encode($res);

    function splitter($string){
        $d = explode("\r\n", $string);
        $res = [];
        $elozo8ora = 0;
        $elozo1_2nap = 0;
        $elozo3_snap = 0;
        $elozo1_het = 0;
        $now = strtotime($d[1]);
        $data = [];
        $data["adatok"] = [];
        $data["adatok"]["szak"] = [];
        $data["adatok"]["nap2"] = [];
        $data["adatok"]["nap2s"] = [];
        $data["adatok"]["het1s"] = [];
        foreach($d as $k=>$v){
            $datares = [];
            $fields = explode(";", $d[3]);
            if($k>3 && $k < count($d)-2){
                $i = explode(";", $v);
                foreach($i as $ka=>$va){
                    $datares[$fields[$ka]] = $va;
                    if($ka==3){
                        $dat = strtotime($va);
                        if($dat < $now && $dat > $now - 60*60*8){
                            $elozo8ora++;
                        } else if($dat < $now - 60*60*8 && $dat > $now - 2*60*60*24){
                            $elozo1_2nap++;
                        } else if($dat < $now - 2*60*60*24 && $dat > $now - 7*60*60*24){
                            $elozo3_snap++;
                        } else if($dat < $now - 7*60*60*24){
                            $elozo1_het++;
                        }
                        //echo date("y-m-d H:i", $now)." ".date("y-m-d H:i", $dat)." - ".$elozo8ora."".$elozo1_2nap."".$elozo3_snap."<br>";
                    }
                    if($ka == 6){
                        $dat = strtotime($i[3]);
                        if($dat < $now && $dat > $now - 60*60*8){
                            array_push($data["adatok"]["szak"], $datares);
                        } else if($dat < $now - 60*60*8 && $dat > $now - 2*60*60*24){
                            array_push($data["adatok"]["nap2"], $datares);
                        } else if($dat < $now - 2*60*60*24 && $dat > $now - 7*60*60*24){
                            array_push($data["adatok"]["nap2s"], $datares);
                        } else if($dat < $now - 7*60*60*24){
                            array_push($data["adatok"]["het1s"], $datares);
                        }
                    }
                }
                $data["szak"] = $elozo8ora;
                $data["nap2"] = $elozo1_2nap;
                $data["nap2s"] = $elozo3_snap;
                $data["het1s"] = $elozo1_het;
                //print_r($data);
                //echo json_encode($data) . "<br>";
                //array_push($res, $data);
                //array_push($data["adatok"], $datares);
            }
        }
        
        array_push($res, $data);
        return $res;
    }
?>
