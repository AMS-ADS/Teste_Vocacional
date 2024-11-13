<?php
    include '../../includes/route.php';
    include $root.'includes/tv-header.php';
?>
<link rel="stylesheet" href="<?= $route ?>dist/css/_login-teste/login.css">

<div class="login-content">
        <div class="login-box">
            <main class="login-form">
                <div id="login-template">
                    <h2 class="login-form__message">Bem-vindo(a) ao Teste Vocacional. Informe as suas <br>credenciais para começar.</h2>

                    <form id="login-form" name="login-form" onsubmit="return false;" method="post">
                        <div id="username-container" class="form-container">
                            <div class="form-field">
                                <input id="username" name="username" aria-label="Digite seu usuário" type="text" class="form-control" autocomplete="username" spellcheck="false" onfocus="focusInput('username')" onblur="blurInput('username')">
                                <div class="form-outline">
                                    <div class="form-outline__prefix"></div>
                                    <div class="form-outline__middle">
                                        <label for="username" class="form-field__label">Nome</label>
                                    </div>
                                    <div class="form-outline__suffix"></div>
                                </div>
                            </div>
                            <div class="form-support d-none">
                                <span class="form-support__help-message form-support__error-message">Digite seu nome.</span>
                            </div>
                        </div>

                        <div id="email-container" class="form-container">
                            <div class="form-field form-field--suffix-icon">
                                <input id="email" name="email" aria-label="Digite seu e-mail" type="email" class="form-control" autocomplete="off" spellcheck="false" onfocus="focusInput('email')" onblur="blurInput('email')">
                                <div class="form-outline">
                                    <div class="form-outline__prefix"></div>
                                    <div class="form-outline__middle">
                                        <label for="email" class="form-field__label">E-mail</label>
                                    </div>
                                    <div class="form-outline__suffix"></div>
                                </div>
                            </div>
                            <div class="form-support d-none">
                                <span class="form-support__help-message form-support__error-message">Digite seu e-mail.</span>
                            </div>
                        </div>

                        <div id="telefone-container" class="form-container">
                            <div class="form-field">
                                <input id="telefone" name="telefone" aria-label="Digite seu usuário" type="text" class="form-control" autocomplete="telefone" spellcheck="false" onfocus="focusInput('telefone')" onblur="blurInput('telefone')">
                                <div class="form-outline">
                                    <div class="form-outline__prefix"></div>
                                    <div class="form-outline__middle">
                                        <label for="telefone" class="form-field__label">Telefone</label>
                                    </div>
                                    <div class="form-outline__suffix"></div>
                                </div>
                            </div>
                            <div class="form-support d-none">
                                <span class="form-support__help-message form-support__error-message">Digite seu telefone.</span>
                            </div>
                        </div>

                        <div class="login-form__action">
                            <button id="btn-login" type="submit" class="btn-action btn-action--contain login-form__submit" onclick="comecarTeste()" style="font-family: 'PixelGameFont';">
                                <span class="btn-action__label">COMEÇAR</span>
                                <div class="btn-action__underlay"></div>
                            </button>
                        </div>

                        <input id="permissions" name="permissions" hidden>
                        <input id="user_name" name="user_name" hidden>
                    </form>
                </div>
            </main>
        </div>
    </div>

<script src="<?= $route ?>dist/js/login.js"></script>

<?php include $root.'includes/tv-footer.php'; ?>