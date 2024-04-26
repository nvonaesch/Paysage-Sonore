//Variables Globales
var map, marqueurs=[], formes=[];
var idSon = 2,carteUtilisee = 1, dureeSon = 3, cercle, distanceDifficulte=65;
// Difficile -> 10 / Normal -> 35 / Facile -> 65

//Définitions des events
$(document).ready(function (){
    $("#validateButton").click(initMap);
    $("#map").click(ajouterMarqueur);
    $("#uploadButton").click(executerScripEnvoiSon);
    $("#playButton").click(executerScriptJouerSon);
    $("#dataButton").click(executerScriptDonneesSon);
    $("#nextSoundButton").click(prepareNextRound);

});

//Fonctions
function initMap(){
    console.log($("#carte").val());

    switch($("#carte").val()){
        case 'ensim':
            map = L.map('map').setView([48, 0.155], 16.5);

            var imageUrl = 'https://raw.githubusercontent.com/nvonaesch/SoundGuessr/main/ENSIM.png';

            var imageBounds = [[48.0202384376636, 0.15263914776527002], [48.01398617421952, 0.16866589672434265]];
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
            var mybounds = L.latLngBounds(imageBounds[0], imageBounds[1]);
            map.setMaxBounds(mybounds);

            break;

        case 'univ':
            map = L.map('map').setView([48.01675, 0.16000], 16);
            
            var corner1 = L.latLng(48.020192681819545, 0.15203201842398748);
            var corner2 = L.latLng(48.013931363239564, 0.16932292283386483);
            var mybounds = L.latLngBounds(corner1,corner2);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {   minZoom: 17,
                maxZoom: 19,
                bounds: mybounds,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
            map.setMaxBounds(mybounds);
            break;
    }
}

function ajouterMarqueur(event) {
    if(marqueurs.length>0){
        removeMarqueur(marqueurs[0]);
    }
    var latlng = map.mouseEventToLatLng(event.originalEvent);
    console.log(latlng);
    var marker = L.marker(latlng).addTo(map);
    marqueurs.push(marker);
}

function removeMarqueur(marker) {
    map.removeLayer(marker);
    var index = marqueurs.indexOf(marker);
    if (index !== -1) {
        marqueurs.splice(index, 1);
    }
}

function executerScripEnvoiSon(){
    $.ajax({
        url: "envoiSon.php",
        type: "POST",
        success: function(response){
            console.log(response);
        },
        error: function(xhr){
            console.error(xhr.responseText);
        }
    });
}


function executerScriptJouerSon(){
    var url = 'jouerSon.php?idSon=' + idSon + '&carteUtilisee=' + carteUtilisee + '&dureeSon=' + dureeSon;
    var audioElement = document.createElement('audio');

    if (audioContainer.firstChild) {
        audioContainer.removeChild(audioContainer.firstChild);
    }

    audioElement.setAttribute('src', url); 
    audioElement.setAttribute('controls', 'controls');
    document.getElementById('audioContainer').appendChild(audioElement);
    audioElement.play();
}

function calculerDistance(objReponse){
    var pos = L.latLng(objReponse.lieuLat, objReponse.lieuLon);
    var marker = L.marker(pos);
    let distance = map.distance(marqueurs[0].getLatLng(),marker.getLatLng());    
    marqueurs.push(marker);
    console.log(distance);
    return distance;
}

function ajouterCercle(distance){
    cercle = L.circle(marqueurs[0].getLatLng(), {
        color: 'red',
        fillOpacity: 0.1,
        radius: distance+getApproximation(-40,40)
    }).addTo(map);
    formes.push(cercle);
}

function verifierPosSon(objReponse){
    switch(carteUtilisee){
        case 1:
            calculerDistance(objReponse);
            ajouterRectangle(objReponse)
            if(formes[0].getBounds().contains(marqueurs[0].getLatLng())){
                ajouterRectangle(objReponse)
                marqueurs[1].addTo(map).bindPopup(objReponse.sonDescription).openPopup();
                map.flyTo(marqueurs[1].getLatLng(), 19);
            }
            break;
        case 2:


            break;
    }
    distance = calculerDistance(objReponse);
}

function ajouterRectangle(objReponse){
    var bounds = [[objReponse.latRectHG,objReponse.lonRectHG],[objReponse.latRectBD,objReponse.lonRectBD]];
    rectangle = L.rectangle(bounds, {
        color: 'red',
        fillOpacity: 0.1,
    });
    formes.push(rectangle);
}


function executerScriptDonneesSon(){
    var donnees = {
        idSon: idSon,
        carteUtilisee: carteUtilisee,
        dureeSon: dureeSon
    };

    $.ajax({
        url: "obtenirDonneesSon.php",
        type: "GET",
        data: donnees, 
        success: function(response){
            $("#map").off('click');
            let objReponse = JSON.parse(response);
            $("#descriptionContainer").text(objReponse.sonDescription);
            verifierPosSon(objReponse);
        },
        error: function(xhr){
            console.error(xhr.responseText);
        }
    });
}

function prepareNextRound(){
    executerScriptEnvoiScore();
    for(index = 0; index<marqueurs.length;index){
        removeMarqueur(marqueurs[index]);
    }
    removeCircle();
    $("#map").click(ajouterMarqueur);
}

function getApproximation(min, max) {
    return Math.random() * (max - min) + min;
}

function removeCircle(){
    map.removeLayer(formes[0]);
    formes.pop();
}

function genererIdSon(){
    idSon = Math.floor(50*Math.random());
    console.log(idSon);
}

function getScore(){

}

function executerScriptEnvoiScore(){
    let loginUser = 'totot75', score = 6565;
    $.ajax({
        url: "sendScore.php?loginUser=" + loginUser + '&scoreUser=' + score,
        type: "POST",
        success: function(response){
            console.log(response);
        },
        error: function(xhr){
            console.error(xhr.responseText);
        }
    });
}