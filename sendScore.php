<?php
$conn = new mysqli('localhost', 'root', '', 'projettransversaux');
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$user = isset($_POST['loginUser']) ? $conn->real_escape_string($_POST['loginUser']) : NULL;
$carte = isset($_POST['carteUtilisee']) ? intval($_POST['carteUtilisee']) : 0;
$score = isset($_POST['scoreUser']) ? intval($_POST['scoreUser']) : 0;

if ($user === NULL || $carte === 0 || $score === 0) {
    die("Paramètres manquants ou invalides.");
}

$sql_count = "SELECT COUNT(*) AS nbScores FROM score WHERE userLogin = '$user' AND carteUtilisee = $carte";

$cptResultat = $conn->query($sql_count);

if ($cptResultat) {
    $cptLigne = $cptResultat->fetch_assoc();
    $nbScores = $cptLigne['nbScores'];
    
    if ($nbScores == 5) {
        $sql_min_score = "SELECT MIN(score) AS scoreMin FROM score WHERE userLogin = '$user' AND carteUtilisee = $carte";
        $result_min_score = $conn->query($sql_min_score);
        
        if ($result_min_score) {
            $row_min_score = $result_min_score->fetch_assoc();
            $scoreMin = $row_min_score['scoreMin'];

            if ($score > $scoreMin) {
                $updateScore = "UPDATE score SET score = $score WHERE userLogin = '$user' AND carteUtilisee = $carte AND score = $scoreMin";
                if ($conn->query($updateScore) === TRUE) {
                    echo "successLow";
                } else {
                    echo "erreurRemplacementMinimum" . $conn->error;
                }
            } else {
                echo "scorePlusPetitQueMinimum";
            }
        } else {
            echo "erreurExecutionRequete";
        }
    } else {
        $sql_insert_score = "INSERT INTO score (userLogin, score, carteUtilisee) VALUES ('$user', $score, $carte)";
        if ($conn->query($sql_insert_score) === TRUE) {
            echo "Score inséré avec succès.";
        } else {
            echo "erreurInsertionScore";
        }
    }
} else {
    echo "erreurExecutionRequeteComptage";
}

$conn->close();
?>
