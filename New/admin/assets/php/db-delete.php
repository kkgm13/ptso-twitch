<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        $twitchID = $_GET['twitchID'];
        $sql = "DELETE FROM $dbname WHERE twitchID = $twitchID";
        $conn->query($sql);
        $conn->exec($sql);
        $response = [
            "message" => "Streamer Record Deleted",
        ];
        echo json_encode($response);
        $conn = null;
    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
    }