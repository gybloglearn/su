<?php

if(isset($_POST)){
    echo $_POST["quantity"];
    echo $_POST["quality"];
    echo $_POST["actualdate"];
    echo $_POST["nextdate"];
    echo $_POST["month"];
    echo $_POST["hufvalue"];
} else {
    echo
        "<html><body><md-content layout-padding>
            <form name='userform' action='worker.php' method='post'>
                <div layout='row'>
                    <md-input-container class='md-block' flex>
                        <md-switch class='md-primary' name='quantity'>
                            Mennyiségi mutató
                        </md-switch>
                    </md-input-container>
                    <md-input-container class='md-block' flex>
                        <md-switch class='md-primary' name='quality'>
                            Minőségi mutató
                        </md-switch>
                    </md-input-container>
                </div>
            </form>
        </md-content></body></html>";
}


?>
