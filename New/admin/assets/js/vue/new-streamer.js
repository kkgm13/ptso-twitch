const axios = require('axios').default; // Enable AXIOS-HTTP

let accessToken; // Obtain Access Token

axios.post('https://id.twitch.tv/oauth2/token', {
    client_id: 'myClientID',
    client_secret: 'myClientSecret',
    grant_type: 'client_credentials'
})
.then(function (response) {
    console.log("Response Found - " + response);
    console.log("Response Data Found - " + response.data);

    accessToken = response.data.access_token;
    console.log(accessToken); // shows the token fine here

    let twitchApi = axios.create({
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Client-ID": API_KEY
        }
    });
})
.catch(function(error) {
    console.log("Error! - " + error)
}); 

const appNewStreamer = Vue.createApp({
    mounted() {
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            streamer: {
                twitchID: '', // Check how to store ASAP
                streamerName: '',
                streamerDetails: '',
                streamerColor: '#666666',
            }
        }
    },
    methods: {
        resetForm() {
            this.streamer.streamerName = '';
            this.streamer.streamerDetails = '';
            this.streamer.streamerColor = '#666666';
        },
        submitForm() {
            let finder = this.findStreamerInFile(streamer)
            // console.log(finder)
            if( finder[0] === true){
                if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerName = streamer.streamerName
                    json[finder[1]].streamerDetails = streamer.streamerDetails
                    json[finder[1]].streamerColor = streamer.streamerColor
                }
            } else {
                let streamID = this.findStreamerID((streamer.streamerName).toLowerCase());
                console.log("Data Collected:" + streamID)
                // json.push(streamer)
            }
            console.log('Submitting form...');
        },
        findStreamerInRecord(streamerName){ // Change json to proper Database System
            console.log('Searching for streamer:', this.streamerName);
            // Find Streamer
        }, 
        findStreamerID() {
            var streamSearch = document.getElementById('streamerName').value
            console.log("Searching on Twitch for "+streamSearch)
            // Connect to Twitch API
            axios.get('https://api.twitch.tv/helix/users', {
                params: {
                    ID: 12345
                },
                    headers: {
                    'Client-Id': 'iwnng4cs84csy2v5ueo69y',
                    'Authorization': 'Bearer 1n44alq5a9n4e9oz8j4'
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });  
            // Get Streamer info via StreamerName
                // Handler needed for possible no-usernames
            // Extract and store Streamer ID
        }
    }, 
    template: '<form @reset.prevent=resetForm @submit.prevent=submitForm><div class=mb-1><h5 class=text-center>New Streamer Info</h5></div><hr><fieldset><div class="input-group mb-3"><input class=form-control v-model=streamer.streamerName aria-describedby=streamerName aria-label="Streamer Name"id=streamerName name=streamerName placeholder="Streamer Name"> <button class="btn btn-outline-primary"type=button @click=findStreamerID><i class="bi bi-search"></i></button><div class=form-text>Use the Search Button to dictate the exact unique Twitch ID, in the event of Streamer Name Changes</div></div><div class=form-floating><textarea class=form-control placeholder="Streamer Details"v-model=streamer.streamerDetails></textarea><label for=streamerDetails>Details of Streamer</label></div><div class=form-text>Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input class=form-control v-model=streamer.streamerColor title="Choose the Streamer Color"type=color><label for=streamerColor class=form-label>Color Association</label></div></fieldset><hr><div class="form-group row"><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-success"type=submit>Add/Update</button></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-danger"type=reset>Clear</button></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');