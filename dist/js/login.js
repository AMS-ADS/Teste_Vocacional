toggleForm('login');

function loginAccount() {
    const usuario = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    if (usuario === '') {
        document.querySelector('#username-container .form-field').classList.add('form-field--error');
        document.querySelector('#username-container .form-support').classList.remove('d-none');
        focusInput('username');
        toggleWarningMessage(false);
        return;
    } else if (senha === '') {
        document.querySelector('#password-container .form-field').classList.add('form-field--error');
        document.querySelector('#password-container .form-support').classList.remove('d-none');
        focusInput('password');
        toggleWarningMessage(false);
        return;
    }

    disableActions(true);
    toggleWarningMessage(false);
    authenticateUser(usuario, senha);
}

async function authenticateUser(usuario, senha) {
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, senha })
        });

        const result = await response.json();

        if (response.status == 200 && result.success) {
            document.getElementById('user_name').value = usuario;
            const form = document.getElementById('login-form');
            form.removeAttribute('onsubmit');
            form.setAttribute('action', 'home.php');
            form.submit();
        } else {
            handleLoginError(response.status, result);
        }
    } catch (error) {
        disableActions(false);
        toggleWarningMessage(true, 'Sistema temporariamente indisponível.');
    }
}

function handleLoginError(status, response) {
    let errorMessage = response.message;
    if (status === 401) {
        errorMessage = response.message === 'Senha incorreta.' ? 'Usuário ou senha inválidos' : response.message;
    } else if (status === 404) {
        errorMessage = response.message === 'Usuário não encontrado.' ? 'Usuário não encontrado' : response.message;
    } else if (status === 400) {
        errorMessage = response.message === 'Por favor, forneça o usuário e a senha.' ? 'Dados insuficientes' : response.message;
    }
    disableActions(false);
    toggleWarningMessage(true, errorMessage);
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const showIcon = document.getElementById('show-password-icon');
    const hideIcon = document.getElementById('hide-password-icon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        showIcon.classList.add('d-none');
        hideIcon.classList.remove('d-none');
    } else {
        passwordField.type = 'password';
        showIcon.classList.remove('d-none');
        hideIcon.classList.add('d-none');
    }
}

function toggleForm(form) {
    if (form === 'forgotPassword') {
        document.getElementById('login-template').classList.add('d-none');
        document.getElementById('forgot-password-template').classList.remove('d-none');
    } else {
        document.getElementById('login-template').classList.remove('d-none');
        document.getElementById('forgot-password-template').classList.add('d-none');
    }
}

function disableActions(disable) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = disable);
}

function toggleWarningMessage(show, message = '') {
    const warningElement = document.getElementById('warning-message');
    if (show) {
        warningElement.innerText = message;
        warningElement.classList.remove('d-none');
    } else {
        warningElement.classList.add('d-none');
    }
}

function focusInput(id) {
    document.getElementById(id).focus();
}

function sendEmailForgotPassword() {
	var email = document.getElementById('email').value;

	if(email == '') {
		document.querySelector('#email-container .form-field').classList.add('form-field--error');
		document.querySelector('#email-container .form-support').classList.remove('d-none');
		focusInput('email');
		return;
	}

	disableActions(true);

	var settings = {
		url: HIT10URL + "/usuario/forgotPassword?emailEncoded=" + email,
	  	metodo: "GET",
	  	async: false
  	};

	$.ajax(settings)
		.done(function (response) {
			disableActions(false);
			toggleWarningMessage(true, 'E-mail enviado com sucesso. <br>Verifique sua caixa de entrada ou spam.', true);
		})
		.fail(function (response) {
			disableActions(false);
			toggleWarningMessage(true, response.responseJSON[0].userMessage);
		});
}

function toggleForm(form) {
	toggleWarningMessage(false);

	if(form === 'login') {
		document.getElementById('email').value = '';
		blurInput('email');
		removeInputError('email');
		document.getElementById("forgot-password-template").classList.add('d-none');
		document.getElementById("login-template").classList.remove('d-none');

		if(window.innerWidth > 768) {
			document.getElementById('username').focus();
		}
	} else if(form === 'forgotPassword') {
		document.getElementById('username').value = '';
	    document.getElementById('password').value = '';
		blurInput('username');
		blurInput('password');
		removeInputError('username');
		removeInputError('password');
		document.getElementById("login-template").classList.add('d-none');
		document.getElementById("forgot-password-template").classList.remove('d-none');

		if(window.innerWidth > 768) {
			document.getElementById('email').focus();
		}
	}
}

function togglePassword() {
	if(document.getElementById("password").type === 'password') {
		document.getElementById("password").type = 'text';
		document.getElementById("show-password-icon").classList.add('d-none');
		document.getElementById("hide-password-icon").classList.remove('d-none');
	} else {
		document.getElementById("password").type = 'password';
		document.getElementById("show-password-icon").classList.remove('d-none');
		document.getElementById("hide-password-icon").classList.add('d-none');
	}
}

function disableActions(value) {
	document.getElementById('username').disabled = value;
    document.getElementById('password').disabled = value;
    document.getElementById('email').disabled = value;
    document.getElementById('btn-login').disabled = value;
    document.getElementById('btn-send-email').disabled = value;
    document.getElementById('btn-back-template').disabled = value;
    document.getElementById('btn-forgot-password').disabled = value;
}

function toggleWarningMessage(value, message, success) {
	var warningBlock = document.querySelector(`.login-form__warning`);
	var warningMessage = document.querySelector(`.login-form__warning p`);

	if(value) {
		warningBlock.classList.remove('d-none');
		warningMessage.innerHTML = message;

		if(success) {
			warningBlock.classList.add('login-form__warning--success');
		} else {
			warningBlock.classList.remove('login-form__warning--success');
		}
	} else {
		warningBlock.classList.add('d-none');
		warningMessage.innerHTML = "";
	}
}

// COMPONENTS
function focusInput(e) {
	document.querySelector(`#${e}`).select();
	document.querySelector(`#${e}-container .form-field`).classList.add('form-field--active');
	document.querySelector(`#${e}-container .form-field .form-outline`).classList.add('form-outline--focus');
	document.querySelector(`#${e}-container .form-field .form-outline`).classList.add('form-outline--active');
}

function blurInput(e) {
	document.querySelector(`#${e}-container .form-field .form-outline`).classList.remove('form-outline--focus');

	document.getElementById(e).value = document.getElementById(e).value.trim()

	if(document.querySelector(`#${e}`).value === '') {
		document.querySelector(`#${e}-container .form-field`).classList.remove('form-field--active');
		document.querySelector(`#${e}-container .form-field .form-outline`).classList.remove('form-outline--active');
	} else {
		removeInputError(e);
	}
}

function removeInputError(e) {
	document.querySelector(`#${e}-container .form-field`).classList.remove('form-field--error');
	document.querySelector(`#${e}-container .form-support`).classList.add('d-none');
}

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

	return array;
}

// function verificaLogado() {
// 	var settings = {
//         url: HIT10URL + "/check",
//         metodo: "GET",
//         envio: "",
//         async: false
//     };
//     sendUrl(settings,verificaLogadoCallBack);
// }
// function verificaLogadoCallBack(status, response) {
// 	var showLogin = document.querySelector('.login-wrapper')
	
// 	if(status == 200) {
// 		console.log('200')
// 		window.location.href = Root + "/home.php";
// 	}
// 	else {
// 		console.log('400')
// 		showLogin.classList.remove("d-none");
// 	}
// }

// verificaLogado()

function entrarTeste() {
	window.location.href = Root + '/views/teste/home.php';
}

function comecarTeste() {
	window.location.href = Root + '/views/teste/perguntas/pergunta.php';
}