<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paysage Sonore</title>
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
        <label for="sliderNbTentatives">NbTentatives</label>
        <input type="range" id="sliderNbTentatives"  min="1" max="3" step="1" value="1">*
        <label for="sliderDureeSons">DureeSons</label>
        <input type="range" id="sliderDureeSons" min="10" max="30" step="10" value="20">
        <label for="sliderNbSons">NBsons</label>
        <input type="range" id="sliderNbSons" min="5" max="15" step="5" value="5">
        <button id="playButton" type="button">Lancer une partie</button>
        <input type="text" id="inputIdentifiant">
    </div>
    <div id="audioContainer"></div>
    <!-- <button id="uploadButton" type="button">Upload Sound</button> -->
    <button id="validateButton" type="button">Valider</button>
    <div id="map"></div>
    <script src="main.js"></script>
</body>
</html>
