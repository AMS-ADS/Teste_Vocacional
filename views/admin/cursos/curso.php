<?php
	include_once "../../../includes/route.php";
	include_once $root."includes/header.php";
?>
<div id="app">
	<?php
		include_once $root."includes/alert-dialog.php";
		include_once $root."includes/alert-banner.php";
		include_once $root."includes/alert-snackbar.php";
	?>
    <tv-curso v-if="template == '1'"
    	v-cloak
    	inline-template
    >
        <div>
            <div id="curso_table" v-show="template == 1">
                 <!-- Consulta -->
                <?php include './includes/curso-table.php'; ?>
            </div>
            <div id="curso_form" v-show="template == 2">
                 <!-- Formulário -->
                <?php include './includes/curso-form.php'; ?>
            </div>

        </div>
    </tv-curso>

	<tv-backtotop></tv-backtotop>

    <div class="clearfix"></div>
</div>

<script src="<?php echo $route ?>dist/vendors/Vue/axios.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/sortable/Sortable.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/vuedraggable/vuedraggable.umd.min.js"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable-configs.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-text.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-textarea.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-radio.js?rls=<?=$release?>"></script>
<!-- <script src="<?php echo $route ?>dist/vue-components/tv-input-switch.js?rls=<?=$release?>"></script> -->
<script src="<?php echo $route ?>dist/vue-components/tv-input-select.js?rls=<?=$release?>"></script>
<!-- <script src="<?php echo $route ?>dist/vue-components/tv-input-checkbox.js?rls=<?=$release?>"></script> -->
<!-- <script src="<?php echo $route ?>dist/vue-components/tv-modal-tutorial.js?rls=<?=$release?>"></script> -->
<script src="<?php echo $route ?>dist/vue-components/tv-backtotop.js?rls=<?=$release?>"></script>
<script src="js/tv-curso.js?rls=<?=$release?>"></script>
<?php
	include_once $root."includes/footer.php";
?>
