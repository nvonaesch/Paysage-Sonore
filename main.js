//Variables Globales
var map, marqueurs=[];
var idSon = 1, objReponse;

//Définitions des events
$(document).ready(function (){
    $("#validateButton").click(initMap);
    $("#map").click(ajouterMarqueur);
    $("#map").click(genererIdSon);
    $("#uploadButton").click(executerScripEnvoiSon);
    $("#playButton").click(executerScriptJouerSon);
    $("#dataButton").click(executerScriptDonneesSon);
});

//Fonctions
function initMap(){
    console.log($("#carte").val());
    switch($("#carte").val()){
        case 'ensim':
            map = L.map('map').setView([48.01675, 0.16000], 16.2);

            var imageUrl = 'https://raw.githubusercontent.com/nvonaesch/SoundGuessr/main/plan_ensim.png';
            var imageBounds = [[48.01, 0.15], [48.0, 0.175]];
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
            L.maxZoom = 12;
            L.minZoom = 12;
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
    var latlng = map.mouseEventToLatLng(event.originalEvent);
    var marker = L.marker(latlng).addTo(map);
    marqueurs.push(marker);
    setTimeout(function() {
        removeMarqueur(marker);
    }, 5000);
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
        error: function(xhr, status, error){
            console.error(xhr.responseText);
        }
    });
}

function executerScriptJouerSon(){
    var url = 'jouerSon.php?idSon=' + idSon;
    var audioElement = document.createElement('audio');

    if (audioContainer.firstChild) {
        audioContainer.removeChild(audioContainer.firstChild);
    }

    audioElement.setAttribute('src', url); 
    audioElement.setAttribute('controls', 'controls');
    document.getElementById('audioContainer').appendChild(audioElement);
    audioElement.play();
}

function executerScriptDonneesSon(){
    var donnees = {
        idSon: idSon
    };

    $.ajax({
        url: "obtenirDonneesSon.php",
        type: "GET",
        data: donnees, 
        success: function(response){
            objReponse = JSON.parse(response);
             $("#descriptionContainer").text(objReponse.descriptionSon);
            // $("#descriptionContainer").text(objReponse.posLat);
            // $("#descriptionContainer").text(objReponse.posLon);
        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
        }
    });
}

function genererIdSon(){
    idSon = Math.floor(50*Math.random());
    console.log(idSon);
}