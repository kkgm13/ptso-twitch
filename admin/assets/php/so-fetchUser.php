<?php
    header("Content-Type: application/json");
    include 'db-handler.php';

    try{
        echo json_encode(isset($_GET['streamerName']));
        if(isset($_GET['streamerName'])){
            $twitchID = $_GET['streamerName'];
            $sql = "SELECT * FROM streamers WHERE streamerName = $streamerName";
        } else {
            // $response = [
            //     "error" => "Unknown 'type' parameter value",
            // ];
            // echo json_encode($response);
            $conn = null;
            exit();
        }
        

        $stmt = $conn->query($sql);
        $stmt->execute();
        $stmt = $stmt->fetchAll(PDO::FETCH_ASSOC);

//         $sql = "SELECT * FROM your_table WHERE id = $id";
// $result = $conn->query($sql);

// // Fetch data and encode it as JSON
// $data = array();
// while ($row = $result->fetch_assoc()) {
//     $data[] = $row;
// }

        
        $response = [
            "message" => "Record Retrieved",
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