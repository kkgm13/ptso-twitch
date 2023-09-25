<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        $twid = $formData['twitchID'];
        $stNm = strtolower($formData['streamerName']);
        $stDt = $formData['streamerDetails'];
        $stCl = $formData['streamerColor'];
        // ----- Version 1
        // $sql = "INSERT INTO $dbname (twitchID, streamerName, streamerDetails, streamerColor) VALUES (:key1, \":key2\", \":key3\", \":key4\")";
        // $params = array(':key1' => $twid, ':key2' => $stNm, ':key3' => $stDt, ':key4' => $stCl);
        // echo json_encode($params);
        // $conn->prepare($sql);
        // $conn->exec($params);
        // ----- Version 2
        $sql = "INSERT INTO $dbname (twitchID, streamerName, streamerDetails, streamerColor) VALUES ($twid , \"$stNm\", \"$stDt\" , \"$stCl\" )";         
        $conn->exec($sql);
        $response = [
            "message" => "New record created successfully",
        ];
        $conn = null;
        echo json_encode($response);
    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
    }