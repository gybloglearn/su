<?php
		
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
file_put_contents("data.json", $postdata);

?>
