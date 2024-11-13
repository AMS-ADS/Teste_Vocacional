<?php
session_start();

if (!isset($_SESSION['usuario']) || $_SESSION['nivelAcesso'] < 1) {
    header('Location: index.html');
    exit();
}
?>