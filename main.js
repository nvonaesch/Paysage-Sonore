// Variables Globales
var map, marqueurs = [], formes = [];
var idSon, carteUtilisee, dureeSon, nbTentatives, nbSons, identifiant = null;
var idsUtilises = [];
var boutonConfirmeClique = false, boutonNextClique = false;


$(document).ready(function () {
    $('.container').show();
    $('.container2').show();
    $('.container3').show();
    slider();
    $(".playButton").click(function() {
        if (validateIdentifiant()) {
            $("#identifiant").remove();
            $("#play").remove();
            $("#background").remove();
            initGame();
        }
    });
    $("#nextSoundButton").click(prepareNextRound);
    $("#validateButton").click(function () {
        boutonConfirmeClique = true;
    });
    $("#nextSoundButton").click(function () {
        boutonNextClique = true;
    });
    $("#rankButton").click(toggleClassement);
});

function slider() {
    const mySlider = document.getElementById("sliderDureeSons");
    const sliderValue = document.getElementById("slider-value");
    const mySlider2 = document.getElementById("sliderNbSons");
    const sliderValue2 = document.getElementById("slider-value2");
    const mySlider3 = document.getElementById("sliderNbTentatives");
    const sliderValue3 = document.getElementById("slider-value3");

    valPercent = (mySlider.value / mySlider.max) * 100;
    mySlider.style.background = `linear-gradient(to right, #3264fe ${valPercent}%, #d5d5d5 ${valPercent}%)`;
    sliderValue.textContent = mySlider.value;
    
    valPercent2 = (mySlider2.value / mySlider2.max) * 100;
    mySlider2.style.background = `linear-gradient(to right, #3264fe ${valPercent2}%, #d5d5d5 ${valPercent2}%)`;
    sliderValue2.textContent = mySlider2.value;
    
    valPercent3 = (mySlider3.value / mySlider3.max) * 100;
    mySlider3.style.background = `linear-gradient(to right, #3264fe ${valPercent3}%, #d5d5d5 ${valPercent3}%)`;
    sliderValue3.textContent = mySlider3.value;
}//used merdique faite par Léo -> 0/20

function validateIdentifiant() {
    const identifiantPattern = /^[a-zA-Z]{5}\d{2}$/;
    identifiant = $("#myInput").val();

    if (!identifiantPattern.test(identifiant)) {
        alert("Identifiant invalide. Il doit être composé de 5 caractères suivis de 2 chiffres.");
        return false;
    }

    return true;
}//used

function initGame() {
    let j = 0, objReponse, score = 0;
    initMap();
    initParams();
    $("#map").off('click', ajouterMarqueur).on('click', ajouterMarqueur);

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

    function waitForNextButton() {
        return new Promise(resolve => {
            (function checkButton() {
                if (boutonNextClique) {
                    boutonNextClique = false;
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
                    formes[0].addTo(map);
                    score = score + addScore(i);
                    i=nbTentatives;
                } else {
                    console.log("Pas le bon emplacement");
                }
                console.log(score);
                console.log(objReponse);
            }
            await waitForNextButton();
            prepareNextRound();
            j++;
        }
        executerScriptEnvoiScore(score);
    }

    gameLoop(); // Boucle de jeu
}//used

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
            var imageUrl = 'https://raw.githubusercontent.com/nvonaesch/SoundGuessr/main/ENSIM_Colorie.png';
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
    });
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
}//used

function prepareNextRound() {
    while (marqueurs.length > 0) {
        removeMarqueur(marqueurs[0]);
    }
    if (formes.length > 0) {
        map.removeLayer(formes.pop());
    }

    // Détacher tout écouteur précédent et en attacher un nouveau
    $("#map").off('click', ajouterMarqueur).on('click', ajouterMarqueur);
}//used

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
}//used

function toggleClassement() {
    let classementContainer = $("#classementContainer");
    
    if (classementContainer.is(":visible")) {
        classementContainer.hide();
    } else {
        executerScriptObtentionClassement();
    }
}//used

function executerScriptObtentionClassement() {
    $.ajax({
        url: "getClassement.php",
        type: "GET", 
        success: function(response) {
            let classement = JSON.parse(response);
            afficherClassement(classement);
            $("#classementContainer").show();
        },
        error: function(xhr) {
            console.error(xhr.responseText);
        }
    });
}//used

function afficherClassement(classement) {
    let classementContainer = $("#classementContainer");
    classementContainer.empty(); 
    classement.forEach((entry, index) => {
        classementContainer.append(`<div>${index + 1}. ${entry.userLogin} - ${entry.score}</div>`);
    });
}//used

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
