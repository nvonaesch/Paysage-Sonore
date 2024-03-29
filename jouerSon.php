<?php
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$idSon = intval($_GET['idSon']);


$sql = "SELECT blobSon FROM son WHERE idSon = $idSon";
$stmt = $mysqli->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $son = $row["blobSon"];

    $temp_file = tempnam(sys_get_temp_dir(), 'sound');
    file_put_contents($temp_file, $son);

    header('Content-Type: audio/mpeg');
    readfile($temp_file);

    unlink($temp_file);
} else {
    echo "Aucun son trouvé en base de données.";
}

$stmt->close();
$mysqli->close();
?>
