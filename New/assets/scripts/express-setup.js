// ExpressJS
const express = require('express')
const app = express()
const hostname = "127.0.0.1";
const port = 3000
//File System
const fs = require('fs')
// Dir Path Usage
const path = require('path')
// DotEnv
const dotenvPath = path.join(__dirname, '../../.env')
require('dotenv').config({path: dotenvPath})
// SQLite
// const sqlite3 = require('sqlite3').verbose()
// const db = sqlite3.Database('streamer.db')


function dbCreation(){
    // Path file of db
    const dbFile = path.join(__dirname, '../../admin/streamers.db');
    fs.access(dbFile, fs.constants.F_OK, error => {
        if (error){
            console.log("Error Found: "+error)
            return;
        } else {
            fs.writeFile(dbFile, "", (error) => {
                console.log("Error Creating Database", error)
                return;
            })
            console.log("Database has been created successfully!")
            console.warn("WARN: Deleting/Moving this database file will have issues with backing up in future updates", )
        }
    })
}

// Use this to run Admin page
app.use('/', express.static(path.join(__dirname, '../../admin')))

app.use(function(req,res){
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

// Listen to system
app.listen(port, () => {
    console.log('Accessing .env files')
    console.log(`PTSO-Twitch is active!. Listening on ${hostname}:${port}`)
})