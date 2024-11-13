<?php
    include '../../../../includes/route.php';
    include $root.'config/conn.php';
    include $root.'includes/funcoes.php';

    $getAcao = $_GET['acao'] ?? '';
    $getSubAcao = $_GET['subacao'] ?? '';
    $getId = $_GET['id'] ?? null;
    $json = [];

    $input = file_get_contents('php://input');
    $form = json_decode($input, true);

    $method = $_SERVER['REQUEST_METHOD'];

    try {
        if ($getAcao == 'addRecover') {
            $login = $form['login'] ?? '';
            $senha = $form['senha'] ?? '';
            $nome = $form['nome'] ?? '';
            $email = $form['email'] ?? '';
            $nivelAcesso = isset($form['nivelAcesso']) ? $form['nivelAcesso'] : null;
            $instituicao = $form['instituicao'] ?? '';
            $curso = $form['curso'] ?? '';

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $json[] = [
                    'userMessage' => 'E-mail inválido.',
                    'field' => 'email',
                    'developerMessage' => 'O valor fornecido para o campo email não é válido.',
                    'errorCode' => 'email.invalid'
                ];
            }

            if($curso == null) {
                $curso = 0;
            }

            $campos = [
                'login' => $login,
                'email' => $email,
                'senha' => $senha,
                'nome' => $nome,
                'instituicao' => $instituicao,
            ];
            
            foreach ($campos as $campo => $valor) {
                validarCampo($json, $campo, $valor);
            }

            if (empty($json)) {
                if ($method == 'PUT') {
                    $sql = "UPDATE usuario SET nome = :nome, email = :email, senha = :senha, nivelAcesso = :nivelAcesso, instituicao = :instituicao, curso = :curso WHERE usuario = :login";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':login', $login);
                    $stmt->bindParam(':nome', $nome);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':senha', $senha);
                    $stmt->bindParam(':nivelAcesso', $nivelAcesso);
                    $stmt->bindParam(':instituicao', $instituicao);
                    $stmt->bindParam(':curso', $curso);
                } else {
                    $sql = "INSERT INTO usuario (usuario, nome, email, senha, nivelAcesso, instituicao, curso) 
                            VALUES (:login, :nome, :email, :senha, :nivelAcesso, :instituicao, :curso)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':login', $login);
                    $stmt->bindParam(':nome', $nome);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':senha', $senha);
                    $stmt->bindParam(':nivelAcesso', $nivelAcesso);
                    $stmt->bindParam(':instituicao', $instituicao);
                    $stmt->bindParam(':curso', $curso);
                }

                if ($stmt->execute()) {
                    http_response_code($method == 'PUT' ? 200 : 201);
                    $json = [
                        'status' => $method == 'PUT' ? 200 : 201,
                        'userMessage' => $method == 'PUT' ? 'Usuário atualizado com sucesso.' : 'Usuário adicionado com sucesso.',
                        'data' => [
                            'login' => $login,
                            'nome' => $nome,
                            'email' => $email,
                            'nivelAcesso' => $nivelAcesso,
                            'instituicao' => $instituicao
                        ]
                    ];
                } else {
                    http_response_code(500);
                    $json[] = [
                        'userMessage' => 'Falha ao salvar o usuário.',
                        'developerMessage' => 'Erro ao executar a query de inserção/atualização no banco de dados.',
                        'errorCode' => 'database.save.error'
                    ];
                }
            } else {
                http_response_code(400);
            }
        }        

        if ($getAcao == 'getTableData') {
            $sql = "SELECT usuario.usuario, usuario.nome, usuario.email, usuario.nivelAcesso, usuario.instituicao, 
                           IFNULL(curso.descricao, 'Sem curso') AS curso
                    FROM usuario
                    LEFT JOIN curso ON usuario.curso = curso.id";
            $stmt = $conn->query($sql);
        
            if ($stmt->execute()) {
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $json['data'] = [];
        
                foreach ($usuarios as $usuario) {
                    $json['data'][] = [
                        'login' => $usuario['usuario'],
                        'nome' => $usuario['nome'],
                        'email' => $usuario['email'],
                        'nivelAcesso' => json_decode($usuario['nivelAcesso']),
                        'instituicao' => $usuario['instituicao'],
                        'curso' => $usuario['curso']
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
        

        if ($getAcao == 'getUsuarioId') {
            if($getSubAcao == 'get') {
                $sql = "SELECT * FROM usuario WHERE usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $getId);

                if ($stmt->execute()) {
                    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($usuario) {
                        $json = [
                            'status' => 200,
                            'userMessage' => 'Dados recuperados com sucesso.',
                            'data' => [
                                'login' => $usuario['usuario'],
                                'nome' => $usuario['nome'],
                                'email' => $usuario['email'],
                                'senha' => $usuario['senha'],
                                'nivelAcesso' => json_decode($usuario['nivelAcesso']),
                                'instituicao' => $usuario['instituicao'],
                                'curso' => $usuario['curso']
                            ]
                        ];
                        http_response_code(200);
                    } else {
                        http_response_code(404);
                        $json[] = [
                            'status' => 404,
                            'userMessage' => 'Usuário não encontrado.',
                            'developerMessage' => 'Nenhum usuário com o ID fornecido foi encontrado.',
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
                $sql = "DELETE FROM usuario WHERE usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $getId);

                if ($stmt->execute()) {
                    http_response_code(200);
                    $json = [
                        'status' => 200,
                        'userMessage' => 'Usuário excluído com sucesso.'
                    ];
                } else {
                    http_response_code(400);
                    $json[] = [
                        'status' => 400,
                        'userMessage' => 'Falha ao excluir o usuário.',
                        'developerMessage' => 'Erro ao executar a query de exclusão.',
                        'errorCode' => 'user.delete.error'
                    ];
                }
            }
        }

        if ($getAcao == 'getCursoSelect') {
            $getInstituicao = $_GET['instituicao'];
            $sql = "SELECT * FROM curso WHERE instituicao = '$getInstituicao'";
            $stmt = $conn->query($sql);

            if ($stmt->execute()) {
                $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($cursos as $curso) {
                    $json['data'][] = [
                        'id' => $curso['id'],
                        'codigo' => $curso['codigo'],
                        'descricao' => $curso['descricao']
                    ];
                }
             
                http_response_code(200);
                $json['status'] = 'success';
                $json['userMessage'] = 'Curso recuperado com sucesso.';
            } else {
                http_response_code(404);
                $json['status'] = 'error';
                $json['userMessage'] = 'Falha ao recuperar o curso.';
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
