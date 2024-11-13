<?php
    $commitHash = '.'.trim(exec('git log --pretty="%H" -n1 HEAD'));
    $release = date('Ymd').$commitHash;

    $json_menu = file_get_contents($root."includes/json_sidemenu.txt");
    $sidemenu = json_decode($json_menu);
?>
<!DOCTYPE html>
<html lang="pt-br" data-theme="light">
    <head>
		<script type="text/javascript" src="<?=$route?>dist/vendors/jQuery/jquery.min.js"></script>
		<script type="text/javascript" src="<?=$route?>config/serverURL.js"></script>
		<!-- 
		
		<script type="text/javascript" src="<?= $route?>dist/vendors/moment/moment.min.js"></script>
		
		 -->
		<script type="text/javascript" src="<?= $route?>config/Auth2.js?rls=<?=$release?>"></script>
		<script stype="text/javascript" src="<?= $route?>dist/js/utils.js?rls=<?=$release?>"></script>
		<script src="<?=$route?>dist/js/main.js?rls=<?=$release?>"></script>

		<!-- <script> confirmLogin() </script> -->
		<meta name="robots" content="noindex">
		<meta charset="UTF-8">
	    <title>Teste vocacional</title>
	    <meta content="width=360, initial-scale=1" name="viewport">
	    <meta name="mobile-web-app-capable" content="yes">
	    <meta name="apple-mobile-web-app-capable" content="yes">
		<!-- <link rel="apple-touch-icon" sizes="180x180" href="<?= $route?>dist/images/apple-touch-icon.png?v=2">
        <link rel="icon" type="image/png" sizes="32x32" href="<?= $route?>dist/images/favicon-32x32.png?v=2">
        <link rel="icon" type="image/png" sizes="16x16" href="<?= $route?>dist/images/favicon-16x16.png?v=2">
        <link rel="manifest" href="<?= $route?>dist/images/site.webmanifest?v=2">
        <link rel="mask-icon" href="<?= $route?>dist/images/safari-pinned-tab.svg?v=2" color="#5bbad5"> -->
        <!-- <link rel="shortcut icon" href="<?= $route?>dist/images/favicon.ico?v=2"> -->
        <meta name="msapplication-TileColor" content="#ff0000">
        <meta name="theme-color" content="#ffffff">

		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/fontawesome/css/fontawesome.min.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/fontawesome/css/brands.min.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/fontawesome/css/solid.min.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/fontawesome/css/regular.min.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/fontawesome/css/v5-font-face.min.css">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kavoon&display=swap" rel="stylesheet">

		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/bootstrap-4.4.1-dist/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/vendors/simplebar/simplebar.css">
		<link rel="stylesheet" type="text/css" href="<?=$route?>dist/css/main.css">
    </head>

    <body style="font-family: 'PixelGameFont';">
		<?php include_once $_SERVER['DOCUMENT_ROOT'].'/Teste-Vocacional/includes/sidemenu.php'; ?>
		
		<div id="tv-cmenu" class="tv-context-menu" data-load="false">
			<ul id="tv-cmenu-group" class="tv-context-menu__content">
				<li id="tv-cmenu-view" class="tv-context-menu__item">
					<span><i class="fas fa-eye color-alternative"></i> Visualizar</span>
				</li>
				<li id="tv-cmenu-edit" class="tv-context-menu__item">
					<span><i class="fas fa-pen color-primary"></i> Editar</span>
				</li>
				<li id="tv-cmenu-clone" class="tv-context-menu__item">
					<span><i class="fas fa-clone color-warning"></i> Duplicar</span>
				</li>
				<li id="tv-cmenu-delete" class="tv-context-menu__item">
					<span><i class="fas fa-trash-alt color-danger"></i> Excluir</span>
				</li>
				<div id="alt-button-content" class="tv-context-menu__alt-buttons"></div>
			</ul>
	    </div>

		<div id="tv_tooltip" class="tv-tooltip">
			<span id="tv_tooltip_loguser" class="font-weight-medium"></span>
			<span id="tv_tooltip_logdata" class="font-weight-medium float-right ml-3"></span>
			<div id="tv_tooltip_logvalue"></div>
		</div>
		
		<div id="wrapper" class="tv-wrapper">
			<header id="tv_header-teste" class="tv-header-teste">
                <div class="tv-header-teste__logo kavoon-bold">
                    <a href="<?= $route ?>index.html" title="Home">
                        Teste vocacional
                    </a>
                </div>
            </header>
			<div class="main-content">