<?php
    function adicionarErro(&$json, $campo, $mensagemUsuario, $codigoErro) {
        $json[] = [
            'userMessage' => $mensagemUsuario,
            'field' => $campo,
            'developerMessage' => "O campo $campo foi enviado vazio.",
            'errorCode' => $codigoErro
        ];
    }
    
    function validarCampo(&$json, $campo, $valor) {
        if (empty($valor)) {
            adicionarErro($json, $campo, 'Campo obrigatório', "$campo.empty");
        }
    }