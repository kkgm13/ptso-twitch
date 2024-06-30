// Packages Implementation
const path = require('path')
const dotenvPath = path.join(__dirname, '../.env')
require('dotenv').config({path: dotenvPath})
const fs = require('fs')
const axios = require('axios').default
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Strings for dotENVs
let streamerUserName = null
let clientid = null
let clientsecret = null
let access_token = null

console.warn("Please Ensure that you have already created a Personal PTSO via Twitch Dev. (You can login with your usual account credentials, as the following questions require details of a created Twitch Dev Application.")

// Validate information to be used
readline.question('Your Twitch Username? > ', (twitchUser) => {
    streamerUserName = twitchUser
    setToDotEnv("TWITCH_USER", streamerUserName)
    readline.question('Add Your Twitch Client ID: >  ', (clientID) => {
        clientid = clientID
        setToDotEnv("TWITCH_CLIENT_ID", clientid)
        readline.question('Add Your Twitch Client Secret >  ', (clientSecret) => {
            clientsecret = clientSecret
            setToDotEnv("TWITCH_CLIENT_SECRET", clientSecret)
            setupTwitchSecret()
            readline.close();
        });
    });
});

/**
 * Connect with Twitch API and create access token
 * @returns Access Token for Twitch User 
 */
function setupTwitchSecret(){
    axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: clientid,
        client_secret: clientsecret,
        grant_type: 'client_credentials'
    })
    .then(function (response) {
        access_token = response.data.access_token
        setToDotEnv("TWITCH_ACCESS_TOKEN", access_token)
    
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
            setToDotEnv('TWITCH_STREAMER_ID', response.data.data[0].id)
            console.log("--------------------------") 
            console.log("Please keep this for your reference")
            console.log("Twitch Client Access Token: "+access_token)
            console.log("")  
            console.warn("Associated Twitch Dev Data has been added to the .env file. Please keep this file safe at all times")
            console.warn("Rerun this command if any of the following is required:")
            console.warn("1) The Access Token requires to be renewed")
            console.warn("2) The Client Secret is renewed via Twitch Dev Dashboard,OR")
            console.warn("3) The entire Twitch Dev Application is rebuilt via the Twitch Dev Dashboard")
        })
        .catch(function (error) {
            console.log("ERROR - " + error);
        });
    })
    .catch(function(error) {
        console.log("Error! - " + error)
    });
}

/**
 * Allow to set a Value based on a defined dotENV keyname
 * @param {*} keyName       Key within the dotenv file
 * @param {*} valueName     Value to be associated with the key
 */
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
        if (item.key === keyName) {item.value = valueName};
        return item;
    });
    // Build the updated content
    const updatedContent = updatedKeyValuePairs.map(item => `${item.key}=${item.value}`).join('\n');
    // Write the updated content back to the dotenv file
    fs.writeFileSync(dotenvPath, updatedContent);
}