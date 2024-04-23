<?php
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$idSon = isset($_GET['idSon']) ? intval($_GET['idSon']) : 0;

if ($idSon <= 0) {
    echo json_encode(array('error' => 'ID de son invalide.'));
    exit;
}

$data = array();

$sql = "SELECT lieuLat, lieuLon, sonDescription FROM son WHERE sonId = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $idSon);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $data['lieuLat'] = $row['lieuLat'];
    $data['lieuLon'] = $row['lieuLon'];
    $data['sonDescription'] = $row['sonDescription'];
} else {
    $data['error'] = "Aucun son trouvé en bdd.";
}

$stmt->close();
$mysqli->close();
echo json_encode($data);
?>