<?php
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$chemin_fichier_audio = 'C:\wamp64\www\indication_warning.mp3';
$chemin_fichier_photo = 'C:\wamp64\www\imagetest.png';
$nomSon = basename($chemin_fichier_audio,".mp3");
$donnees_audio = file_get_contents($chemin_fichier_audio);
$donnees_photo = file_get_contents($chemin_fichier_photo);
$pos_lat = 48.021156;
$pos_lon = 0.196822;
$idSon = 1;
$carteUtilisee = 1;
$descriptionSon  = "Pour des CM de droit après manger. On peut y retrouver les meillieurs gamer qui s'affrontent dans des duels épiques de Brawl Stars.";

$stmt = $mysqli->prepare("INSERT INTO son (nomSon, idSon, blobSon, posLat, posLon, carteUtilisee, descriptionSon, photoLieu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdsssdss", $nomSon, $idSon, $donnees_audio, $pos_lat, $pos_lon, $carteUtilisee, $descriptionSon, $donnees_photo);

if ($stmt->execute()) {
    echo "success.";
} else {
    echo "error : " . $stmt->error;
}

$stmt->close();
$mysqli->close();
?>