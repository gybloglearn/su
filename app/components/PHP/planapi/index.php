<?php
class Plan{
    function get($app,$params)
    {
        $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'plans.json');
        $plans=$mapper->find(Array('@id=?',$params['id']));
        $resault=[];
        // ez csak egyet fog visszaadni, a legutolsó bejegyzést erre az "id" re
        foreach($plans as $k=>$plan){
            foreach($plan as $a=>$b){
                if($a!="_id" && $plan["id"]==$params["id"])
                {
                    $resault[$a]=$b;
                }
            }
        }
        //echo json_encode($resault);

        // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($plans as $k=>$plan){
            if($plan["id"]==$params["id"]){
                $r = [];
                foreach($plan as $a=>$b){
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
        $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
        foreach($data as $k=>$d){
            $mapper=new \DB\Jig\Mapper($db,'plans.json');
            $mapper->id=$d->id; //azonosító
            $mapper->sm=$d->sm; //SM
            //$mapper->date=$data->date; //dátum
            //$mapper->type=$data->type; //termék típus
            //$mapper->db=$data->db; // tervezett darab szám reggeles szak
            //$mapper->amountshift3=$data->amountshift3; // tervezett darab szám éjszakás szak
            $mapper->amount=$d->amount; //sheet szám típusból adódik
            $mapper->save();
            @unlink($mapper);
        }

        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'plans.json');
        $plan=$mapper->load(Array('@id=?',$params['id']));
        $plan->amount=$data->amount;
        $plan->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
        @unlink($plan);
    }
    function delete($app,$params)
    {
        $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
        $mapper= new \DB\Jig\Mapper($db,'plans.json');
        $plan=$mapper->find(Array('@id=?',$params['id']));
        $plan[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($plan);
    }
}
$app=require('../../../../../f3lib/base.php');
$app->map('/plan/@id','Plan');
// ez pedig adott id-re adott days-re kellene visszaadja mindeniket.
$app->route('GET /plan/@id/@date', function($app, $params){
    $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
    $mapper=new \DB\Jig\Mapper($db,'plans.json');
    $plans=$mapper->find(Array('@id = ? and @days = ?',$params['id'], $params['date']));
    // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($plans as $k=>$plan){
            if($plan["id"]==$params["id"]){
                $r = [];
                foreach($plan as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
});
$app->route('GET /allplans',function($app){
    $data=file_get_contents('plans/plans.json');
    $data = json_decode($data);
    $resault=[];
    foreach($data as $k=>$v){
        array_push($resault,$v);
    }
    echo json_encode($resault);
});
$app->run();
?>