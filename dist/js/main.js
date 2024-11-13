var sidemenu_fixed = false;
var sidemenu_lock = false;
var sidemenu_hide = false;
var isEditing = false;

function toggleSideMenu(close){
	new SimpleBar(document.getElementById('main_pages'));

	if(close){
		$('html').attr('data-fixed', "false");
	} else {
		if($('html').attr('data-fixed') == "true"){
			$('html').attr('data-fixed', "false");
			document.getElementById('tv_sidemenu_collapse_fixed').title = "Expandir menu";
		}else if($('html').attr('data-fixed') == "false"){
			$('html').attr('data-fixed', "true")
			document.getElementById('tv_sidemenu_collapse_fixed').title = "Retrair menu";
		}

		if($('html').attr('data-hide') == "true"){
			$('html').attr('data-hide', "false");
		}
	}
};

function fixSidemenu(){
	if(!sidemenu_fixed){
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_fixed.php",
			data: {fixed: true},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_fixed = true;

		if(sidemenu_lock){
			$('html').attr('data-lock', "false");

			if(document.getElementById("tv_sidemenu").classList.contains("instantopen")){
				document.getElementById("tv_sidemenu").classList.remove("instantopen");
			}

			$.ajax({
				type: "POST",
				url: Root + "/aux_sidemenu_lock.php",
				data: {lock: false},
				beforeSend:function(){},
				success: function(resposta){},
			});
			sidemenu_lock = false;
		}
	}else{
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_fixed.php",
			data: {fixed: false},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_fixed = false;
	}
};

function lockSidemenu(){
	if($('html').attr('data-lock') == "true"){
		$('html').attr('data-lock', "false");
	}else if($('html').attr('data-lock') == "false"){
		$('html').attr('data-lock', "true");
	}

	if(document.getElementById("tv_sidemenu").classList.contains("instantopen")){
		document.getElementById("tv_sidemenu").classList.remove("instantopen");
	}

	if(!sidemenu_lock){
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_lock.php",
			data: {lock: true},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_lock = true;
	}else{
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_lock.php",
			data: {lock: false},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_lock = false;
	}
};

function hideSidemenu(hide){
	if(hide){
		$('html').attr('data-hide', "true");
		document.getElementById("tv_sidemenu_show").classList.remove("d-none");
		document.getElementById("tv_sidemenu_show").classList.add("d-flex");
		document.getElementById("tv_sidemenu_collapse_fixed").classList.add("d-none");
		document.getElementById("tv_sidemenu_collapse_fixed").classList.remove("d-block");
	}else{
		$('html').attr('data-hide', "false");
		document.getElementById("tv_sidemenu_show").classList.remove("d-flex");
		document.getElementById("tv_sidemenu_show").classList.add("d-none");
		document.getElementById("tv_sidemenu_collapse_fixed").classList.remove("d-none");
		document.getElementById("tv_sidemenu_collapse_fixed").classList.add("d-block");
	}

	if(!sidemenu_hide){
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_hide.php",
			data: {hide: true},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_hide = true;
	}else{
		$.ajax({
			type: "POST",
			url: Root + "/aux_sidemenu_hide.php",
			data: {hide: false},
			beforeSend:function(){},
			success: function(resposta){},
		});
		sidemenu_hide = false;
	}

	console.log(sidemenu_hide);
};

function instantOpenSidemenu(){
	document.getElementById("tv_sidemenu").classList.add("instantopen");

	if($('html').attr('data-lock') == "true"){
		$('html').attr('data-lock', "false");
	}
};

function sidemenuMouseLeave() {
	if(sidemenu_lock == true) {
		$('html').attr('data-lock', "true");

		if(document.getElementById("tv_sidemenu").classList.contains("instantopen")){
			document.getElementById("tv_sidemenu").classList.remove("instantopen");
		}
	}
}

function alertDialogReset(){
	var size = document.getElementById("dialog_size");
	var msg = document.getElementById("dialog_msg");
	var btnClose = document.getElementById("dialog_btn_close");
	var btnCloseText = document.getElementById("dialog_btn_close_text");
	var btnAction = document.getElementById("dialog_btn");
	var btnActionText = document.getElementById("dialog_btn_text");

	msg.innerHTML = "";
	btnCloseText.innerHTML = "Cancelar";
	btnActionText.innerHTML = "";

	if(size.classList.contains("modal-sm")){
		size.classList.remove("modal-sm");
	}

	if(size.classList.contains("modal-lg")){
		size.classList.remove("modal-lg");
	}

	if(btnClose.classList.contains("d-none")){
		btnClose.classList.remove("d-none");
	}

	if(btnAction.classList.contains("btn-action--neutral")){
		btnAction.classList.remove("btn-action--neutral");
	}

	if(btnAction.classList.contains("btn-action--primary")){
		btnAction.classList.remove("btn-action--primary");
	}

	if(btnAction.classList.contains("btn-action--danger")){
		btnAction.classList.remove("btn-action--danger");
	}

	btnClose.onclick = null;
	btnAction.onclick = null;
}

function alertBanner(message){
	var banner = document.getElementById("alert_banner");
	var header = document.getElementById("tv_header");

	if(message == 500) {
		document.getElementById("banner_msg").innerHTML = "Uma ocorrência não prevista foi identificada no sistema. Por favor, entre em contato com a nossa equipe de suporte.";
	} else {
		document.getElementById("banner_msg").innerHTML = message;
	}

	if(!banner.classList.contains("tv-banner--active")) {
		banner.classList.add("tv-banner--active");
	}

	if(!header.classList.contains("tv-header--noshadow")) {
		header.classList.add("tv-header--noshadow");
	}
}

function alertBannerDismiss(){
	var banner = document.getElementById("alert_banner");
	var header = document.getElementById("tv_header");

	if(banner.classList.contains("tv-banner--active")) {
		banner.classList.remove("tv-banner--active");
	}

	if(header.classList.contains("tv-header--noshadow")) {
		header.classList.remove("tv-header--noshadow");
	}
}

function alertSnackbar(msg){
	var snackbar = document.getElementById("alert_snackbar");

	document.getElementById("snackbar_msg").innerHTML = msg;

	snackbar.classList.add("tv-snackbar--active");

	setTimeout(function(){
		snackbar.classList.remove("tv-snackbar--active");
	}, 4000);
}

function backHome(isLogin = false){
	if(!isLogin){
		window.location.href = Root + "/views/admin/home.php";
	} else {
		window.location.href = Root + "/index.html";
	}
	
}

function addUsage(id, url = "", newTab = false) {
	if(!isEditing) {
		if(newTab) {
			window.open(url, '_blank');
		} else {
			window.location.href = url;
		}
		
		// window.open(url, (newTab) ? '_blank' : '_self');
	} else {
		alertDialogReset();
		$('#alert_dialog').modal();
		document.getElementById("dialog_msg").innerHTML = "Deseja realmente cancelar a operação?";
		document.getElementById("dialog_btn_close_text").innerHTML = "Não";
		document.getElementById("dialog_btn_text").innerHTML = "Sim";
		document.getElementById("dialog_btn").classList.add("btn-action--danger");
		document.getElementById("dialog_btn").onclick = function(){ isEditing = false; addUsage(id, url) };
	}
}
