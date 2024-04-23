<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SoundGuessr</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="js/libs/leaflet/leaflet.css">
    <script src="js/libs/leaflet/leaflet.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>
    <div id="choixUser">
        <label for="carte">Veuillez sélectionner une carte</label>
        <select name="carte" id="carte">
            <option value="ensim" selected>ENSIM</option>
            <option value="univ">Université du Mans</option>
        </select> 
        <button id="validateButton" type="button">Valider la carte</button>
    </div>
    <div id="audioContainer"></div>
    <div id="descriptionContainer"></div>
    <button id="uploadButton" type="button">Upload Sound</button>
    <button id="playButton" type="button">Play Sound</button>
    <button id="dataButton" type="button">Obtenir Données</button>
    <div id="map"></div>
    <script src="main.js"></script>
</body>
</html>
