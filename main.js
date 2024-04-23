//Variables Globales
var map, marqueurs=[];
var idSon = 1, objReponse, cercle;

// Difficile -> 10 / Normal -> 35 / Facile -> 65

var idSon = 1, objReponse;


//Définitions des events
$(document).ready(function (){
    $("#validateButton").click(initMap);
    $("#map").click(ajouterMarqueur);

    //$("#map").click(genererIdSon);

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
            map = L.map('map').setView([48, 0.155], 16.5);

            var imageUrl = 'https://raw.githubusercontent.com/nvonaesch/SoundGuessr/main/ENSIM.png';

            var imageUrl = 'https://raw.githubusercontent.com/nvonaesch/SoundGuessr/main/plan_ensim.png';

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
    //  setTimeout(function() {
    //      removeMarqueur(marker);
    // }, 5000);
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

function calculerDistance(){
    let distance = map.distance(marqueurs[0].getLatLng(),marqueurs[1].getLatLng())    
    console.log(distance);
    distance = 65;
    return distance;
}

function ajouterCercle(){
    cercle = L.circle(marqueurs[0].getLatLng(), {
        color: 'red',
        fillOpacity: 0.5,
        radius: calculerDistance()
    }).addTo(map);
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
            $("#map").off('click');
            objReponse = JSON.parse(response);
            $("#descriptionContainer").text(objReponse.sonDescription);
            var pos = L.latLng(objReponse.lieuLat, objReponse.lieuLon);
            var marker = L.marker(pos).addTo(map).bindPopup(objReponse.sonDescription);
            marqueurs.push(marker);
            //$("#map").click(ajouterMarqueur);
            ajouterCercle();
        },
        error: function(xhr){
            console.error(xhr.responseText);
        }
    });
}


function getApproximation(min, max) {
    return Math.random() * (max - min) + min;
}


function genererIdSon(){
    idSon = Math.floor(50*Math.random());
    console.log(idSon);
}