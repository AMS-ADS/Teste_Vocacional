<?php
    include '../../../../includes/route.php';
    include $root.'config/conn.php';
    include $root.'includes/funcoes.php';

    $getAcao = $_GET['acao'] ?? '';
    $json = [];

    $input = file_get_contents('php://input');
    $form = json_decode($input, true);

    try {
        if ($getAcao == 'getPergunta') {
            $sql = "SELECT * FROM pergunta";
            $stmt = $conn->prepare($sql);
        
            if ($stmt->execute()) {
                $perguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $json['data'] = [];
                foreach($perguntas as $pergunta) {
                    $json['data'][] =  [
                        'curso' => $pergunta['curso'],
                        'primeira' => $pergunta['primeira'],
                        'segunda' => $pergunta['segunda'],
                        'terceira' => $pergunta['terceira'],
                        'quarta' => $pergunta['quarta'],
                        'quinta' => $pergunta['quinta'],
                    ];
                }
                http_response_code(200);
            } else {
                http_response_code(500);
                $json[] = [
                    'status' => 500,
                    'userMessage' => 'Falha ao recuperar os dados.',
                    'developerMessage' => 'Erro ao executar a query de seleção.',
                    'errorCode' => 'database.select.error'
                ];
            }
        }
    } catch (PDOException $e) {
        http_response_code(500);
        $json[] = [
            'userMessage' => 'Erro no servidor. Por favor, tente novamente mais tarde.',
            'developerMessage' => 'Erro do servidor: ' . $e->getMessage(),
            'errorCode' => 'server.error'
        ];
    }

    $conn = null;
    echo json_encode($json);
?>
