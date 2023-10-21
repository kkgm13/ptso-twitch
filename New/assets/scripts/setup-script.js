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
    streamerUserName = twitchUser
    // console.log(`You entered: ${twitchUser}`);
    readline.question('Add Your Twitch Client ID: >  ', (clientID) => {
        clientid = clientID
        // console.log(`You entered: ${clientID}`);
        readline.question('Add Your Twitch Client Secret >  ', (clientSecret) => {
            clientsecret = clientSecret            
            // console.log(`You entered: ${clientSecret}`);
            setup()
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