<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        $twid =  $formData['twitchID'];
        $stNm = strtolower($formData['streamerName']);
        $stDt = htmlspecialchars(strip_tags($formData['streamerDetails']), ENT_COMPAT);
        $stCl = $formData['streamerColor'];
        $stmt = $conn->prepare("UPDATE $dbname SET streamerName = :key2, streamerDetails = :key3, streamerColor = :key4, WHERE twitchID = :key1");
        $stmt->bindParam(':key1', $twid, PDO::PARAM_INT);
        $stmt->bindParam(':key2', $stNm, PDO::PARAM_STR);
        $stmt->bindParam(':key3', $stDt, PDO::PARAM_STR);
        $stmt->bindParam(':key4', $stCl, PDO::PARAM_STR);
        $stmt->execute();
        $response = [
            "message" => "Updated Record successfully",
        ];
        echo json_encode($response);
        $conn = null;
    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
    }