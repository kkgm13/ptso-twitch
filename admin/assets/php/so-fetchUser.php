<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        if(isset($_POST['name'])){ // False
            $twitchName = $_POST['name'];
            $sql = "SELECT * FROM streamers WHERE streamerName = $twitchName";
        } else {
            $response = [
                "error" => "Unknown parameter value",
            ];
            echo json_encode($response);
            $conn = null;
            exit();
        }

        $stmt = $conn->prepare("SELECT * FROM streamers WHERE streamerName = :key1");
        $stmt->bindParam(':key1', $twitchName, PDO::PARAM_STR);
        $stmt->execute();
        $stmt = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($stmt);
        $conn = null;

    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
        $conn = null;
    }