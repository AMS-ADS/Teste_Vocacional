<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$host = 'localhost';
$dbname = 'teste-vocacional';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Falha na conexão: ' . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Dados JSON inválidos.']);
    exit();
}

if (isset($data->usuario) && isset($data->senha)) {
    $usuario = $data->usuario;
    $senha = $data->senha;

    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE usuario = :usuario");
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $_SESSION["usuario"] = $user['usuario'];
        $_SESSION["nome"] = $user['nome'];
        $_SESSION["nivelAcesso"] = $user['nivelAcesso'];
        $_SESSION["instituicao"] = $user['instituicao'];
        $_SESSION["curso"] = $user['curso'];

        if ($senha == $user['senha']) {
            echo json_encode(['success' => true, 'message' => 'Login bem-sucedido!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Senha incorreta.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Por favor, forneça o usuário e a senha.']);
}
?>
