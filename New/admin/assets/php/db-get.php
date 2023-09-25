<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        // Define an SQL SELECT statement
        $sql = "SELECT * FROM streamers WHERE twitchID <> 0";

        // Prepare and execute the SQL statement
        $stmt = $conn->query($sql)->fetchAll();
    
        // Fetch the data as an associative array
        $response = [
            "message" => "All Records Retrieved",
            'data' => $stmt
        ];
        echo json_encode($response);
        $conn = null;
    } catch (PDOException $e){
        $response = [
            "message" => "ERROR: " . $e->getMessage(),
        ];
        echo json_encode($response);
    }