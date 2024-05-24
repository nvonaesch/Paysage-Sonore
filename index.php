<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paysage Sonore</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="js/libs/leaflet/leaflet.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/libs/leaflet/leaflet.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <div id="background"></div>
    <div id="play"> 
        <button class="playButton"></button> 
    </div>
    <div id="select"> 
        <select id="carte">
            <option value="ensim">ENSIM</option> 
            <option value="univ">Université du Mans</option> 
        </select>
        <button id="rankButton" type="button">Afficher le classement</button>
    </div>
    
    <div id="identifiant"> 
        <label for="myInput">Entrez votre identifiant personnel (5 caractères et 2 chiffres):</label> 
        <input type="text" id="myInput"> 
    </div>
    
    <div id="param"> 
        <div class="containerNbSons"> 
            <label for="containerNbSons">Choisir le nombre de sons pour cette partie:</label><br /> 
            <input type="range" id="sliderNbSons" min="5" max="15" value="10" step="5" oninput="slider()"> 
            <div id="slider-value">0</div>
        </div>
        <div class="containerDurSons">
            <label for="containerDurSons">Choisir la durée des sons pour cette partie:</label><br /> 
            <input type="range" id="sliderDureeSons" min="10" max="30" value="20" step="10" oninput="slider()"> 
            <div id="slider-value2">0</div>
        </div>
        <div class="containerNbTentatives"> 
            <label for="containerNbTentatives">Choisir le nombre de tentatives pour cette partie:</label><br /> 
            <input type="range" id="sliderNbTentatives" min="1" max="3" value="2" step="1" oninput="slider()"> 
            <div id="slider-value3">0</div> 
        </div>
    </div>
    <!-- <button id="uploadButton">UploadSon</button> -->

    <div id="containerGlobal">
        <div id="containerTexte" class="containerTexte">
            <p id="tentativeText" class="tentativeText"></p>
        </div>
        <div id="audioContainer"></div>
        <button id="validateButton" type="button"><i class="fas fa-check"></i></button>
        <button id="nextSoundButton" type="button">Passer au prochain son</button>
    </div>

    <div id="map"></div>
    <script src="main.js"></script>
</body>
</html>
