<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        $twid = $formData['twitchID'];
        $stNm = strtolower($formData['streamerName']);
        $stDt = htmlspecialchars(strip_tags($formData['streamerDetails']), ENT_COMPAT);
        $stCl = $formData['streamerColor'];
        $stmt = $conn->prepare("INSERT INTO $dbname (twitchID, streamerName, streamerDetails, streamerColor) VALUES (:key1, :key2, :key3, :key4)");
        $stmt->bindParam(':key1', $twid, PDO::PARAM_INT);
        $stmt->bindParam(':key2', $stNm, PDO::PARAM_STR);
        $stmt->bindParam(':key3', $stDt, PDO::PARAM_STR);
        $stmt->bindParam(':key4', $stCl, PDO::PARAM_STR);
        $stmt->execute();
        $response = [
            "message" => "New record created successfully",
        ];
        echo json_encode($response);
        $conn = null;
    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
    }