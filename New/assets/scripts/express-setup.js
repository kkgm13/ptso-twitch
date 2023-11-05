const express = require('express')
const app = express()
const hostname = "127.0.0.1";
const port = 3000
const fs = require('fs')
const path = require('path')
// const dotenvPath = path.join(__dirname, '../../../.env')
// require('dotenv').config({path: dotenvPath})

// const sqlite3 = require('sqlite3').verbose()
// const db = sqlite3.Database('streamer.db')


function dbCreation(){
    // Path file of db
    const dbFile = path.join(__dirname, '../../streamers.db');
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

app.use('/', express.static(path.join(__dirname, '../../admin')))

// app.get('/', (req, res) => {    
    // res.sendFile(path.join(__dirname, '../../admin/assets/css/stylesheets.css'))
    // res.sendFile(path.join(__dirname, '../../admin/')) // Works but Vue & csS are broken
// })

app.listen(port, () => {
    console.log('Accessing .env files')
    console.log(`PTSO-Twitch is active on localhost, listening on ${hostname}:${port}`)
})