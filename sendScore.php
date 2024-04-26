<?php
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$loginUser = isset($_GET['loginUser']) ? $_GET['loginUser'] : '';
$scoreUser = isset($_GET['scoreUser']) ? intval($_GET['scoreUser']) : 0;
$pattern = '/^[a-zA-Z]{5}[0-9]{2}$/';

if(preg_match($pattern, $loginUser)){

    $sql = "INSERT INTO utilisateur (nom) VALUES (?) ON DUPLICATE KEY UPDATE nom = VALUES(nom)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $loginUser);
    if ($stmt->execute()) {
        echo "success.";
    } else {
        echo "ff " . $stmt->error;
    }
    $stmt->close();

    $sql = "INSERT INTO scores (user_id, score) VALUES ((SELECT id FROM utilisateur WHERE nom = ?), ?)";
    $stmt2 = $mysqli->prepare($sql);
    $stmt2->bind_param("si", $loginUser, $scoreUser);
    if ($stmt2->execute()) {
        echo "success.";
    } else {
        echo "ff" . $stmt2->error;
    }
    $stmt2->close();

} else {
    echo "L'envoi a échoué, le login n'est pas sous la bonne forme";
}

$mysqli->close();
?>
