<?php
    const DBDRIVE = 'mysql';
    const DBHOST = 'localhost';
    const DBNAME = 'teste-vocacional';
    const DBUSER = 'root';
    const DBPASS = '';
    
    $conn = new PDO(DBDRIVE.':host='.DBHOST.';dbname='.DBNAME,DBUSER,DBPASS, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
?>
