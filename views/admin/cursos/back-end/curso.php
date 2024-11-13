<?php
    session_start();
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

    $sessionUsuario = $_SESSION["usuario"];
    $sessionInstituicao = $_SESSION["instituicao"];

    $method = $_SERVER['REQUEST_METHOD'];

        try {
            function gerarCodigo($descricao) {
                $codigo = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $descricao), 0, 5));
                $codigo .= rand(100, 999);
                return $codigo;
            }

            function verificarCodigoExistente($conn, $codigo) {
                $sql = "SELECT COUNT(*) as total FROM curso WHERE codigo = :codigo";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':codigo', $codigo);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                return $result['total'] > 0;
            }

            if ($getAcao == 'addRecover') {
                $codigo = $form['codigo'] ?? '';
                $descricao = $form['descricao'] ?? '';
                $sobre = $form['sobre'] ?? '';
                $id = $form['id'];

                $sql = "SELECT usuario.instituicao FROM usuario LEFT JOIN curso ON curso.instituicao = '$sessionUsuario' WHERE usuario.usuario = '$sessionUsuario'";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $instituicaoAux = $stmt->fetch(PDO::FETCH_ASSOC);
                $instituicao = $instituicaoAux['instituicao'];

                $campos = [
                    'codigo' => $codigo,
                    'descricao' => $descricao,
                    'sobre' => $sobre
                ];
                
                foreach ($campos as $campo => $valor) {
                    validarCampo($json, $campo, $valor);
                }

                if (empty($json)) {
                    if ($method == 'PUT') {
                        $sql = "UPDATE curso SET codigo = :codigo, descricao = :descricao, instituicao = :instituicao, sobre = :sobre WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':codigo', $codigo);
                        $stmt->bindParam(':descricao', $descricao);
                        $stmt->bindParam(':sobre', $sobre);
                        $stmt->bindParam(':instituicao', $instituicao);
                        $stmt->bindParam(':id', $id);
                    } else {
                        $sql = "INSERT INTO curso (id, codigo, descricao, instituicao, sobre) VALUES (0, :codigo, :descricao, :instituicao, :sobre)";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':codigo', $codigo);
                        $stmt->bindParam(':descricao', $descricao);
                        $stmt->bindParam(':instituicao', $instituicao);
                        $stmt->bindParam(':sobre', $sobre);
                    }

                    if ($stmt->execute()) {
                        http_response_code($method == 'PUT' ? 200 : 201);
                        $json = [
                            'status' => $method == 'PUT' ? 200 : 201,
                            'userMessage' => $method == 'PUT' ? 'Pergunta atualizada com sucesso.' : 'Pergunta adicionada com sucesso.',
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

            if ($getAcao == 'getTableData') {
                $sql = "SELECT * FROM curso WHERE instituicao = '$sessionInstituicao'";
                $stmt = $conn->query($sql);

                if ($stmt->execute()) {
                    $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $json['data'] = [];

                    foreach ($cursos as $curso) {
                        $json['data'][] = [
                            'id' => $curso['id'],
                            'codigo' => $curso['codigo'],
                            'descricao' => $curso['descricao'],
                            'sobre' => $curso['sobre'],
                        ];
                    }
                    http_response_code(200);
                    $json['status'] = 200;
                    $json['userMessage'] = 'Dados recuperados com sucesso.';
                } else {
                    http_response_code(500);
                    $json[] = [
                        'userMessage' => 'Falha ao recuperar os dados.',
                        'developerMessage' => 'Erro ao executar a query de seleção.',
                        'errorCode' => 'database.select.error'
                    ];
                }
            }

            if ($getAcao == 'getCursoId') {
                if($getSubAcao == 'get') {
                    $sql = "SELECT * FROM curso WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':id', $getId);

                    if ($stmt->execute()) {
                        $curso = $stmt->fetch(PDO::FETCH_ASSOC);
                        if ($curso) {
                            $json = [
                                'status' => 200,
                                'userMessage' => 'Dados recuperados com sucesso.',
                                'data' => [
                                    'id' => $curso['id'],
                                    'codigo' => $curso['codigo'],
                                    'descricao' => $curso['descricao'],
                                    'instituicao' => $curso['instituicao'],
                                    'sobre' => $curso['sobre'],
                                ]
                            ];
                            http_response_code(200);
                        } else {
                            http_response_code(404);
                            $json[] = [
                                'status' => 404,
                                'userMessage' => 'Curso não encontrado.',
                                'developerMessage' => 'Nenhum curso com o ID fornecido foi encontrado.',
                                'errorCode' => 'user.notFound'
                            ];
                        }
                    } else {
                        http_response_code(500);
                        $json[] = [
                            'status' => 500,
                            'userMessage' => 'Falha ao recuperar os dados.',
                            'developerMessage' => 'Erro ao executar a query de seleção.',
                            'errorCode' => 'database.select.error'
                        ];
                    }
                } else {
                    $sql = "DELETE FROM curso WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':id', $getId);

                    if ($stmt->execute()) {
                        http_response_code(200);
                        $json = [
                            'status' => 200,
                            'userMessage' => 'Curso excluído com sucesso.'
                        ];
                    } else {
                        http_response_code(400);
                        $json[] = [
                            'status' => 400,
                            'userMessage' => 'Falha ao excluir o curso.',
                            'developerMessage' => 'Erro ao executar a query de exclusão.',
                            'errorCode' => 'user.delete.error'
                        ];
                    }
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