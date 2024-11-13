<?php
    session_start();
    print_r($_POST['hide']);
    if($_POST['hide'] == "true"){
        $_SESSION['sidemenu_hide'] = true;
    }else{
        $_SESSION['sidemenu_hide'] = false;
    }
?>
