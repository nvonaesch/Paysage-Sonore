<?php
//Duree Son -> 10s = 1, 20s = 2, 30s = 3
//CarteUtilisee -> 1 = ENSIM, 2 = Univ
$mysqli = new mysqli('localhost', 'root', '', 'projettransversaux');

if ($mysqli->connect_error) {
    die('Erreur de connexion à la base de données : ' . $mysqli->connect_error);
}

$chemin_fichier_audio = 'C:\wamp64\www\Son\Univ\30s\30s_P10.mp3';
$nomSon = basename($chemin_fichier_audio,".mp3");
$donnees_audio = file_get_contents($chemin_fichier_audio);
$pos_lat = 48.015066427984;
$pos_lon = 0.16179352998734;
$idSon = 19;
$dureeSon = 3;
$carteUtilisee = 2;
$descriptionSon  = "La salle de musique pour tout les étudiants de l'université et les plus âgés";
$latRectHG = 48.015192023507;
$lonRectHG = 0.16168355941772;   
$latRectBD = 48.014937243699;
$lonRectBD = 0.16192764043808;


$stmt = $mysqli->prepare("INSERT INTO son (sonNom, sonId, sonBin, sonDuree, lieuLat, lieuLon, carteUtilisee, sonDescription, latRectHG, lonRectHG, latRectBD, lonRectBD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdsdssdsssss", $nomSon, $idSon, $donnees_audio, $dureeSon, $pos_lat, $pos_lon, $carteUtilisee, $descriptionSon, $latRectHG, $lonRectHG, $latRectBD, $lonRectBD);

if ($stmt->execute()) {
    echo "success.";
} else {
    echo "error : " . $stmt->error;
}

$stmt->close();
$mysqli->close();
?>