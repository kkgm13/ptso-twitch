<?php
    header("Content-Type: application/json");
        
    function dbConnect($host,$port,$dbname,$username,$password){
        try {
            $dbo = "mysql:host=$host;port=$port;dbname=$dbname";
            $conn = new PDO($dbo, $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $response = [
                "message" => "Connected to $dbname at $host successfully.",
            ];
            echo json_encode($response);
            return $conn;
        } catch (PDOException $pe) {
            $response = [
                "message" => "Could not connect to the database $dbname :" . $pe->getMessage(),
            ];
            echo json_encode($response);
        }
    }

    $host = 'localhost';
    $port = 'port';
    $dbname = 'streamers';
    $username = 'root';
    $password = 'root';
    $formData = json_decode(file_get_contents("php://input"), true);

    function dbSetup($host,$port,$dbname,$username,$password,$formData){
        $conn = dbConnect($host,$port,$dbname,$username,$password);
        formtoDB($conn,$dbname, $formData);
        dbClose($conn, $dbname);
    }

    // function checkDBCreated(){
    //     $db_check = $conn->query("SHOW DATABSES LIKE ".$dbName);
    //     if(!$db_check){
    //         try{
    //             $sql = "CREATE DATABASE $dbname";
    //             $conn->exec($sql);
                    // $response = [
                    //     "message" => "Created $dbname successfully",
                    // ];
                    // echo json_encode($response);
    //         } catch (PDOException $e){
                    // $response = [
                    //     "message" => "Could not create database $dbname :" . $e->getMessage(),
                    // ];
                    // echo json_encode($response);
    //         }
    //         // MySQL Create Table
    //         try{
    //             $sql = "CREATE TABLE streamers (
    //             twitchID INTEGER PRIMARY KEY,
    //             streamerName TEXT NOT NULL,
    //             streamerDetails TEXT NOT NULL,
    //             streamerColor TEXT NOT NULL,
    //             )";
    //             $conn->exec($sql);
    //             echo "Table created successfully";                
    //         } catch (PDOException $e){
    //              echo "Could not create database table:" . $e->getMessage();
    //         }
    //     }
    // }

    function formtoDB($conn, $dbname, $formData){
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
            echo json_encode($response);
        } catch (PDOException $e){
            $response = [
                "message" => "ERROR: " . $e->getMessage(),
            ];
            echo json_encode($response);
        }
    }

    function dbClose($conn, $dbname) {
        try{
            $conn = null;
            $response = [
                "message" => "Closed Database $dbname connection:",
            ];
            echo json_encode($response);
        } catch(PDOException $pe) {
            $response = [
                "message" => "Could not connect to the database $dbname :" . $pe->getMessage(),
            ];
            echo json_encode($response);
        }
        
    }

    dbSetup($host,$port,$dbname,$username,$password,$formData);