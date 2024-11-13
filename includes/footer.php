                </div>
				<footer class="tv-footer">
					
					<?php
						date_default_timezone_set('America/Sao_Paulo'); 
						$data_str_to_time = strtotime(trim(exec('git log --pretty="%ci" -n1 HEAD')));
						$dataHoraUltimoCommit = date('d/m/Y, H:i', $data_str_to_time);
						echo '<div class="py-2 py-sm-0">Released at '.$dataHoraUltimoCommit.'</div>';
					?>
                    
					<div class="pb-2 pb-sm-0">&copy; 2024-<script>document.write(new Date().getFullYear())</script> Fatec - Tatuí</div>
				</footer>
				
		</div>
		<script type="text/javascript" src="<?=$route?>dist/vendors/bootstrap-4.4.1-dist/js/bootstrap.bundle.min.js"></script>
		<script>$('.dropdown-toggle').dropdown(); $('[data-toggle="tooltip"]').tooltip()</script>
		<script src="<?=$route?>dist/vendors/simplebar/simplebar.min.js"></script>
		<!-- <script src="<?=$route?>dist/vendors/SheetJS/xlsx.full.min.js"></script> -->

		<!-- <?php
		if(!isset($_SESSION['user_name'])){
			echo '<script type="text/javascript">logout();</script>';
		}
		?> -->

		<!-- Verifica situação do sidemenu -->
		<?php if($_SESSION['sidemenu_fixed']){ ?>
			<script>
				sidemenu_fixed = true;
			</script>
		<?php } if($_SESSION['sidemenu_lock']){ ?>
			<script>
				sidemenu_lock = true;
			</script>
		<?php } if($_SESSION['sidemenu_hide']){ ?>
			<script>
				sidemenu_hide = true;
			</script>
		<?php } ?>
		<!-- Verifica situação do sidemenu -->
	</body>
</html>
