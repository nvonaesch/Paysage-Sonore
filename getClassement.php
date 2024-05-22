<?php
$conn = new mysqli('localhost', 'root', '', 'projettransversaux');
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

$sql = "SELECT userLogin, score FROM score ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$classement = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $classement[] = $row;
    }
} else {
    echo json_encode([]);
    exit();
}

echo json_encode($classement);

$conn->close();
?>
