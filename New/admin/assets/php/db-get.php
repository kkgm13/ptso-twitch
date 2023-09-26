<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{

        if(isset($_GET['type'])){
            $type = $_GET['type'];
            if ($type === 'all') {
                $sql = "SELECT * FROM streamers WHERE twitchID <> 0";
            } else if ($type === 'single') {
                $twitchID = $_GET['twitchID'];
                $sql = "SELECT * FROM streamers WHERE twitchID == $twitchID";
            } else {
                $response = [
                    "error" => "Unknown 'type' parameter value",
                ];
                echo json_encode($response);
                $conn = null;
                exit();
            }
        } else {
            // 'type' parameter is missing, return an error response
            $response = [
                "error" => "Missing 'type' parameter",
            ];
            echo json_encode($response);
            $conn = null;
            exit();
        }
        // Prepare and execute the SQL statement
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $stmt = $stmt->fetchAll(PDO::FETCH_ASSOC);
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