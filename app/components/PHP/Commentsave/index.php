<?php
class comment{
    function get($app,$params)
    {
        $db=new \DB\Jig('comments/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'comments.json');
        $comments=$mapper->find(Array('@id=?',$params['id']));
        $resault=[];
        // ez csak egyet fog visszaadni, a legutolsó bejegyzést erre az "id" re
        foreach($comments as $k=>$comment){
            foreach($comment as $a=>$b){
                if($a!="_id" && $comment["id"]==$params["id"])
                {
                    $resault[$a]=$b;
                }
            }
        }
        //echo json_encode($resault);
        
        // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($comments as $k=>$comment){
            if($comment["id"]==$params["id"]){
                $r = [];
                foreach($comment as $a=>$b){
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
        $db=new \DB\Jig('comments/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'comments.json');
        $mapper->id=$data->id; //azonosító
        $mapper->date=$data->date; //dátum
        $mapper->machine=$data->machine; //gép
        $mapper->description=$data->description; //megjegyzés
        $mapper->target=$data->target; //cél
        $mapper->target=$data->actual; //aktuális
        $mapper->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        $db=new \DB\Jig('comments/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'comments.json');
        $comment=$mapper->load(Array('@id=?',$params['id']));
        $comment->description=$data->description; //megjegyzés
        $comment->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
        @unlink($comment);
    }
    function delete($app,$params)
    {
        $db=new \DB\Jig('comments/',\DB\Jig::FORMAT_JSON);
        $mapper= new \DB\Jig\Mapper($db,'comments.json');
        $comment=$mapper->find(Array('@id=?',$params['id']));
        $comment[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($comment);
    }
}
$app=require('../../../../../f3lib/base.php');
$app->map('/comment/@id','comment');
// ez pedig adott id-re adott days-re kellene visszaadja mindeniket.
$app->route('GET /comment/@id/@date', function($app, $params){
    $db=new \DB\Jig('comments/',\DB\Jig::FORMAT_JSON);
    $mapper=new \DB\Jig\Mapper($db,'comments.json');
    $comments=$mapper->find(Array('@id = ? and @days = ?',$params['id'], $params['date']));
    // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($comments as $k=>$comment){
            if($comment["id"]==$params["id"]){
                $r = [];
                foreach($comment as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
});
$app->route('GET /allcomments',function($app){
    $data=file_get_contents('comments/comments.json');
    $data=json_decode($data);
    $resault=[];
    foreach($data as $k=>$v){
        array_push($resault,$v);
    }
    echo json_encode($resault);
});
$app->run();
?>