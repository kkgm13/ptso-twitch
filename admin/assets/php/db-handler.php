<?php
    header("Content-Type: application/json");
        
    $host = 'localhost';
    $port = 'port';
    $dbname = 'streamers';
    $username = 'root';
    $password = 'root';
    $formData = json_decode(file_get_contents("php://input"), true);

    try {
        $dbo = "mysql:host=$host;port=$port;dbname=$dbname";
        $conn = new PDO($dbo, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $response = [
            "message" => "Connected to $dbname at $host successfully.",
        ];
    } catch (PDOException $pe) {
        $response = [
            "message" => "Could not connect to the database $dbname :" . $pe->getMessage(),
        ];
        echo json_encode($response);
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
