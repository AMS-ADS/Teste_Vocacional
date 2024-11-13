<?php
	include_once "../../../includes/route.php";
	include_once $root."includes/header.php";

   $sessionCurso = $_SESSION['curso'];
?>
<div id="app">
	<?php
		include_once $root."includes/alert-dialog.php";
		include_once $root."includes/alert-banner.php";
		include_once $root."includes/alert-snackbar.php";
	?>
    <tv-pergunta v-if="template == '1'"
    :curso-coordenador="<?= $sessionCurso ?>"

    v-cloak
    	inline-template
    >
        <div>
  
            <div id="pergunta_form" v-show="template == 1">
                 <!-- Formulário -->
                <?php include './includes/pergunta-form.php'; ?>
            </div>

        </div>
    </tv-pergunta>

	<tv-backtotop></tv-backtotop>

    <div class="clearfix"></div>
</div>

<script src="<?php echo $route ?>dist/vendors/Vue/axios.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/sortable/Sortable.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/vuedraggable/vuedraggable.umd.min.js"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable-configs.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-textarea.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-number.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-backtotop.js?rls=<?=$release?>"></script>
<script src="js/tv-pergunta.js?rls=<?=$release?>"></script>
<?php
	include_once $root."includes/footer.php";
?>
