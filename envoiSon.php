<?php
//Duree Son -> 10s = 1, 20s = 2, 30s = 3
//CarteUtilisee -> 1 = ENSIM, 2 = Univ
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$chemin_fichier_audio = 'C:\wamp64\www\Son\ENSIM\10s\10s_son_ping_pong.mp3';
$nomSon = basename($chemin_fichier_audio,".mp3");
$donnees_audio = file_get_contents($chemin_fichier_audio);
$pos_lat = 48.01517611475398;
$pos_lon = 0.16347527503967288;
$idSon = 25;
$dureeSon = 1;
$carteUtilisee = 1;
$descriptionSon  = "Venez nous défier (Léo et Nicolas)";

$stmt = $mysqli->prepare("INSERT INTO son (sonNom, sonId, sonBin, sonDuree, lieuLat, lieuLon, carteUtilisee, sonDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdsdssds", $nomSon, $idSon, $donnees_audio, $dureeSon, $pos_lat, $pos_lon, $carteUtilisee, $descriptionSon);

if ($stmt->execute()) {
    echo "success.";
} else {
    echo "error : " . $stmt->error;
}

$stmt->close();
$mysqli->close();
?>