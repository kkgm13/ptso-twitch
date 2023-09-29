const path = require('path')

const dotenvPath = path.join(__dirname, '../../../.env')
require('dotenv').config({path: dotenvPath})

const fs = require('fs')
const axios = require('axios').default
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let streamerUserName = null
let clientid = null
let clientsecret = null
let access_token = null

readline.question('Your Twitch Username? > ', (twitchUser) => {
    // console.log(`You entered: ${twitchUser}`);
    streamerUserName = twitchUser

    readline.question('Add Your Twitch Client ID: >  ', (clientID) => {
        // console.log(`You entered: ${clientID}`);
        clientid = clientID

        readline.question('Add Your Twitch Client Secret >  ', (clientSecret) => {
            // console.log(`You entered: ${clientSecret}`);
            clientsecret = clientSecret            
            setup()
            // dbCreation() // SQLite Creation
            readline.close();
        });
    });
});

function setup(){
    axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: clientid,
        client_secret: clientsecret,
        grant_type: 'client_credentials'
    })
    .then(function (response) {
        access_token = response.data.access_token
    
        axios.get('https://api.twitch.tv/helix/users', {
            params: {
                login: streamerUserName
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': clientid
            }
        })
        .then(function (response) {      
            console.log("")  
            console.log("--------------------------")
            console.warn("Parameters for Twitch User: " + streamerUserName + ` (Twitch ID: ${response.data.data[0].id})`)
            console.log("--------------------------")
            console.warn("Please IMMEDIATELY populate assets/js/vue/new-streamer.js with the critical information below: ")
            console.log("")  
            console.log("Twitch Client Access Token: "+access_token)
            console.log("")  
        })
        .catch(function (error) {
            console.log("ERROR - " + error);
        });
    })
    .catch(function(error) {
        console.log("Error! - " + error)
    });
}
 
function dbCreation(){
    // Path file of db
    const dbFile = path.join(__dirname, '../../streamers.db');
    fs.access(dbFile, fs.constants.F_OK, error => {
        if (error){
            console.log("Error Found: "+error)
            return;
        } else {
            fs.writeFile(dbFile, "",(error) =>{
                console.log("Error Creating Database", error)
                return;
            })
            console.log("Database has been created successfully!")
            console.warn("WARN: Deleting/Moving this database file will have issues with backing up in future updates", )
        }
    })
}

function setToDotEnv(keyName, valueName){
    // Read the content of the dotenv file
    const content = fs.readFileSync(dotenvPath, 'utf-8');

    // Parse the content into key-value pairs
    const keyValuePairs = content.split('\n').map(line => {
        const [key, value] = line.split('=');
        return { key, value };
    });

    // Find and update the value for the specified key
    const updatedKeyValuePairs = keyValuePairs.map(item => {
        if (item.key === keyName) {
            item.value = valueName;
        }
        return item;
    });

    // Build the updated content
    const updatedContent = updatedKeyValuePairs.map(item => `${item.key}=${item.value}`).join('\n');

    // Write the updated content back to the dotenv file
    fs.writeFileSync(dotenvPath, updatedContent);

    console.log(keyName + ' updated successfully.');
}