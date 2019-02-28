<?php
class wwtpdata{
    function get($app,$params)
    {
        $db=new \DB\Jig('wwtpdata/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'wwtpdata.json');
        $wwtpdata=$mapper->find(Array('@id=?',$params['id']));
        $resault=[];
        // ez csak egyet fog visszaadni, a legutolsó bejegyzést erre az "id" re
        foreach($wwtpdata as $k=>$wwtpdata){
            foreach($wwtpdata as $a=>$b){
                if($a!="_id" && $wwtpdata["id"]==$params["id"])
                {
                    $resault[$a]=$b;
                }
            }
        }
        //echo json_encode($resault);

        // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($wwtpdata as $k=>$wwtpdata){
            if($wwtpdata["id"]==$params["id"]){
                $r = [];
                foreach($wwtpdata as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
    }
    function post($app,$params)
    {
        $data=json_decode($app['BODY']);
        echo json_encode($data);
        $db=new \DB\Jig('wwtpdata/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'wwtpdata.json');
        $mapper->id=$data->id; //azonosító
        $mapper->date=$data->date; //dátum
        $mapper->type=$data->machine; //gép
        $mapper->value=$data->value; //megjegyzés
        $mapper->target=$data->target; //cél
        $mapper->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        $db=new \DB\Jig('wwtpdata/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'wwtpdata.json');
        $wwtpdata=$mapper->load(Array('@id=?',$params['id']));
        $wwtpdata->description=$data->description; //megjegyzés
        $wwtpdata->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
        @unlink($wwtpdata);
    }
    function delete($app,$params)
    {
        $db=new \DB\Jig('wwtpdata/',\DB\Jig::FORMAT_JSON);
        $mapper= new \DB\Jig\Mapper($db,'wwtpdata.json');
        $wwtpdata=$mapper->find(Array('@id=?',$params['id']));
        $wwtpdata[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($wwtpdata);
    }
}
$app=require('../../../../../f3lib/base.php');
/*$app->map('/wwtpdata/@id','wwtpdata');
// ez pedig adott id-re adott days-re kellene visszaadja mindeniket.
$app->route('GET /wwtpdata/@id/@date', function($app, $params){
    $db=new \DB\Jig('wwtpdata/',\DB\Jig::FORMAT_JSON);
    $mapper=new \DB\Jig\Mapper($db,'wwtpdata.json');
    $wwtpdata=$mapper->find(Array('@id = ? and @days = ?',$params['id'], $params['date']));
    // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($wwtpdata as $k=>$wwtpdata){
            if($wwtpdata["id"]==$params["id"]){
                $r = [];
                foreach($wwtpdata as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
});*/

$app->route('GET /data',function($app){

    $data=file_get_contents('wwtpdata/wwtpdata.json');
    $data=json_decode($data);
    $resault=[];
    foreach($data as $k=>$v){
        array_push($resault,$v);
    }
    echo json_encode($resault);
});
$app->route('POST /postdata', function($app){
    $data=json_decode($app["BODY"]);
    echo $data[0]->day;
    echo "OK";
});

$app->run();
?>