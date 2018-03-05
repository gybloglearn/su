<?php
class Data {
  private $db;
  private $map;
  function __construct(){
    $this->db = new \DB\Jig('ncvar/', \DB\Jig::FORMAT_JSON);
    $this->map = new \DB\Jig\Mapper($this->db, 'ncvar.json');
  }
  function get($app, $params){
    echo $params["id"];
  }
  function post($app, $params){
    $data = json_decode(json_encode($app['REQUEST']));
    $ow = false;
    $web = \Web::instance();
    $files = $web->receive(function($file, $formFieldName){
      if($file['size'] > (2*1024*1024))
        return false;
      return true;
    }, $ow, true);

    foreach($data as $key=>$value){
     //echo $key . "=>" .$value ."<br>";
     $this->map->$key = $value;
    }

    $this->map->quotation = $app["FILES"]["quotation"]["name"];
    $this->map->msds_hu = $app["FILES"]["msds_hu"]["name"];
    $this->map->msds_en = $app["FILES"]["msds_en"]["name"];
    $this->map->status = "NEW";
    $this->map->id = date('U');

    $this->map->save();
    $app->reroute('../../../../../');

  }
}
  $app = require('../../../../../f3lib/base.php');
  $app -> map('/ncvar/@id', 'Data');

  $app -> route('GET /all', function($app){
    echo "Runninging";
  });

  $app->set('UPLOADS', 'msds/');
  $app -> run();
?>