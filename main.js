// Variables Globales
var map, marqueurs = [], formes = [];
var idSon, carteUtilisee, dureeSon, nbTentatives, nbSons, identifiant = null;
var idsUtilises = [];
var boutonConfirmeClique = false;

$(document).ready(function () {
    $("#playButton").click(initGame);
    $("#nextSoundButton").click(prepareNextRound);
    $("#validateButton").click(function () {
        boutonConfirmeClique = true;
    });
    // $("#uploadButton").click(executerScripEnvoiSon);
});

function initGame() {
    let j = 0, objReponse, score = 0;
    initMap();
    initParams();
    $("#map").click(ajouterMarqueur); // Activation de la possibilité de poser un marqueur

    function waitForConfirmation() {
        return new Promise(resolve => {
            (function checkButton() {
                if (boutonConfirmeClique) {
                    boutonConfirmeClique = false; 
                    resolve();
                } else {
                    setTimeout(checkButton, 1); 
                }
            })();
        });
    }

    async function gameLoop() {
        while (j < nbSons) { //Boucle Partie
            idSon = genererIdSon(); 
            executerScriptJouerSon(); 
            for (let i = 1; i <= nbTentatives; i++) { //Un Son
                console.log("Itération Tentative : "+i);
                await waitForConfirmation();
                //$("#map").off('click');
                objReponse = await executerScriptDonneesSon();
                ajouterRectangle(objReponse);
                if(verifierPosSon(objReponse)){
                    score = score + addScore(i);
                    i=nbTentatives;
                } else {
                    console.log("Pas le bon emplacement");
                }
                console.log(score);
                console.log(objReponse);
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
            prepareNextRound()//TODO
            j++;
        }
        executerScriptEnvoiScore(score);
    }

    gameLoop(); // Boucle de jeu
}

function initParams(){
    switch($("#carte").val()){
        case 'ensim':
            carteUtilisee = 1;
            break;
        case 'univ':
            carteUtilisee = 2;
            break;
        default:
            carteUtilisee = -1;
    }
    nbTentatives = parseInt($("#sliderNbTentatives").val()); // récupérer le nombre de tentatives souhaitée
    dureeSon = $("#sliderDureeSons").val(); //Récupérer la durée des sons souhaitée
    dureeSon = dureeSon / 10;
    nbSons = parseInt($("#sliderNbSons").val()); //Récupérer le nombre de sons pour cette partie
    identifiant = $("#inputIdentifiant").val(); //Récupérer l'identifiant de l'utilisateur
    console.log("Nbtentatives: "+ nbTentatives + " DureeSon: "+ dureeSon + " nbSons: "+ nbSons + " Identifiant: "+ identifiant);
}//used

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
            map = L.map('map', {
                zoomSnap: 0.5
            }).setView([48.01675, 0.16000], 17);
            
            var corner1 = L.latLng(48.020192681819545, 0.15203201842398748);
            var corner2 = L.latLng(48.013931363239564, 0.16932292283386483);
            var mybounds = L.latLngBounds(corner1,corner2);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {   minZoom: 16.5,
                maxZoom: 19,
                bounds: mybounds,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
            map.setMaxBounds(mybounds);
            break;
    }
}//used

function ajouterMarqueur(event) {
    if(marqueurs.length>0){
        removeMarqueur(marqueurs[0]);// Pour n'avoir qu'un seul marqueur à la fois sur la carte en supprimant celui d'avant
    }
    var latlng = map.mouseEventToLatLng(event.originalEvent);   
    console.log(latlng);
    var marker = L.marker(latlng).addTo(map);
    marqueurs.push(marker);
}//used

function removeMarqueur(marker) {
    map.removeLayer(marker);
    var index = marqueurs.indexOf(marker);
    if (index !== -1) {
        marqueurs.splice(index, 1);
    }
}//used

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
}//used

function ajouterRectangle(objReponse){
    var bounds = [[objReponse.latRectHG,objReponse.lonRectHG],[objReponse.latRectBD,objReponse.lonRectBD]];
    rectangle = L.rectangle(bounds, {
        color: 'red',
        fillOpacity: 0.1,
    }).addTo(map);
    formes.push(rectangle);
}//used

function executerScriptDonneesSon(){
    var donnees = {
        idSon: idSon,
        carteUtilisee: carteUtilisee,
        dureeSon: dureeSon
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: "obtenirDonneesSon.php",
            type: "GET",
            data: donnees, 
            success: function(response){
                let objReponse = JSON.parse(response);
                resolve(objReponse); 
            },
            error: function(xhr){
                console.error(xhr.responseText);
                reject(xhr.responseText);
            }
        });
    });
}//used

function genererIdSon() {

    const nbSons = {
        ENSIM: {
            1: 25,
            2: 21,
            3: 17
        },
        Univ: {
            1: 18,
            2: 18,
            3: 16
        }
    };

    const maxId = carteUtilisee === 1 ? nbSons.ENSIM[dureeSon] : nbSons.Univ[dureeSon];

    function genererId() {
        let id = Math.floor(Math.random() * maxId) + 1;

        while (idsUtilises.includes(id)) {
            id = Math.floor(Math.random() * maxId) + 1;
        }
        idsUtilises.push(id);

        return id;
    }
    let retour = genererId();
    console.log("Id généré: "+retour);
    return retour;
}//used

function verifierPosSon(objReponse){
    if(formes[0].getBounds().contains(marqueurs[0].getLatLng())){
        var pos = L.latLng(objReponse.lieuLat, objReponse.lieuLon);
        var marker = L.marker(pos).addTo(map).bindPopup(objReponse.sonDescription).openPopup();
        marqueurs.push(marker); 
        map.flyTo(marker.getLatLng(), 19);
        return true;
    }
    return false;
}//used

function addScore(tentaActuelle){
    let score;
    switch(dureeSon){
        case 1:
            score = 100;
            break;
        case 2:
            score = 50;
            break;
        case 3:
            score = 30;
            break;
    }
    console.log("Tentative ajout score: "+ score);
    score = score / tentaActuelle;
    console.log("Tentative ajout score: "+ score);
    return score;
}

function prepareNextRound(){
    while (marqueurs.length > 0) {
        removeMarqueur(marqueurs[0]);
    }
    if (formes.length > 0) {
        map.removeLayer(formes.pop());
    }
    $("#map").click(ajouterMarqueur); // Réactiver la possibilité de poser un marqueur
}

function executerScriptEnvoiScore(score) {
    const data = {
        loginUser: identifiant,
        scoreUser: score,
        carteUtilisee: carteUtilisee
    };
    console.log("Envoi des données :", data); 

    $.ajax({
        url: "sendScore.php",
        type: "POST",
        data: data,
        success: function(response) {
            console.log(response);
        },
        error: function(xhr) {
            console.error(xhr.responseText);
        }
    });
}


// function executerScripEnvoiSon(){
//     $.ajax({
//         url: "envoiSon.php",
//         type: "POST",
//         success: function(response){
//             console.log(response);
//         },
//         error: function(xhr){
//             console.error(xhr.responseText);
//         }
//     });
// }
