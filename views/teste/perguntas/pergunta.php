<?php
	include_once "../../../includes/route.php";
	include_once $root."includes/tv-header.php";
?>

<style>
#pacman {
  position: absolute;
  width: 40px;
  height: 40px;
  background: url('https://upload.wikimedia.org/wikipedia/commons/0/08/PacMan.svg') no-repeat;
  background-size: contain;
}

.carinha {
  position: absolute;
  width: 100px;
  height: 100px;
}

.carinha-img {
  width: 100%;
}

.bolinha {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: yellow;
  border-radius: 50%;
}

.slider-container {
  margin: 20px;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #ffff;
  border-radius: 5px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 50px;
  height: 50px;
  background: #ffff; /* Cor do círculo */
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #000;
  margin-top: -15px;
}

input[type="range"]::-moz-range-thumb {
  width: 50px;
  height: 50px;
  background: #ffff; /* Cor do círculo */
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #000;
  margin-top: -15px;
}

input[type="range"]::-ms-thumb {
  width: 50px;
  height: 50px;
  background: #ffff; /* Cor do círculo */
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #000;
  margin-top: -15px;
}

input[type="range"]::-webkit-slider-runnable-track {
  background: linear-gradient(to right, var(--danger), var(--alternative)); /* Gradiente de cor na barra */
  height: 20px;
  border-radius: 5px;
}

</style>
<div id="app">
    <tv-pergunta
        v-cloak
        inline-template
    >
    <div id="pergunta_form">
        <?php include './includes/pergunta-table.php'; ?>
    </div>
    </tv-pergunta>

	<!-- <tv-next-page @change-template="changeTemplate"></tv-next-page> -->

    <div class="clearfix"></div>
</div>

<script src="<?php echo $route ?>dist/vendors/Vue/vue.js"></script>

<script src="<?php echo $route ?>dist/vendors/Vue/axios.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/sortable/Sortable.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/vuedraggable/vuedraggable.umd.min.js"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable-configs.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-header-teste.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-progress-bar.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-toggle-button.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-datatable.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-template-one.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-template-two.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-textarea.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-number.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-next-page.js?rls=<?=$release?>"></script>
<script src="js/tv-pergunta.js?rls=<?=$release?>"></script>
<?php
	include_once $root."includes/tv-footer.php";
?>
