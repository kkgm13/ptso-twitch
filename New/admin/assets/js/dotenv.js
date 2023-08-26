const path = require('path')

const dotenvPath = path.join(__dirname, '../../../.env')
require('dotenv').config({path: dotenvPath})
const fs = require('fs')
const axios = require('axios').default

const args = process.argv.slice(2);
let streamerUserName = null

if (args.length === 0) {
    if(!process.env.TWITCH_USER){
        console.error("Please provide your Twitch Username.");
        process.exit(1); // Exit with an error code
    } else {
        streamerUserName = process.env.TWITCH_USER
        setup()
    }
} else {
    streamerUserName = args[0];
    console.log("Provided argument:", streamerUserName);
    setToDotEnv(TWITCH_USER, streamerUserName)
    setup()
}


function setup(){
    axios.post('https://id.twitch.tv/oauth2/token', {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
    })
    .then(function (response) {
        setToDotEnv('TWITCH_ACCESS_TOKEN', response.data.access_token)
    
        axios.get('https://api.twitch.tv/helix/users', {
            params: {
                login: streamerUserName
            },
            headers: {
                'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        })
        .then(function (response) {        
            setToDotEnv('TWITCH_STREAMER_ID', response.data.data[0].id)
        })
        .catch(function (error) {
            console.log("ERROR - " + error);
        });
    })
    .catch(function(error) {
        console.log("Error! - " + error)
    });
}
 

function setToDotEnv( keyName, valueName){
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