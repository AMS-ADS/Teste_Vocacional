<?php
    include '../../../../includes/route.php';
    include $root.'config/conn.php';
    include $root.'includes/funcoes.php';

    $getAcao = $_GET['acao'] ?? '';
    $getSubAcao = $_GET['subacao'] ?? '';
    $getId = $_GET['id'] ?? '';
    $getDescricao = $_GET['descricao'] ?? '';
    $json = [];

    $input = file_get_contents('php://input');
    $form = json_decode($input, true);

    $method = $_SERVER['REQUEST_METHOD'];

    try {
        if ($getAcao == 'addRecover') {
            $primeira = $form['primeira'] ?? '';
            $segunda = $form['segunda'] ?? '';
            $terceira = $form['terceira'] ?? '';
            $quarta = $form['quarta'] ?? '';
            $quinta = $form['quinta'] ?? '';
            $id = $form['id'];
            $curso = $form['curso'] ?? '';
        
            $campos = [
                'primeira' => $primeira,
                'segunda' => $segunda,
                'terceira' => $terceira,
                'quarta' => $quarta,
                'quinta' => $quinta,
            ];
            
            foreach ($campos as $campo => $valor) {
                validarCampo($json, $campo, $valor);
            }
        
            if (empty($json)) {
                $sql = "SELECT COUNT(*) FROM pergunta WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $perguntaExiste = $stmt->fetchColumn();
        
                if ($perguntaExiste) {
                    $sql = "UPDATE pergunta SET primeira = :primeira, segunda = :segunda, terceira = :terceira, quarta = :quarta, quinta = :quinta WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':primeira', $primeira);
                    $stmt->bindParam(':segunda', $segunda);
                    $stmt->bindParam(':terceira', $terceira);
                    $stmt->bindParam(':quarta', $quarta);
                    $stmt->bindParam(':quinta', $quinta);
                    $stmt->bindParam(':id', $id);
                } else {
                    $sql = "INSERT INTO pergunta (id, primeira, segunda, terceira, quarta, quinta, curso) 
                            VALUES (0, :primeira, :segunda, :terceira, :quarta, :quinta, :curso)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':primeira', $primeira);
                    $stmt->bindParam(':segunda', $segunda);
                    $stmt->bindParam(':terceira', $terceira);
                    $stmt->bindParam(':quarta', $quarta);
                    $stmt->bindParam(':quinta', $quinta);
                    $stmt->bindParam(':curso', $curso);
                }
        
                if ($stmt->execute()) {
                    http_response_code($perguntaExiste ? 200 : 201);
                    $json = [
                        'status' => $perguntaExiste ? 200 : 201,
                        'userMessage' => $perguntaExiste ? 'Curso atualizado com sucesso.' : 'Curso adicionado com sucesso.'
                    ];
                } else {
                    http_response_code(500);
                    $json[] = [
                        'userMessage' => 'Falha ao salvar o curso.',
                        'developerMessage' => 'Erro ao executar a query de inserção/atualização no banco de dados.',
                        'errorCode' => 'database.save.error'
                    ];
                }
            } else {
                http_response_code(400);
            }
        }

        if ($getAcao == 'getPerguntaId') {
            $sql = "SELECT * FROM pergunta WHERE curso = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $getId);
        
            if ($stmt->execute()) {
                $pergunta = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($pergunta) {
                    $json = [
                        'status' => 200,
                        'userMessage' => 'Pergunta recuperada com sucesso.',
                        'data' => [
                            'id' => $pergunta['id'],
                            'primeira' => $pergunta['primeira'],
                            'segunda' => $pergunta['segunda'],
                            'terceira' => $pergunta['terceira'],
                            'quarta' => $pergunta['quarta'],
                            'quinta' => $pergunta['quinta'],
                        ]
                    ];
                } else {
                    $json = [
                        'status' => 200,
                        'userMessage' => 'Não tem pergunta',
                        'data' => [
                            'id' => 0,
                            'primeira' => '',
                            'segunda' => '',
                            'terceira' => '',
                            'quarta' => '',
                            'quinta' => '',
                        ]
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
        

        if($getAcao == 'getCodigo') {
            $codigo = gerarCodigo($getDescricao);

            while (verificarCodigoExistente($conn, $codigo)) {
                $codigo = gerarCodigo($descricao);
            }

            http_response_code(200);
            $json['data'] = $codigo;
            $json['status'] = 200;
            $json['userMessage'] = 'Código gerado com sucesso.';
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
