<?php
    session_start();
    include '../../includes/route.php';
    include $root.'config/conn.php';

    $getAcao = $_GET['acao'] ?? '';
    $json = ['status' => '', 'userMessage' => '', 'data' => []];

    $sessionInstituicao = $_SESSION["instituicao"];

    $input = file_get_contents('php://input');
    $form = json_decode($input, true);

    try {
        if ($getAcao == 'getCursoSelect') {
            $sql = "SELECT * FROM curso WHERE instituicao = '$sessionInstituicao'";
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
                $json['userMessage'] = 'Falha ao adicionar o área.';
            }
        }
    } catch (PDOException $e) {
        http_response_code(500);
        $json['status'] = 'error';
        $json['userMessage'] = 'Erro do servidor: ' . $e->getMessage();
    }

    $conn = null;
    echo json_encode($json);
?>
