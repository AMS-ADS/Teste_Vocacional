// Permitir somente números no input
function onlyNumbers(e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 188, 194]) !== -1 ||
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      ((e.keyCode == 65 || e.keyCode == 86 || e.keyCode == 67) && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
};

// Formata números adicionando duas casas decimais quando valor possui casa decimal ou é valor (reais)
function formatNumber(num, isvalue){
    if(num % 1 != 0 || isvalue){
        return num.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    }else{
        return num.toLocaleString('pt-br')
    }
}

function formatNumberToFront(num, decimal = 0, hideDecimal = false, round = false) {
    if(hideDecimal && num % 1 == 0) {
        return num.toLocaleString('pt-br')
    }

    if(!round) {
        let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (decimal || -1) + '})?');
        num = Number(num.toString().match(re)[0]);
    }

    return num.toLocaleString('pt-br', {minimumFractionDigits: decimal, maximumFractionDigits: decimal});
}

// Formata números decimais para enviar para o back
function formatNumberToBack(num){
    return num.toString().split(".").join("").replace(",", ".");
}


function validateCPF(cpf) {
	cpf = cpf.replace(/[^\d]+/g,'');
	if(cpf == '') return false;
	// Elimina CPFs invalidos conhecidos
	if (cpf.length != 11 ||
		cpf == "00000000000" ||
		cpf == "11111111111" ||
		cpf == "22222222222" ||
		cpf == "33333333333" ||
		cpf == "44444444444" ||
		cpf == "55555555555" ||
		cpf == "66666666666" ||
		cpf == "77777777777" ||
		cpf == "88888888888" ||
		cpf == "99999999999")
			return false;
	// Valida 1o digito
	add = 0;
	for (i=0; i < 9; i ++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
		rev = 11 - (add % 11);
		if (rev == 10 || rev == 11)
			rev = 0;
		if (rev != parseInt(cpf.charAt(9)))
			return false;
	// Valida 2o digito
	add = 0;
	for (i = 0; i < 10; i ++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(10)))
		return false;
	return true;
}

function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if(cnpj == '') return false;
    if (cnpj.length != 14)
        return false;
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;
}

function getMonths() {
    return [
        { id: '1', descricao: 'Janeiro', short: 'Jan' },
        { id: '2', descricao: 'Fevereiro', short: 'Fev' },
        { id: '3', descricao: 'Março', short: 'Mar' },
        { id: '4', descricao: 'Abril', short: 'Abr' },
        { id: '5', descricao: 'Maio', short: 'Maio' },
        { id: '6', descricao: 'Junho', short: 'Jun' },
        { id: '7', descricao: 'Julho', short: 'Jul' },
        { id: '8', descricao: 'Agosto', short: 'Ago' },
        { id: '9', descricao: 'Setembro', short: 'Set' },
        { id: '10', descricao: 'Outubro', short: 'Out' },
        { id: '11', descricao: 'Novembro', short: 'Nov' },
        { id: '12', descricao: 'Dezembro', short: 'Dez' }
    ]
}

function getWeeks() {
    return [
        { id: '1', descricao: '1ª Semana', inicio: 1, fim: 7 },
        { id: '2', descricao: '2ª Semana', inicio: 8, fim: 15 },
        { id: '3', descricao: '3ª Semana', inicio: 16, fim: 23 },
        { id: '4', descricao: '4ª Semana', inicio: 24, fim: 31 }
    ]
}

function formatWeek(num, month, format, numType) {
    let week = 0;
    if(numType == 'week') {
        week = num
    } else if(numType == 'day') {
        if(num >= 1 && num <= 7) {
            week = 1
        } else if(num >= 8 && num <= 15) {
            week = 2
        } else if(num >= 16 && num <= 23) {
            week = 3
        } else if(num >= 24 && num <= 31) {
            week = 4
        }
    }

    let monthFormat = '';
    let monthField = '';
    if(format.includes('#M')) {
        monthField = 'descricao';
        monthFormat = '#M';
    } else if (format.includes('#m')) {
        monthField = 'short';
        monthFormat = '#m';
    }
    
    let months = getMonths();
    let monthDescription = months.find(x => x.id == month)[monthField];
    let formatedWeek = format.replace('#', week + 'ª').replace(monthFormat, monthDescription);

    return formatedWeek
}

function openLogModal(){
    $("#log_modal").modal('show');
    if(document.getElementById("log_painel")) {
        var field = "log_painel";
    } else {
        var field = "log_ultimas_alteracoes";
    }

    $("#log_modal").on('shown.bs.modal', function() {
        document.getElementById(field).focus();
        $("#log_modal").off('shown.bs.modal');
    });
}

function openTooltip(e, val, log, size = 'large') {
    if(log) {
        document.getElementById("tas_tooltip_loguser").classList.remove('d-none');
        document.getElementById("tas_tooltip_logdata").classList.remove('d-none');
        document.getElementById("tas_tooltip_logvalue").classList.add("mt-3");
    } else {
        document.getElementById("tas_tooltip_loguser").classList.add('d-none');
        document.getElementById("tas_tooltip_logdata").classList.add('d-none');
        document.getElementById("tas_tooltip_logvalue").classList.remove("mt-3");
    }

    if(size == 'small') {
        document.getElementById("tas_tooltip").classList.add("small")
    } else {
        document.getElementById("tas_tooltip").classList.remove("small")
    }

    document.getElementById("tas_tooltip_logvalue").innerHTML = val;
    document.getElementById("tas_tooltip").classList.add("show");
    document.getElementById("tas_tooltip").style.top = mouseYPosition(e, 'tooltip') + "px";
    document.getElementById("tas_tooltip").style.left = mouseXPosition(e, 'tooltip') + "px";
}

function closeTooltip() {
    if(document.contains(document.getElementById("tas_tooltip"))) {
        document.getElementById("tas_tooltip").classList.remove("show");
    }
}

// Fechar context-menu e tooltip ao clicar fora do elemento
$(document).bind("click", function(event) {
    if(document.getElementById("tv-cmenu").classList.contains("show")){
        document.getElementById("tv-cmenu").classList.remove("show");
    }

    if(!event.target.closest('.dt-search-dropdown') && !event.target.classList.contains('dt-search-toggle') && document.querySelector(".dt-search-dropdown")) {
        document.querySelector(".dt-search-dropdown").classList.remove('show')
    }

    if(!event.target.classList.contains("tv-tooltip-btn") && !event.target.classList.contains("tv-tooltip-ref")) {
        if(document.contains(document.getElementById("tas_tooltip"))){
            if(document.getElementById("tas_tooltip").classList.contains("show")){
                document.getElementById("tas_tooltip").classList.remove("show");
            }
        }
    }

    if(document.getElementById('pronta-entrega-add-modal')) {
        if(!event.target.matches('.produto-add') && !event.target.closest('#pronta-entrega-add-modal')) {
            document.getElementById('pronta-entrega-add-modal').classList.add('d-none');
        }
    }
});

// Fechar context-menu e tooltip ao usar scroll
document.addEventListener('scroll', function (event) {
    if(document.getElementById("tv-cmenu").classList.contains("show")){
        document.getElementById("tv-cmenu").classList.remove("show");
    }
    
    if(document.querySelector(".dt-search-dropdown") && event.target != document && !event.target.closest('.dt-search-dropdown')) {
        document.querySelector(".dt-search-dropdown").classList.remove('show')
    }

    if(document.contains(document.getElementById("tas_tooltip"))){
        if(document.getElementById("tas_tooltip").classList.contains("show")){
            document.getElementById("tas_tooltip").classList.remove("show");
        }
    }
}, true);

// Pegar posição X do mouse para posicionar o elemento
function mouseXPosition(evt, el) {
    if(el == "cmenu"){
        var element = document.getElementById("tv-cmenu");
    }else if(el == "tooltip"){
        var element = document.getElementById("tas_tooltip");
    }

    var windowWidth = window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;

    var maxWidth = windowWidth - element.offsetWidth;

    if (evt.pageX) {
        if(evt.pageX + 10 > maxWidth) {
            if(evt.pageX - element.offsetWidth - 10 >= 0) {
                return evt.pageX - element.offsetWidth - 10
            } else {
                return 10
            }
        } else {
            return evt.pageX + 10;
        }
    }else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    }else{
        return null;
    }
}

// Pegar posição Y do mouse para posicionar o elemento
function mouseYPosition(evt, el) {
    if(el == "cmenu"){
        var element = document.getElementById("tv-cmenu");
    }else if(el == "tooltip"){
        var element = document.getElementById("tas_tooltip");
    }

    var windowHeight = window.innerHeight && document.documentElement.clientHeight ? Math.min(window.innerHeight, document.documentElement.clientHeight) : window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

    var maxHeight = windowHeight - element.offsetHeight;

    if(evt.pageY) {
        return (evt.pageY > maxHeight) ? evt.pageY - element.offsetHeight : evt.pageY;
    }else if (evt.clientY){
        return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    }else{
        return null;
    }
}

// Aplicar efeito de "debounce" em uma função Vue, impedindo-a de ser disparada várias vezes em um curto periodo de tempo
function debounce(vue, fn, timeoutId, timer = 300) {
    if(timeoutId !== null) {
        clearTimeout(timeoutId);
    }
    return setTimeout( _ => {
        fn.apply(vue);
    }, timer);
}


function focusNextField(field, nextField){
    var maxLength = field.getAttribute('maxlength');
    if(field.value.length == maxLength){
        nextField.focus();
    }
}

function openModalOnFocus(modal, field){
    $("#" + modal).modal('show');
    $("#" + modal).on('shown.bs.modal', function() {
        document.getElementById(field).focus();
    });
}

function toggleTasLoad(status, message){
    if(status == "show") {
        if(message != undefined || message != null) {
            document.getElementById("tv-load-message").classList.add("show");
            document.getElementById("tv-load-message").innerHTML = message;
        }

        if(!document.getElementById("tv-load").classList.contains("show")) {
            document.getElementById("tv-load").classList.add("show");
        }
    } else if(status  == "hide") {
        if(document.getElementById("tv-load-message").classList.contains("show")) {
            document.getElementById("tv-load-message").classList.remove("show");
            document.getElementById("tv-load-message").innerHTML = "";
        }

        if(document.getElementById("tv-load").classList.contains("show")) {
            document.getElementById("tv-load").classList.remove("show");
        }
    }
}

function renameObjKey(object, key, newKey) {
    var cloneObject = Object.assign({}, object);
    var targetKey = cloneObject[key];

    delete cloneObject[key];
    cloneObject[newKey] = targetKey;
    return cloneObject;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function toCamelCase(string) {
    string = string.split(' ')
    var newString = string

    if (string.length >= 3) {
        for (var i in string) {
            if (string[i].length <= 2) {
                string.splice(i, 1)
            }
        }
    }

    newString = string.join(' ')
    newString = newString.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')

    return newString
}

function toKebabCase(string) {
    string = string.split(' ')
    var newString = string

    if (string.length >= 3) {
        for (var i in string) {
            if (string[i].length <= 2) {
                string.splice(i, 1)
            }
        }
    }

    newString = string.join(' ');

    if(string.length > 1) {
        newString = newString.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(' ', '-')
    } else {
        // camelCase to kebab-case
        if(newString != newString.toLowerCase()) {
            newString = newString.replace(/[A-Z]/g, x => "-" + x.toLowerCase());

            if(newString.charAt(0) == '-') {
                newString = newString.substring(1);
            }
        }
    }

    return newString
}


function displayErrorsUtils (response, varError) {
    for (var i = 0; i < response.length; i++) {
        if(response[i].field != ""){
            var aux_id = response[i].field.replace(".", "_");
            varError[aux_id] = response[i].userMessage;
        }else{
            alertBanner(response[i].userMessage);
        }
    }
    focusScrollToError(varError)
}

// Deixa o focus no input que estiver com erro
function focusScrollToError(varError) {
    // for(const i in errorsObj) {
    //     if (errorsObj[i] != '') {
    //         document.getElementById(i).focus();
    //         document.getElementById(i).scrollIntoView();
    //         break;
    //     }
    // }

    var focus = false;
    for (var key in varError) {
        if (!focus && varError[key] !== "") {
            var element = document.getElementById(key);
            element.focus()
            if (element) {
                var size = element.getBoundingClientRect();
                var scroll = size.top + window.pageYOffset;
                var middle = scroll - (window.innerHeight / 2);
                window.scrollTo(0, middle);
                focus = true;
            }
        }
    }
}

function closeFilterColumnsDatatable(){
    var filtroColunaDatatable = document.getElementById("filtro_coluna_datatable")

    if(filtroColunaDatatable && filtroColunaDatatable.dataset.column != undefined){
        var columnName = filtroColunaDatatable.dataset.column
        
        if(document.querySelectorAll('.pe-params' + columnName).length == 0){
            document.getElementById('dropdownMenuFilterinput-search-' + columnName + '-column').parentElement.setAttribute('style', 'background-color: rgb(76, 76, 76);')
            document.getElementById('dropdownMenuFilterinput-search-' + columnName + '-column').classList.remove('btn-filter-columns__active')
        }
    }

    if(filtroColunaDatatable != undefined && filtroColunaDatatable.classList.contains("show")){
        filtroColunaDatatable.classList.remove("show");
    }
}