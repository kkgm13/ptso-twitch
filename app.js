const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const cors = require ('cors');

// Start System
const app = express();

//SQLite Database
const db = new sqlite3.Database('./streamers.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        console.log("Streamer Database Created!")
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
});

db.once('open', (stream) => {
    console.log("Streamer Database found!");
    console.log("Connected to Database");
})

//middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send("Hello World");
});

// app.use('/', express.static(path.join(__dirname, '/admin')))

app.use(function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

// Start the server
app.listen(3000, console.log("Listening on Port 3000"));

// SQL3 Functions to work
function createDatabase() {
    var newdb = new sqlite3.Database('streamers.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
        CREATE TABLE streamers (
            twitchID INT primary key NOT NULL,
            streamerName TEXT NOT NULL,
            streamerDetails TEXT NOT NULL,
            streamerColor TEXT NOT NULL
        );

        INSERT INTO streamers (twitchID, streamerName, streamerDetails, streamerColor)
            VALUES (0, 'ptso-twitch', 'personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;', '#666666');
    `);
}