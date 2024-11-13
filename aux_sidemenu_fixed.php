<?php
    session_start();
    print_r($_POST['fixed']);
    if($_POST['fixed'] == "true"){
        $_SESSION['sidemenu_fixed'] = true;
    }else{
        $_SESSION['sidemenu_fixed'] = false;
    }
?>
