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
            this.streamer.twitchID = '';
            this.streamer.streamerName = '';
            this.streamer.streamerDetails = '';
            this.streamer.streamerColor = '#666666';
            document.getElementById('streamerName').removeAttribute("readonly","readonly")
        },
        submitForm() {
            let finder = this.findStreamerInRecord(streamer)
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
            var streamSearch = (document.getElementById('streamerName').value).toLowerCase()
            console.log("Searching on Twitch for "+streamSearch)
            // Connect to Twitch API
            axios.get('https://api.twitch.tv/helix/users', {
                params: {
                    login: streamSearch
                },
                                headers: {
                    'Client-Id': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                }
            })
            .then(function (response) {
                // Get Streamer info via StreamerName
                if(!response.data){
                    // Handler needed for possible no-usernames
                    alert('No Twitch User found with that name')
                } else {
                    // Set Twitch ID
                    alert('Found Twitch User: ' + streamSearch + "\nAttaching Twitch ID to form... Locking Streamer Name to complete form. \nUse the reset button to reset the form.")
                    document.getElementById('twitchID').value = response.data.data[0].id
                    document.getElementById('streamerName').setAttribute("readonly","readonly")
                    // if(response.data.data[0].login !== this.streamer.streamerName){
                    //     alert("Name Change Detection found! Updating the Streamer Name!")
                    //     document.getElementById('streamerName').value = response.data.data[0].login
                    // }
                }
            })
            .catch(function (error) {
                console.log("ERROR - " + error);
            })   
        }
    }, 
    template: '<form @reset.prevent=resetForm @submit.prevent=submitForm><div class=mb-1><h5 class=text-center>New Streamer Info</h5></div><hr><input v-model="twitchID" type="hidden" id="twitchID" name="twitchID"><fieldset><div class="input-group mb-3"><input class=form-control v-model=streamer.streamerName aria-describedby=streamerName aria-label="Streamer Name"id=streamerName name=streamerName placeholder="Streamer Name"> <button class="btn btn-outline-primary"type=button @click=findStreamerID><i class="bi bi-search"></i></button><div class=form-text>Use the Search Button to locate the exact unique Twitch ID of provided streamer, in the event of Streamer Name Changes</div></div><div class=form-floating><textarea class=form-control placeholder="Streamer Details"v-model=streamer.streamerDetails></textarea><label for=streamerDetails>Details of Streamer</label></div><div class=form-text>Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input class=form-control v-model=streamer.streamerColor title="Choose the Streamer Color"type=color><label for=streamerColor class=form-label>Color Association</label></div></fieldset><hr><div class="form-group row"><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-success"type=submit>Add/Update</button></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-danger"type=reset>Clear</button></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');