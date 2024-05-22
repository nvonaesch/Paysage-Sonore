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
    <div id="background"></div>
    <div id="play"> 
        <button class="playButton"></button> 
    </div>
    <div id="select"> 
        <select id="carte">
            <option value="univ">Université du Mans</option> 
            <option value="ensim">ENSIM</option> 
        </select>
    </div>
    
    <div id="identifiant"> 
        <label for="myInput">Entrez votre identifiant personnel (5 Majuscules et 2 chiffres):</label> 
        <input type="text" id="myInput"> 
    </div>
    
    <div id="param"> 
        <div class="container"> 
            <label for="container">Choisir le nombre de sons pour cette partie:</label><br /> 
            <input type="range" id="sliderNbSons" min="5" max="15" value="10" step="5" oninput="slider()"> 
            <div id="slider-value">0</div>
        </div>
        <div class="container2">
            <label for="container2">Choisir la durée des sons pour cette partie:</label><br /> 
            <input type="range" id="sliderDureeSons" min="10" max="30" value="20" step="10" oninput="slider()"> 
            <div id="slider-value2">0</div>
        </div>
        <div class="container3"> 
            <label for="container3">Choisir le nombre de tentatives pour cette partie:</label><br /> 
            <input type="range" id="sliderNbTentatives" min="1" max="3" value="2" step="1" oninput="slider()"> 
            <div id="slider-value3">0</div> 
        </div>
    </div>
    
    <div id="audioContainer"></div>
    <div id="classementContainer"></div>
    <button id="rankButton" type="button">Afficher le classement</button>
    <button id="validateButton" type="button">Valider</button>
    <button id="nextSoundButton" type="button">Passer au prochain son</button>
    <div id="map"></div>
    <script src="main.js"></script>
</body>
</html>
