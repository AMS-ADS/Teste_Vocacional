<?php
    session_start();
    print_r($_POST['lock']);
    if($_POST['lock'] == "true"){
        $_SESSION['sidemenu_lock'] = true;
    }else{
        $_SESSION['sidemenu_lock'] = false;
    }
?>
