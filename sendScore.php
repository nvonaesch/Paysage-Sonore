<?php
$conn = new mysqli('localhost', 'root', '', 'projettransversaux');
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$user = isset($_POST['loginUser']) ? $conn->real_escape_string($_POST['loginUser']) : NULL;
$carte = isset($_POST['carteUtilisee']) ? intval($_POST['carteUtilisee']) : 0;
$score = isset($_POST['scoreUser']) ? intval($_POST['scoreUser']) : 0;

function validateIdentifiant($identifiant) {
    return preg_match('/^[a-zA-Z]{5}\d{2}$/', $identifiant);
}

if ($user && $carte) {
    if (!validateIdentifiant($user)) {
        die("Identifiant invalide. Il doit être composé de 5 caractères suivis de 2 chiffres.");
    }

    $sql_count = "SELECT COUNT(*) AS nbScores FROM score WHERE userLogin = '$user' AND carteUtilisee = $carte";
    $cptResultat = $conn->query($sql_count);

    if ($cptResultat) {
        $cptLigne = $cptResultat->fetch_assoc();
        $nbScores = $cptLigne['nbScores'];

        if ($nbScores >= 5) {
            $sql_min_score = "SELECT id, score FROM score WHERE userLogin = '$user' AND carteUtilisee = $carte ORDER BY score ASC LIMIT 1";
            $result_min_score = $conn->query($sql_min_score);

            if ($result_min_score) {
                $row_min_score = $result_min_score->fetch_assoc();
                $scoreMin = $row_min_score['score'];
                $minScoreId = $row_min_score['id'];

                if ($score > $scoreMin) {
                    $updateScore = "UPDATE score SET score = $score WHERE id = $minScoreId";
                    if ($conn->query($updateScore) === TRUE) {
                        echo "Score mis à jour avec succès.";
                    } else {
                        echo "Erreur lors de la mise à jour du score: " . $conn->error;
                    }
                } else {
                    echo "Le nouveau score est inférieur ou égal au score minimum actuel.";
                }
            } else {
                echo "Erreur lors de la récupération du score minimum: " . $conn->error;
            }
        } else {
            $sql_insert_score = "INSERT INTO score (userLogin, score, carteUtilisee) VALUES ('$user', $score, $carte)";
            if ($conn->query($sql_insert_score) === TRUE) {
                echo "Score inséré avec succès.";
            } else {
                echo "Erreur lors de l'insertion du score: " . $conn->error;
            }
        }
    } else {
        echo "Erreur lors de la récupération du nombre de scores: " . $conn->error;
    }
} else {
    echo "Paramètres manquants.";
}

$conn->close();
?>
